/* ============================================================
   إشارات الحب — app
   ============================================================ */
'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const app = document.getElementById('app');
const toastEl = document.getElementById('toast');
const fxCanvas = document.getElementById('fx');

const UNITS = [...CONTENT.units].sort((a, b) => Number(a.number) - Number(b.number));
const STORAGE_KEY = 'alaa_signals_love_v1';
const DAILY_GOAL = CONTENT.dailyGoal || 50;

const DEFAULT_STATE = {
  xp: 0,
  hearts: 5,
  streak: 0,
  lastStudy: null,
  dailyDate: null,
  dailyXp: 0,
  completed: {},
  sound: true,
  totalAnswered: 0,
  totalCorrect: 0,
  reviews: 0
};

let state = loadState();
let session = null;
let activeDraws = [];
let toastTimer = null;

/* ---------------- helpers ---------------- */
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return { ...DEFAULT_STATE, ...saved, completed: saved.completed || {} };
  } catch (e) {
    return { ...DEFAULT_STATE };
  }
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}
function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return todayKey(d);
}
function syncDaily() {
  const t = todayKey();
  if (state.dailyDate !== t) {
    state.dailyDate = t;
    state.dailyXp = 0;
    saveState();
  }
}
function markStudy() {
  const t = todayKey();
  if (state.lastStudy === t) return;
  state.streak = state.lastStudy === yesterdayKey() ? (state.streak || 0) + 1 : 1;
  state.lastStudy = t;
  saveState();
}
function findLesson(id) {
  for (const unit of UNITS) {
    const idx = unit.lessons.findIndex(l => l.id === id);
    if (idx !== -1) return { unit, lesson: unit.lessons[idx], index: idx };
  }
  return null;
}
function allLessons() {
  return UNITS.flatMap(u => u.lessons.map(l => ({ unit: u, lesson: l })));
}
function totalLessons() { return allLessons().length; }
function isDone(id) { return !!state.completed[id]; }
function completedCount() { return allLessons().filter(x => isDone(x.lesson.id)).length; }
function unitDone(unit) { return unit.lessons.filter(l => isDone(l.id)).length; }
function nextLesson() {
  return allLessons().find(x => !isDone(x.lesson.id)) || null;
}
function nextAfter(unitId, lessonId) {
  const all = allLessons();
  const i = all.findIndex(x => x.lesson.id === lessonId);
  for (let j = i + 1; j < all.length; j++) {
    if (!isDone(all[j].lesson.id)) return all[j];
  }
  return null;
}
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'صباح الفل';
  if (h < 18) return 'نهارك سعيد';
  return 'مساء الفل';
}
function randomOf(arr, seed = Math.random()) {
  return arr[Math.floor(seed * arr.length) % arr.length];
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function normAnswer(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
    .replace(/[,\s\u00a0]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/µ/g, 'u')
    .replace(/μ/g, 'u');
}
function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function toast(msg) {
  clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}
function vibrate(p) {
  try { navigator.vibrate && navigator.vibrate(p); } catch (e) {}
}

/* ---------------- sound ---------------- */
const Sound = {
  ctx: null,
  ensure() {
    if (!state.sound) return null;
    try {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    } catch (e) { return null; }
  },
  tone(freq, delay = 0, dur = 0.12, type = 'sine', vol = 0.06) {
    const ctx = this.ensure();
    if (!ctx) return;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  },
  tap() { this.tone(520, 0, 0.05, 'triangle', 0.025); },
  select() { this.tone(660, 0, 0.06, 'sine', 0.03); },
  correct() {
    this.tone(523.25, 0, 0.12, 'sine', 0.055);
    this.tone(659.25, 0.09, 0.12, 'sine', 0.055);
    this.tone(783.99, 0.18, 0.18, 'sine', 0.05);
  },
  wrong() {
    this.tone(196, 0, 0.16, 'sawtooth', 0.03);
    this.tone(155, 0.12, 0.2, 'sine', 0.035);
  },
  complete() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, i * 0.11, 0.24, 'sine', 0.05));
  }
};

/* ---------------- confetti / hearts ---------------- */
const fxCtx = fxCanvas.getContext('2d');
let fxParts = [];
let fxRaf = null;
let dpr = Math.min(window.devicePixelRatio || 1, 2);

function sizeFx() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  fxCanvas.width = Math.floor(innerWidth * dpr);
  fxCanvas.height = Math.floor(innerHeight * dpr);
  fxCanvas.style.width = innerWidth + 'px';
  fxCanvas.style.height = innerHeight + 'px';
}
sizeFx();
window.addEventListener('resize', sizeFx);

function burst(opts = {}) {
  const count = opts.count || 46;
  const palette = ['#FF5C8A', '#FFB020', '#7C5CFF', '#58CC02', '#38BDF8', '#FF8DAE'];
  const cx = innerWidth / 2;
  const cy = opts.originY || innerHeight * 0.38;
  for (let i = 0; i < count; i++) {
    const ang = (-Math.PI / 2) + (Math.random() - 0.5) * Math.PI * 1.6;
    const spd = 4 + Math.random() * 9;
    fxParts.push({
      x: cx + (Math.random() - 0.5) * 40,
      y: cy,
      vx: Math.cos(ang) * spd + (Math.random() - 0.5) * 3,
      vy: Math.sin(ang) * spd - Math.random() * 3,
      g: 0.16 + Math.random() * 0.12,
      life: 70 + Math.random() * 35,
      age: 0,
      size: 5 + Math.random() * 7,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      color: palette[Math.floor(Math.random() * palette.length)],
      heart: Math.random() < 0.28
    });
  }
  if (!fxRaf) fxTick();
}
function drawHeart(ctx, x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.3);
  ctx.bezierCurveTo(x, y, x - s * 0.5, y, x - s * 0.5, y + s * 0.3);
  ctx.bezierCurveTo(x - s * 0.5, y + s * 0.62, x, y + s * 0.8, x, y + s);
  ctx.bezierCurveTo(x, y + s * 0.8, x + s * 0.5, y + s * 0.62, x + s * 0.5, y + s * 0.3);
  ctx.bezierCurveTo(x + s * 0.5, y, x, y, x, y + s * 0.3);
  ctx.closePath();
  ctx.fill();
}
function fxTick() {
  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
  fxCtx.save();
  fxCtx.scale(dpr, dpr);
  fxParts = fxParts.filter(p => p.age < p.life && p.y < innerHeight + 60);
  for (const p of fxParts) {
    p.age++;
    p.vy += p.g;
    p.vx *= 0.992;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    const alpha = Math.max(0, 1 - p.age / p.life);
    fxCtx.globalAlpha = alpha;
    fxCtx.fillStyle = p.color;
    if (p.heart) {
      fxCtx.save();
      fxCtx.translate(p.x, p.y);
      fxCtx.rotate(p.rot);
      drawHeart(fxCtx, 0, 0, p.size * 1.5);
      fxCtx.restore();
    } else {
      fxCtx.save();
      fxCtx.translate(p.x, p.y);
      fxCtx.rotate(p.rot);
      fxCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      fxCtx.restore();
    }
  }
  fxCtx.restore();
  fxCtx.globalAlpha = 1;
  if (fxParts.length) fxRaf = requestAnimationFrame(fxTick);
  else { fxRaf = null; fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height); }
}

/* ---------------- icons / mascot ---------------- */
const ICONS = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4.5 13.5H10l-1 8.5 8.5-11.5H12l1-8.5Z"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z"/><path d="M8 7h8M8 11h6"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.7-9.3-9C1.2 8.3 3.2 4.5 7 4.5c2 0 3.6 1.2 5 2.9 1.4-1.7 3-2.9 5-2.9 3.8 0 5.8 3.8 4.3 7.5C19.5 16.3 12 21 12 21Z"/></svg>',
  wave: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h4l2.5-7 4 14 3-9 2 2h4.5"/></svg>'
};

function brandMark() {
  return `<span class="brand-mark" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 12h3.2l1.8-5 3 10 2.4-7 1.6 2H22"/>
    </svg>
  </span>`;
}

function mascotSVG(cls = '') {
  return `<svg class="mascot ${cls}" viewBox="0 0 170 170" role="img" aria-label="قلب صغير بيبتسم">
    <defs>
      <linearGradient id="mgrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FF9DBB"/><stop offset=".55" stop-color="#FF5C8A"/><stop offset="1" stop-color="#E83E70"/>
      </linearGradient>
      <linearGradient id="mglow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <ellipse cx="85" cy="154" rx="42" ry="7" fill="#D8A0B5" opacity=".25"/>
    <path d="M85 37C59 13 25 29 27 62c2 34 34 63 58 83 24-20 56-49 58-83 2-33-32-49-58-25Z" fill="url(#mgrad)" stroke="#E83E70" stroke-width="2"/>
    <path d="M85 37C59 13 25 29 27 62c2 34 34 63 58 83 24-20 56-49 58-83 2-33-32-49-58-25Z" fill="url(#mglow)" opacity=".35"/>
    <ellipse cx="63" cy="76" rx="10.5" ry="12" fill="#fff"/>
    <ellipse cx="107" cy="76" rx="10.5" ry="12" fill="#fff"/>
    <circle cx="65" cy="79" r="5.2" fill="#3D2438"/>
    <circle cx="109" cy="79" r="5.2" fill="#3D2438"/>
    <circle cx="67" cy="77" r="1.8" fill="#fff"/>
    <circle cx="111" cy="77" r="1.8" fill="#fff"/>
    <ellipse cx="46" cy="96" rx="8" ry="4.6" fill="#E83E70" opacity=".35"/>
    <ellipse cx="124" cy="96" rx="8" ry="4.6" fill="#E83E70" opacity=".35"/>
    <path d="M76 96c3 5 7 7 9 7s6-2 9-7" fill="none" stroke="#6B1E3C" stroke-width="3" stroke-linecap="round"/>
    <path d="M42 119h16l6-12 9 25 7-17 5 4h43" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" opacity=".92"/>
    <path d="M132 46c2-4 7-4 8 0 1 3-3 6-4 7-1-1-5-4-4-7Z" fill="#fff" opacity=".85"/>
    <circle cx="144" cy="33" r="2.3" fill="#FFD1DF"/>
    <circle cx="29" cy="42" r="1.8" fill="#FFD1DF"/>
  </svg>`;
}

function topbar(active = '') {
  return `<header class="topbar">
    <div class="brand">
      ${brandMark()}
      <div>
        <div class="brand-name">إشارات الحب</div>
        <div class="brand-sub">رحلة آلاء في DSP</div>
      </div>
    </div>
    <div class="top-stats">
      <span class="chip" title="Streak"><span class="em">🔥</span>${state.streak || 0}</span>
      <span class="chip" title="XP"><span class="em">⚡</span>${state.xp || 0}</span>
      <button class="icon-btn" data-action="toggle-sound" aria-label="صوت">${state.sound ? '🔊' : '🔇'}</button>
    </div>
  </header>`;
}

function bottomNav(active) {
  return `<nav class="bottom-nav" aria-label="التنقل">
    <button class="nav-item ${active === 'home' ? 'active' : ''}" data-action="go" data-to="#/home">${ICONS.home}<span>الرحلة</span></button>
    <button class="nav-item ${active === 'review' ? 'active' : ''}" data-action="go" data-to="#/review">${ICONS.bolt}<span>مراجعة</span></button>
    <button class="nav-item ${active === 'sheet' ? 'active' : ''}" data-action="go" data-to="#/sheet">${ICONS.book}<span>الدفتر</span></button>
    <button class="nav-item ${active === 'me' ? 'active' : ''}" data-action="go" data-to="#/me">${ICONS.heart}<span>أنا</span></button>
  </nav>`;
}

/* ---------------- exam ---------------- */
function examInfo() {
  const exam = new Date(CONTENT.examISO);
  const now = new Date();
  const diff = exam - now;
  if (diff <= 0) {
    return { title: 'الامتحان عدّى', sub: 'إنتي عملتي اللي عليكي… وأنا فخور بيكي مهما كانت النتيجة 💗', urgent: false };
  }
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days >= 1) {
    return { title: `فاضل ${days} ${days === 1 ? 'يوم' : 'أيام'}`, sub: 'امتحانك بكرة… وإحنا هنعديها مع بعض 💪', urgent: true };
  }
  return { title: `فاضل ${hours} ساعة`, sub: 'خطة النجاة جاهزة… يلا نبدأ', urgent: true };
}

/* ---------------- home ---------------- */
function renderHome() {
  syncDaily();
  const done = completedCount();
  const total = totalLessons();
  const next = nextLesson();
  const pct = Math.min(100, Math.round((state.dailyXp / DAILY_GOAL) * 100));
  const r = 25;
  const circ = 2 * Math.PI * r;
  const exam = examInfo();
  const note = CONTENT.messages.notes[new Date().getDate() % CONTENT.messages.notes.length];
  const heroTitle = done === 0
    ? 'يلا نبدأ من الأول،<br><span class="hl">خطوة صغيرة</span> كفاية'
    : done >= total
      ? 'إنتي جاهزة…<br><span class="hl">اطمني</span> يا آلاء'
      : 'مكملين من حيث وقفنا<br>يا <span class="hl">آلاء</span>';
  const heroSub = next
    ? `الجاي: <b>${next.lesson.title}</b> · ${next.lesson.minutes} دقايق بس.`
    : 'خلصتي كل الدروس. راجعي الورقة وخدي نفس عميق.';

  app.innerHTML = `<div class="app">
    ${topbar('home')}
    <main class="content">
      <section class="hero">
        <div class="hero-content">
          <div class="eyebrow">💗 ${greeting()} يا آلاء</div>
          <h1>${heroTitle}</h1>
          <p>${heroSub}</p>
          <button class="btn primary" data-action="${next ? 'continue' : 'go'}" ${next ? '' : 'data-to="#/review"'}>
            ${next ? 'نكمّل من هنا' : 'مراجعة سريعة'} <span class="arrow">←</span>
          </button>
        </div>
        <div class="mascot-wrap">${mascotSVG()}</div>
        <div class="mascot-bubble">أنا معاكي، خطوة بخطوة 💗</div>
      </section>

      <div class="dash">
        <div class="goal-card">
          <div class="ring">
            <svg viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="${r}" fill="none" stroke="#F4E4DC" stroke-width="7"/>
              <circle cx="32" cy="32" r="${r}" fill="none" stroke="url(#ringGrad)" stroke-width="7" stroke-linecap="round"
                stroke-dasharray="${circ}" stroke-dashoffset="${circ - (circ * pct / 100)}"/>
              <defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#FFB020"/><stop offset="1" stop-color="#FF5C8A"/></linearGradient></defs>
            </svg>
            <span class="ring-label">${pct}%</span>
          </div>
          <div class="goal-info">
            <strong>هدف النهارده</strong>
            <span>${state.dailyXp} / ${DAILY_GOAL} XP</span>
            <span>${pct >= 100 ? 'خلصتيه! إنتي وحشة ✨' : 'خطوة صغيرة وخلصنا'}</span>
          </div>
        </div>
        <div class="mini-stats">
          <div class="mini-stat"><span class="em">🔥</span><div><b>${state.streak || 0} يوم</b><small>Streak</small></div></div>
          <div class="mini-stat"><span class="em">💗</span><div><b>${state.hearts} / 5</b><small>طاقة قلبك</small></div></div>
        </div>
      </div>

      <section class="rescue">
        <span class="pill">⚡ خطة النجاة</span>
        <h3>الوقت ضايق؟ عندي حل</h3>
        <p>مراجعة مركزة على أعلى أسئلة متوقعة: نايكويست، الطيف، فورييه… كله في 10 دقايق.</p>
        <div class="rescue-grid">
          <span>🏆 Nyquist</span><span>🌈 Spectrum</span><span>🎼 Fourier</span><span>🎯 12 سؤال</span>
        </div>
        <button class="btn" data-action="start-review">ابدأي مراجعة النجاة <span class="arrow">←</span></button>
      </section>

      <div class="section-title">
        <h2>خط السكة بتاعتك</h2>
        <span class="tiny">${done} / ${total} درس</span>
      </div>

      ${UNITS.map(unit => unitBlock(unit)).join('')}

      <div class="love-note">
        <div class="heart-line">💌</div>
        <p>${note}</p>
        <small>— من اللي بيحبك، ومش هيسيبك لحد ما تفهميها</small>
      </div>
      <div class="center" style="margin-top:14px">
        <span class="pill ${exam.urgent ? 'amber' : 'green'}">${exam.urgent ? '⏳' : '🤍'} ${exam.title}</span>
        <p style="font-size:11px;color:var(--muted);margin-top:6px">${exam.sub}</p>
      </div>
    </main>
    ${bottomNav('home')}
  </div>`;
}

function unitBlock(unit) {
  const d = unitDone(unit);
  const pct = Math.round((d / unit.lessons.length) * 100);
  const currentId = nextLesson()?.lesson.id;
  return `<section class="unit" style="--uc:${unit.color};--ucd:${unit.dark};--ue:'${unit.emoji}'">
    <div class="unit-head">
      <div class="unit-head-top">
        <span class="unit-num">${unit.number}</span>
        <div>
          <h2>${unit.title}</h2>
          <p>${unit.tagline}</p>
        </div>
        <span class="unit-count">${d}/${unit.lessons.length}</span>
      </div>
      <div class="unit-bar"><i style="width:${pct}%"></i></div>
    </div>
    <div class="path">
      ${unit.lessons.map(l => {
        const done = isDone(l.id);
        const current = l.id === currentId;
        return `<div class="path-step ${done ? 'done' : ''}">
          <button class="node ${done ? 'done' : ''} ${current ? 'current' : ''}" data-action="start-lesson" data-id="${l.id}" aria-label="${l.title}">
            ${done ? '✓' : l.icon}
            ${done ? '<span class="badge-done">✓</span>' : ''}
          </button>
          <div class="node-info">
            <strong>${l.title}</strong>
            <span>${l.subtitle} · ${l.minutes} د</span>
            ${current ? '<span class="now">✨ ابدأي من هنا</span>' : done ? '<span class="now" style="color:var(--green-dark)">تم ✓</span>' : ''}
          </div>
        </div>`;
      }).join('')}
    </div>
  </section>`;
}

/* ---------------- review landing ---------------- */
function renderReview() {
  const exam = examInfo();
  app.innerHTML = `<div class="app">
    ${topbar('review')}
    <main class="content">
      <div class="page-head">
        <div class="eyebrow">⚡ من غير لخبطة</div>
        <h1>مراجعة النجاة</h1>
        <p>لو الوقت ضايق، دي أحسن 10 دقايق ممكن تقضيها قبل الامتحان. 12 سؤال مختلط، وكل غلطة ليها شرح فوري.</p>
      </div>

      <section class="review-hero">
        <span class="big-num">12</span>
        <span class="pill">🎯 أعلى أسئلة متوقعة</span>
        <h2>${exam.title}… يلا نلحقها</h2>
        <p>الأسئلة بتتغير كل مرة، والغلط مش بيخصم حاجة. المهم تفهمي الفكرة قبل بكرة.</p>
        <button class="btn" data-action="start-review">ابدأي المراجعة <span class="arrow">←</span></button>
      </section>

      <div class="review-list">
        ${CONTENT.reviewIntro.map(x => `<div class="review-item">
          <span class="ic">${x.icon}</span>
          <div><b>${x.t}</b><span>${x.d}</span></div>
        </div>`).join('')}
      </div>

      <div class="section-title"><h2>بدل ما تلفّي</h2><span class="tiny">٣ حاجات بس</span></div>
      <div class="review-list">
        <div class="review-item"><span class="ic">🏆</span><div><b>نايكويست</b><span>fs ≥ 2fmax و Nyquist interval = 1/(2fmax)</span></div></div>
        <div class="review-item"><span class="ic">🌈</span><div><b>طيف الـ sampling</b><span>النسخ كل fs، والـ folding عند fs/2</span></div></div>
        <div class="review-item"><span class="ic">🎼</span><div><b>فورييه</b><span>a₀/2 + Σ sin/cos، والمربع bₙ=2/(nπ) للفردي</span></div></div>
      </div>

      <button class="btn ghost wide" data-action="go" data-to="#/sheet" style="margin-top:6px">افتحي ورقة المراجعة كاملة 📒</button>
      <button class="btn wide" data-action="go" data-to="#/home" style="margin-top:9px">رجوع للمسار</button>
    </main>
    ${bottomNav('review')}
  </div>`;
}

/* ---------------- cheat sheet ---------------- */
function renderSheet() {
  app.innerHTML = `<div class="app">
    ${topbar('sheet')}
    <main class="content">
      <div class="page-head">
        <div class="eyebrow">📒 لو نسيتي كل حاجة</div>
        <h1>دفتر الأفكار</h1>
        <p>كل القوانين المهمة في مكان واحد. افتحي اللي محتاجاه، واقفلي الباقي… وخدي معاكي الورقة دي بكرة.</p>
      </div>
      <div class="sheet-nav">
        <a href="#sheet-signals">الإشارات</a>
        <a href="#sheet-fourier">فورييه</a>
        <a href="#sheet-sampling">Sampling</a>
        <a href="#sheet-exam">الامتحان</a>
      </div>
      ${CONTENT.sheet.map((group, gi) => `<details class="sheet-group" id="sheet-${group.id}" ${gi === 0 ? 'open' : ''}>
        <summary><span class="ic">${group.icon}</span>${group.title}<span class="chev">◀</span></summary>
        <div class="sheet-body">
          ${group.items.map(it => `<div class="sheet-item">
            <b>${it.t}</b>
            <p>${it.d}</p>
            ${it.f ? `<div class="formula">${it.f}</div>` : ''}
          </div>`).join('')}
        </div>
      </details>`).join('')}

      <div class="love-note">
        <div class="heart-line">💗</div>
        <p>آلاء… إنتي مش محتاجة تحفظي كل حاجة. فهمتي الفكرة؟ خلاص، الباقي هيجيلك لوحدها.</p>
        <small>أنا واثق فيكي</small>
      </div>
    </main>
    ${bottomNav('sheet')}
  </div>`;
}

/* ---------------- profile ---------------- */
function renderProfile() {
  const done = completedCount();
  const total = totalLessons();
  const accuracy = state.totalAnswered ? Math.round((state.totalCorrect / state.totalAnswered) * 100) : 0;
  const doneIds = Object.keys(state.completed);
  const perfect = doneIds.some(id => {
    const c = state.completed[id];
    return c && c.score === c.total;
  });
  const fourierDone = UNITS.find(u => u.id === 'fourier')?.lessons.some(l => isDone(l.id));
  const samplingDone = UNITS.find(u => u.id === 'sampling')?.lessons.some(l => isDone(l.id));
  const badges = [
    { id: 'first', icon: '💗', label: 'أول نبضة', desc: 'أول درس خلص', earned: done >= 1 },
    { id: 'three', icon: '💓', label: 'قلب بيدق', desc: '3 دروس', earned: done >= 3 },
    { id: 'fourier', icon: '👑', label: 'ملكة فورييه', desc: 'درس فورييه', earned: fourierDone },
    { id: 'sampling', icon: '🎯', label: 'صائدة Aliasing', desc: 'درس Sampling', earned: samplingDone },
    { id: 'perfect', icon: '✨', label: 'Perfect', desc: 'درس كامل صح', earned: perfect },
    { id: 'streak', icon: '🔥', label: 'Streak 3', desc: '3 أيام متتالية', earned: (state.streak || 0) >= 3 },
    { id: 'half', icon: '🌗', label: 'نص الطريق', desc: '8 دروس', earned: done >= 8 },
    { id: 'review', icon: '🛡️', label: 'مراجع نجيب', desc: 'مراجعة واحدة', earned: (state.reviews || 0) >= 1 }
  ];
  const level = Math.floor(state.xp / 120) + 1;
  const levelPct = Math.min(100, Math.round(((state.xp % 120) / 120) * 100));

  app.innerHTML = `<div class="app">
    ${topbar('me')}
    <main class="content">
      <div class="page-head" style="padding-top:2px">
        <div class="eyebrow">💌 كل حاجة عنك</div>
        <h1>أنا</h1>
      </div>

      <section class="profile-card">
        <div class="profile-avatar">🌸</div>
        <div>
          <h2>آلاء</h2>
          <p>مهندسة المستقبل · ${done} من ${total} درس</p>
          <div class="unit-bar" style="width:132px;background:#F0DFD7;margin-top:6px;height:7px"><i style="width:${Math.round(done / total * 100)}%;background:linear-gradient(90deg,var(--rose),var(--violet))"></i></div>
        </div>
        <div class="level"><b>${level}</b><small>LEVEL</small></div>
      </section>

      <div class="stat-grid">
        <div class="big-stat"><span class="em">⚡</span><b>${state.xp}</b><span>إجمالي XP</span></div>
        <div class="big-stat"><span class="em">🔥</span><b>${state.streak || 0}</b><span>أيام Streak</span></div>
        <div class="big-stat"><span class="em">🎯</span><b>${accuracy}%</b><span>دقة الإجابات</span></div>
        <div class="big-stat"><span class="em">📚</span><b>${done}</b><span>دروس مكتملة</span></div>
      </div>

      <div class="section-title"><h2>الأوسمة</h2><span class="tiny">${badges.filter(b => b.earned).length} / ${badges.length}</span></div>
      <div class="badges">
        ${badges.map(b => `<div class="badge-card ${b.earned ? 'earned' : ''}">
          <span class="em">${b.icon}</span>
          <div><b>${b.label}</b><small>${b.earned ? 'اتفتح ✓' : b.desc}</small></div>
        </div>`).join('')}
      </div>

      <div class="love-letter">
        <h3>رسالة من القلب</h3>
        <p>آلاء… لو الدنيا كلها ضوّشت، أنا هفضل أحلى إشارة في حياتك بدون تشويش. النهارده مش امتحان DSP بس… النهارده إثبات إنك أقوى مما بتفتكري. خدي نفس، وافتحي أول درس. وأنا معاكي لحد آخر سؤال.</p>
        <span class="sign">— اللي بيحبك 💗</span>
      </div>

      <div class="section-title"><h2>إعدادات صغيرة</h2></div>
      <div class="settings">
        <div class="setting-row">
          <span class="em">🔊</span> صوت المؤثرات
          <button class="toggle ${state.sound ? 'on' : ''}" data-action="toggle-sound" aria-label="تشغيل أو إيقاف الصوت"></button>
        </div>
        <div class="setting-row">
          <span class="em">📒</span> ورقة المراجعة
          <span class="sp">كل القوانين</span>
          <button class="btn small ghost" data-action="go" data-to="#/sheet">افتحي</button>
        </div>
        <div class="setting-row">
          <span class="em">💾</span> تقدّمك محفوظ
          <span class="sp">على الجهاز ده</span>
        </div>
        <div class="setting-row">
          <span class="em">🧹</span> مسح التقدم
          <span class="sp">بداية جديدة</span>
          <button class="btn small ghost danger-btn" data-action="reset">مسح</button>
        </div>
      </div>

      <p style="text-align:center;font-size:10.5px;color:var(--muted);margin:18px 0 4px">معمول بحب لآلاء 💗 · إشارات الحب</p>
    </main>
    ${bottomNav('me')}
  </div>`;
}

/* ============================================================
   LESSON ENGINE
   ============================================================ */
function createLessonSession(id) {
  const f = findLesson(id);
  if (!f) return null;
  return {
    kind: 'lesson',
    lessonId: id,
    unitId: f.unit.id,
    title: f.lesson.title,
    icon: f.lesson.icon,
    cards: f.lesson.cards || [],
    questions: f.lesson.questions || [],
    phase: (f.lesson.cards && f.lesson.cards.length) ? 'cards' : 'quiz',
    cardIndex: 0,
    revealCount: 0,
    qIndex: 0,
    correctCount: 0,
    wrongCount: 0,
    total: (f.lesson.questions || []).length,
    finished: false,
    result: null
  };
}

function createReviewSession() {
  const pool = [];
  UNITS.forEach(u => u.lessons.forEach(l => l.questions.forEach(q => {
    if (q.review) pool.push({ ...q, _lesson: l.title });
  })));
  const picked = shuffle(pool).slice(0, 12);
  return {
    kind: 'review',
    lessonId: null,
    unitId: null,
    title: 'مراجعة النجاة',
    icon: '⚡',
    cards: [],
    questions: picked,
    phase: 'quiz',
    cardIndex: 0,
    revealCount: 0,
    qIndex: 0,
    correctCount: 0,
    wrongCount: 0,
    total: picked.length,
    finished: false,
    result: null
  };
}

function openLesson(id) {
  const s = createLessonSession(id);
  if (!s) return navigate('#/home');
  syncDaily();
  session = s;
  state.hearts = Math.max(state.hearts, 3);
  saveState();
  const hash = '#/lesson/' + id;
  if (location.hash === hash) paintLesson();
  else navigate(hash);
}

function startReview() {
  syncDaily();
  session = createReviewSession();
  if (location.hash === '#/review-run') paintLesson();
  else navigate('#/review-run');
}

function currentQ() {
  return session ? session.questions[session.qIndex] : null;
}

function initQuestionState() {
  const q = currentQ();
  if (!q || !session) return;
  session.selected = null;
  session.checked = false;
  session.isCorrect = false;
  session.attempts = 0;
  session.inputValue = '';
  session.optionOrder = q.options ? shuffle(q.options.map((_, i) => i)) : [];
  session.match = { selected: null, matched: [], mistakes: 0 };
  session.matchLeft = q.pairs ? shuffle(q.pairs.map((p, i) => ({ text: p[0], pair: i }))) : [];
  session.matchRight = q.pairs ? shuffle(q.pairs.map((p, i) => ({ text: p[1], pair: i }))) : [];
  session.orderPool = q.items ? shuffle(q.items.map((text, i) => ({ text, i }))) : [];
  session.orderPicks = [];
}

function heartString() {
  return `💗 ${state.hearts}`;
}

function lessonProgress() {
  if (!session) return 0;
  if (session.phase === 'result') return 100;
  const cards = session.cards.length;
  const total = cards + session.total;
  if (!total) return 0;
  const step = session.phase === 'cards'
    ? session.cardIndex
    : cards + session.qIndex + (session.checked ? 1 : 0);
  return Math.min(99, Math.round((step / total) * 100));
}

function paintLesson(keepScroll = false) {
  if (!session) return;
  const y = window.scrollY;
  cleanupDemos();
  if (session.phase === 'result') {
    app.innerHTML = resultHTML();
    window.scrollTo(0, 0);
    return;
  }
  const pct = lessonProgress();
  const isReview = session.kind === 'review';
  const header = `<div class="lesson-top">
    <button class="icon-btn" data-action="exit-lesson" aria-label="خروج">✕</button>
    <div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div class="progress-fill" style="width:${pct}%"></div></div>
    <span class="heart-pill" title="طاقة قلبك">💗 ${state.hearts}</span>
  </div>`;

  if (session.phase === 'cards') {
    const card = session.cards[session.cardIndex];
    app.innerHTML = `<div class="lesson">${header}${cardHTML(card, session)}
      <div class="lesson-footer">
        <button class="btn primary wide" data-action="next-card">
          ${session.cardIndex >= session.cards.length - 1 ? 'يلا نختبر فهمك 🎯' : 'فهمت، كمّلي'} <span class="arrow">←</span>
        </button>
      </div>
    </div>`;
  } else {
    const q = currentQ();
    app.innerHTML = `<div class="lesson">${header}
      <main class="quiz">
        <div class="q-kicker">
          <span>${isReview ? 'مراجعة' : 'سؤال'} ${session.qIndex + 1} من ${session.total}</span>
          <span class="pill ${isReview ? 'amber' : 'violet'}">${typeLabel(q.type)}</span>
        </div>
        <h1 class="q-prompt">${q.q}</h1>
        ${questionBody(q)}
        ${session.checked ? feedbackHTML(q) : ''}
      </main>
      ${quizFooter(q)}
    </div>`;
  }
  // Paint demos immediately (reading clientWidth forces layout), then retry on
  // the next frame only if no demo got wired up (e.g. delayed layout).
  setupDemos();
  requestAnimationFrame(() => {
    if (!activeDraws.length) setupDemos();
    if (keepScroll) window.scrollTo(0, y);
    else window.scrollTo(0, 0);
  });
}

function typeLabel(type) {
  return ({
    mcq: 'اختيار',
    tf: 'صح / غلط',
    input: 'حساب',
    match: 'توصيل',
    order: 'ترتيب'
  })[type] || 'سؤال';
}

function paras(body) {
  if (!body) return '';
  const arr = Array.isArray(body) ? body : [body];
  return arr.map(p => `<p>${p}</p>`).join('');
}

function cardHTML(card, s) {
  const count = `<span class="card-count">${s.cardIndex + 1} / ${s.cards.length}</span>`;
  const kicker = `<div class="card-top"><span class="pill">${card.kicker || 'فكرة'}</span>${count}</div>`;

  if (card.type === 'note') {
    return `<main class="lesson-body">${kicker}
      <div class="quote-card"><p>${card.quote || card.title}</p><small>${card.note || ''}</small></div>
      ${card.body ? paras(card.body) : ''}
    </main>`;
  }

  const isExample = card.type === 'example';
  let extra = '';
  if (isExample) {
    const steps = card.steps || [];
    const shown = Math.min(s.revealCount, steps.length);
    extra = `
      ${card.problem ? `<p class="lead">${card.problem}</p>` : ''}
      <div class="steps">
        ${steps.map((step, i) => `<div class="step ${i < shown ? 'open' : ''}">
          <span class="num">${i + 1}</span>
          <div>${i < shown ? step : 'اضغطي عشان تظهري الخطوة…'}</div>
        </div>`).join('')}
      </div>
      ${shown < steps.length
        ? `<button class="btn ghost wide" data-action="reveal-step">${shown === 0 ? 'اعرضي أول خطوة' : 'الخطوة اللي بعدها'} 👀</button>`
        : (card.answer ? `<div class="answer-box"><span class="k">الإجابة</span>${card.answer}</div>` : '')}
    `;
  } else {
    extra = `${paras(card.body)}
      ${card.bullets ? `<div class="bullets">${card.bullets.map((b, i) => `<div class="bullet"><span class="dot">${i + 1}</span><div>${b}</div></div>`).join('')}</div>` : ''}
      ${card.formula ? `<div class="formula">${card.formula}</div>` : ''}
      ${card.diagram === 'adc' ? adcDiagram() : ''}
      ${card.demo ? demoBox(card.demo) : ''}
      ${card.note ? `<div class="note">${card.note}</div>` : ''}
      ${card.quote ? `<div class="quote-card"><p>${card.quote}</p><small>${card.kicker || ''}</small></div>` : ''}
    `;
  }

  if (isExample && card.demo) extra += demoBox(card.demo);
  if (isExample && card.note) extra += `<div class="note">${card.note}</div>`;

  return `<main class="lesson-body">${kicker}<h1>${card.title || ''}</h1>${extra}</main>`;
}

function adcDiagram() {
  return `<div class="adc-flow">
    <div class="adc-row">
      <div class="adc-node hot"><span class="ic">🎙️</span><b>Analog input</b><small>x(t)</small></div>
      <span class="adc-arrow">←</span>
      <div class="adc-node hot"><span class="ic">🧹</span><b>Anti-alias LPF</b><small>قبل الـ ADC</small></div>
    </div>
    <div class="adc-band"><i></i>الفلتر بيحمي من الترددات فوق fs/2<i></i></div>
    <div class="adc-row">
      <div class="adc-node"><span class="ic">📥</span><b>Sample & Hold</b><small>يمسك العينة</small></div>
      <span class="adc-arrow">←</span>
      <div class="adc-node"><span class="ic">🔢</span><b>ADC</b><small>Sampling + Quantization</small></div>
      <span class="adc-arrow">←</span>
      <div class="adc-node"><span class="ic">🧠</span><b>DSP</b><small>Processing</small></div>
    </div>
    <div class="adc-row">
      <div class="adc-node"><span class="ic">📤</span><b>DAC</b><small>يرجّع أنالوج</small></div>
      <span class="adc-arrow">←</span>
      <div class="adc-node hot"><span class="ic">✨</span><b>Reconstruction LPF</b><small>بعد الـ DAC</small></div>
      <span class="adc-arrow">←</span>
      <div class="adc-node"><span class="ic">🔊</span><b>Analog output</b><small>y(t)</small></div>
    </div>
  </div>`;
}

function demoBox(type) {
  const info = {
    fourier: { title: 'ماكينة فورييه', hint: 'حرّكي عدد الهارمونيكس', min: 1, max: 15, value: 3 },
    sampling: { title: 'ماكينة الـ Sampling', hint: 'حرّكي fs', min: 4, max: 24, value: 12 },
    spectrum: { title: 'طيف الإشارة', hint: 'حرّكي fs', min: 4, max: 20, value: 10 }
  }[type] || { title: 'تجربة', hint: '', min: 1, max: 10, value: 5 };
  return `<div class="demo-card" data-demo-card="${type}">
    <div class="demo-head"><strong>🎛️ ${info.title}</strong><span>${info.hint}</span></div>
    <div class="demo-box">
      <canvas class="demo-canvas" data-demo="${type}" aria-label="${info.title}"></canvas>
      <div class="demo-controls">
        <label for="demo-${type}">${type === 'fourier' ? 'هارمونيكس' : 'fs'}</label>
        <input id="demo-${type}" type="range" min="${info.min}" max="${info.max}" step="1" value="${info.value}" data-demo-input="${type}">
        <span class="pill violet" data-demo-value="${type}" style="min-width:58px;justify-content:center">${info.value}${type === 'fourier' ? '' : ' Hz'}</span>
      </div>
      <div class="demo-legend">
        ${type === 'fourier' ? '<span><i style="background:#BDA9B6"></i>الهدف المربع</span><span><i style="background:#FF5C8A"></i>مجموع فورييه</span>' : ''}
        ${type === 'sampling' ? '<span><i style="background:#BDA9B6"></i>الإشارة الأصلية</span><span><i style="background:#FF5C8A"></i>العينات</span><span><i style="background:#7C5CFF"></i>الظاهر من العينات</span>' : ''}
        ${type === 'spectrum' ? '<span><i style="background:#FF5C8A"></i>الأصل</span><span><i style="background:#7C5CFF"></i>النسخ</span><span><i style="background:#FFB020"></i>الحد الآمن fs/2</span>' : ''}
      </div>
      <div data-demo-badge="${type}"></div>
    </div>
  </div>`;
}

/* ---------------- question rendering ---------------- */
function questionBody(q) {
  if (q.type === 'mcq' || q.type === 'tf') return optionsHTML(q);
  if (q.type === 'input') return inputHTML(q);
  if (q.type === 'match') return matchHTML(q);
  if (q.type === 'order') return orderHTML(q);
  return '';
}

function optionsHTML(q) {
  const letters = ['أ', 'ب', 'ج', 'د', 'هـ', 'و'];
  if (q.type === 'tf') {
    const choices = [{ v: true, t: 'صح ✅' }, { v: false, t: 'غلط ❌' }];
    return `<div class="options">${choices.map((c, i) => {
      let cls = '';
      if (session.checked) {
        if (c.v === q.answer) cls = 'correct';
        else if (session.selected === c.v) cls = 'wrong';
      } else if (session.selected === c.v) cls = 'selected';
      return `<button class="option ${cls}" data-action="select-tf" data-v="${c.v}" ${session.checked ? 'disabled' : ''}>
        <span class="opt-key">${i === 0 ? '✓' : '✕'}</span><span class="opt-text">${c.t}</span>
      </button>`;
    }).join('')}</div>`;
  }
  const order = session.optionOrder || q.options.map((_, i) => i);
  return `<div class="options">${order.map((oi, pos) => {
    let cls = '';
    if (session.checked) {
      if (oi === q.answer) cls = 'correct';
      else if (session.selected === oi) cls = 'wrong';
    } else if (session.selected === oi) cls = 'selected';
    const preview = q.previews && q.previews[oi] ? `<span class="thumb">${waveSVG(q.previews[oi])}</span>` : '';
    return `<button class="option ${cls}" data-action="select-option" data-i="${oi}" ${session.checked ? 'disabled' : ''}>
      <span class="opt-key">${letters[pos] || (pos + 1)}</span>
      <span class="opt-text">${q.options[oi]}</span>
      ${preview}
    </button>`;
  }).join('')}</div>`;
}

function inputHTML(q) {
  return `<div class="input-wrap">
    <input class="answer-input" id="q-input" type="text" inputmode="decimal" autocomplete="off"
      placeholder="اكتبي الرقم هنا" value="${escapeHTML(session.inputValue || '')}"
      data-input="answer" ${session.checked ? 'disabled' : ''}>
    ${q.suffix ? `<span class="input-suffix">${q.suffix}</span>` : ''}
  </div>
  ${q.hint ? `<div class="input-hint">💡 ${q.hint}</div>` : ''}`;
}

function matchHTML(q) {
  const s = session;
  const sel = s.match?.selected;
  return `<div class="match-grid">
    <div class="match-col">
      ${(s.matchLeft || []).map(item => {
        const matched = s.match.matched.includes(item.pair);
        const selected = sel && sel.side === 'left' && sel.pair === item.pair;
        return `<button class="match-item ${matched ? 'matched' : ''} ${selected ? 'selected' : ''}"
          data-action="match-pick" data-side="left" data-pair="${item.pair}" ${matched ? 'disabled' : ''}>${item.text}</button>`;
      }).join('')}
    </div>
    <div class="match-col">
      ${(s.matchRight || []).map(item => {
        const matched = s.match.matched.includes(item.pair);
        const selected = sel && sel.side === 'right' && sel.pair === item.pair;
        return `<button class="match-item ${matched ? 'matched' : ''} ${selected ? 'selected' : ''}"
          data-action="match-pick" data-side="right" data-pair="${item.pair}" ${matched ? 'disabled' : ''}>${item.text}</button>`;
      }).join('')}
    </div>
  </div>
  <p class="input-hint" style="margin-top:10px">وصّلي كل حاجة باللي تناسبها… بالراحة 💗</p>`;
}

function orderHTML(q) {
  const s = session;
  return `<div class="order-slots">
    ${q.items.map((_, pos) => {
      const pick = s.orderPicks[pos];
      return `<div class="order-slot ${pick !== undefined ? 'filled' : ''}" ${pick !== undefined ? `data-action="order-remove" data-pos="${pos}"` : ''}>
        <span class="n">${pos + 1}</span>
        <span>${pick !== undefined ? q.items[pick] : 'اختاري الخطوة…'}</span>
      </div>`;
    }).join('')}
  </div>
  <div class="order-pool">
    ${(s.orderPool || []).map(item => `<button class="match-item ${s.orderPicks.includes(item.i) ? 'used' : ''}"
      data-action="order-pick" data-idx="${item.i}">${item.text}</button>`).join('')}
  </div>`;
}

function feedbackHTML(q) {
  const ok = session.isCorrect;
  const finalWrong = !ok && session.attempts >= 2;
  const msg = ok ? randomOf(CONTENT.messages.correct) : randomOf(CONTENT.messages.wrong);
  return `<div class="feedback ${ok ? 'ok' : 'no'}">
    <div class="fb-top">${ok ? '✨' : '💗'} ${msg}</div>
    <p>${q.explain || ''}</p>
    ${finalWrong ? `<span class="fb-answer">الإجابة الصح: ${correctAnswerText(q)}</span>` : ''}
  </div>`;
}

function canCheck(q) {
  if (!q || session.checked) return false;
  if (q.type === 'mcq' || q.type === 'tf') return session.selected !== null;
  if (q.type === 'input') return String(session.inputValue || '').trim().length > 0;
  if (q.type === 'match') return session.match.matched.length === q.pairs.length;
  if (q.type === 'order') return session.orderPicks.length === q.items.length;
  return false;
}

function quizFooter(q) {
  if (!session.checked) {
    return `<div class="lesson-footer">
      <button class="btn primary wide" data-action="check" ${canCheck(q) ? '' : 'disabled'}>اتأكدي ✅</button>
    </div>`;
  }
  if (!session.isCorrect && session.attempts < 2) {
    return `<div class="lesson-footer">
      <div class="row">
        <button class="btn primary" data-action="retry">حاولي تاني 💪</button>
        <button class="btn ghost" data-action="show-answer">وريني الإجابة</button>
      </div>
    </div>`;
  }
  const last = session.qIndex >= session.total - 1;
  return `<div class="lesson-footer">
    <button class="btn primary wide" data-action="next-question">${last ? (session.kind === 'review' ? 'شوفي النتيجة 🎉' : 'خلصنا… شوفي نتيجتك 🎉') : 'كمّلي'} <span class="arrow">←</span></button>
  </div>`;
}

function correctAnswerText(q) {
  if (q.type === 'mcq') return q.options[q.answer];
  if (q.type === 'tf') return q.answer ? 'صح' : 'غلط';
  if (q.type === 'input') return `${q.answers[0]}${q.suffix ? ' ' + q.suffix : ''}`;
  if (q.type === 'match') return q.pairs.map(p => `${p[0]} ↔ ${p[1]}`).join(' · ');
  if (q.type === 'order') return q.items.join(' → ');
  return '';
}

/* ---------------- answer checking ---------------- */
function checkAnswer() {
  const q = currentQ();
  if (!q || !session || session.checked) return;
  let ok = false;
  if (q.type === 'mcq' || q.type === 'tf') {
    ok = session.selected === q.answer;
  } else if (q.type === 'input') {
    const val = normAnswer(session.inputValue);
    ok = (q.answers || []).some(a => normAnswer(a) === val);
  } else if (q.type === 'match') {
    ok = session.match.matched.length === q.pairs.length && session.match.mistakes === 0;
  } else if (q.type === 'order') {
    ok = q.items.every((_, i) => session.orderPicks[i] === i);
  }

  session.checked = true;
  session.isCorrect = ok;
  session.attempts++;
  if (session.attempts === 1) {
    state.totalAnswered++;
    if (ok) state.totalCorrect++;
  }
  if (ok) {
    session.correctCount++;
    Sound.correct();
    burst({ count: 20, originY: innerHeight * 0.56 });
    vibrate(25);
  } else {
    session.wrongCount++;
    state.hearts = Math.max(0, state.hearts - 1);
    Sound.wrong();
    vibrate([30, 40, 30]);
    if (state.hearts === 0) {
      state.hearts = 5;
      setTimeout(() => toast('قلبك كبير… خدي 5 قلوب جديدة 💗'), 650);
    }
  }
  saveState();
  paintLesson(true);
}

function retryQuestion() {
  const q = currentQ();
  if (!q || !session) return;
  session.checked = false;
  session.isCorrect = false;
  session.selected = null;
  session.inputValue = '';
  if (q.type === 'match') {
    session.match = { selected: null, matched: [], mistakes: 0 };
  }
  if (q.type === 'order') session.orderPicks = [];
  paintLesson(true);
}

function showAnswer() {
  if (!session) return;
  session.attempts = 2;
  session.checked = true;
  session.isCorrect = false;
  paintLesson(true);
}

function nextQuestion() {
  if (!session) return;
  if (session.qIndex >= session.total - 1) {
    finishSession();
    return;
  }
  session.qIndex++;
  initQuestionState();
  paintLesson();
}

function finishSession() {
  if (!session || session.finished) return;
  session.finished = true;
  const score = session.correctCount;
  const total = session.total;
  const perfect = score === total;
  let xp;
  if (session.kind === 'lesson') {
    xp = 20 + score * 3 + (perfect ? 10 : 0);
    const prev = state.completed[session.lessonId];
    if (!prev || score > prev.score) {
      state.completed[session.lessonId] = { score, total, date: todayKey() };
    }
    state.hearts = Math.min(5, state.hearts + 2);
    session.result = { xp, score, total, perfect, next: nextAfter(session.unitId, session.lessonId) };
  } else {
    xp = 10 + score * 2;
    state.reviews = (state.reviews || 0) + 1;
    session.result = { xp, score, total, perfect, next: null };
  }
  state.xp += xp;
  state.dailyXp += xp;
  markStudy();
  saveState();
  session.phase = 'result';
  Sound.complete();
  burst({ count: 70, originY: innerHeight * 0.32 });
  setTimeout(() => burst({ count: 36, originY: innerHeight * 0.46 }), 380);
  paintLesson();
}

function resultHTML() {
  const r = session.result || { xp: 0, score: 0, total: session.total, perfect: false, next: null };
  const ratio = r.total ? r.score / r.total : 0;
  const isReview = session.kind === 'review';
  const title = isReview
    ? (r.perfect ? 'مراجعة مثالية! ✨' : 'خلصتي المراجعة 💗')
    : (r.perfect ? 'Perfect يا آلاء! ✨' : ratio >= 0.7 ? 'إنتي فهمتيها 💗' : 'مهم إنك كمّلتي 💗');
  const sub = isReview
    ? (r.perfect ? 'كده إنتي جاهزة. اقفلي التليفون، خدي نفس، ونامي بدري.' : 'المراجعة أهم من الدرجة. افتحي ورقة المراجعة تاني، وثبّتي اللي غلطتي فيه.')
    : (r.perfect
      ? 'مش غلطة واحدة. قلبي بيكبر من الفخر… وإنتي كمان المفروض تفتخري بنفسك.'
      : ratio >= 0.7
        ? 'أغلب الحاجات قعدت في دماغك. الباقي هنثبّته في ثانية. وأنا فخور بيكي.'
        : 'الغلط مش نهاية الدنيا. إنتي حاولتي، وده أهم من أي درجة. راجعي الشرح مرة، وهتجيبيها.');
  const next = r.next;
  return `<div class="result">
    <div class="confetti-title">${r.perfect ? '✨💗✨' : '💗'}</div>
    <div class="mascot-wrap">${mascotSVG()}</div>
    <h1>${title}</h1>
    <p class="sub">${sub}</p>
    <div class="score-hearts">${'💗'.repeat(Math.max(1, Math.round(ratio * 5)))}${'🤍'.repeat(Math.max(0, 5 - Math.round(ratio * 5)))}</div>
    <div class="result-stats">
      <div class="result-stat"><b>${r.score}/${r.total}</b><small>إجابات صح</small></div>
      <div class="result-stat"><b>+${r.xp}</b><small>XP</small></div>
      <div class="result-stat"><b>${r.total ? Math.round(ratio * 100) : 0}%</b><small>الدقة</small></div>
    </div>
    <div class="result-actions">
      ${isReview
        ? `<button class="btn primary" data-action="start-review">مراجعة تانية 🔁</button>
           <button class="btn rose" data-action="go" data-to="#/sheet">ورقة المراجعة 📒</button>
           <button class="btn ghost" data-action="go" data-to="#/home">رجوع للمسار</button>`
        : `${next
            ? `<button class="btn primary" data-action="next-lesson" data-id="${next.lesson.id}">اللي بعده: ${next.lesson.title} <span class="arrow">←</span></button>`
            : `<button class="btn primary" data-action="go" data-to="#/review">مراجعة سريعة 🎯</button>`}
           <button class="btn ghost" data-action="restart-lesson">رجّعي الشرح من الأول</button>
           <button class="btn ghost" data-action="go" data-to="#/home">كمّلي من المسار</button>`}
    </div>
    <p style="font-size:10.5px;color:var(--muted);margin-top:18px">${isReview ? 'المراجعة مش بتخلص… بس إنتي كفاية 💗' : 'خطوة كمان، وتبقي المادة في جيبك 💗'}</p>
  </div>`;
}

/* ============================================================
   INTERACTIVE DEMOS
   ============================================================ */
function cleanupDemos() {
  activeDraws.forEach(fn => { try { fn(); } catch (e) {} });
  activeDraws = [];
}

function setupDemos() {
  cleanupDemos();
  const types = ['fourier', 'sampling', 'spectrum'];
  types.forEach(type => {
    const canvas = $(`[data-demo="${type}"]`);
    if (!canvas) return;
    const input = $(`[data-demo-input="${type}"]`);
    const valueEl = $(`[data-demo-value="${type}"]`);
    const badge = $(`[data-demo-badge="${type}"]`);
    const draw = () => {
      const v = input ? Number(input.value) : 3;
      if (valueEl) valueEl.textContent = type === 'fourier' ? `${v}` : `${v} Hz`;
      if (type === 'fourier') drawFourier(canvas, v, badge);
      if (type === 'sampling') drawSampling(canvas, v, badge);
      if (type === 'spectrum') drawSpectrum(canvas, v, badge);
    };
    draw();
    if (input) input.addEventListener('input', draw);
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    activeDraws.push(() => {
      window.removeEventListener('resize', onResize);
      if (input) input.removeEventListener('input', draw);
    });
  });
}

function canvasSetup(canvas, height) {
  const w = Math.max(240, Math.floor(canvas.clientWidth || 340));
  const h = height || 178;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.height = h + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  return { ctx, w, h };
}

function drawGrid(ctx, w, h, pad) {
  ctx.strokeStyle = '#F2E4DC';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad + ((h - pad * 2) * i) / 4;
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(w - pad, y);
    ctx.stroke();
  }
  ctx.strokeStyle = '#CDB8C4';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(pad, h / 2);
  ctx.lineTo(w - pad, h / 2);
  ctx.stroke();
}

function badge(el, text, good) {
  if (!el) return;
  el.innerHTML = `<span class="demo-badge ${good ? '' : 'bad'}">${text}</span>`;
}

function drawFourier(canvas, N, badgeEl) {
  const { ctx, w, h } = canvasSetup(canvas, 178);
  const pad = 16;
  const amp = 34;
  const mid = h / 2 + 4;
  drawGrid(ctx, w, h, pad);

  // target square wave 0/1 over 2 periods
  ctx.beginPath();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = '#BDA9B6';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 400; i++) {
    const t = i / 400;
    const y = (t * 2) % 1 < 0.5 ? 0 : 1;
    const px = pad + t * (w - pad * 2);
    const py = mid - (y - 0.5) * amp * 2;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // Fourier partial sum
  ctx.beginPath();
  ctx.strokeStyle = '#FF5C8A';
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  for (let i = 0; i <= 500; i++) {
    const t = i / 500;
    const x = t * 2;
    let y = 0.5;
    for (let k = 0; k < N; k++) {
      const n = 2 * k + 1;
      y += (2 / (n * Math.PI)) * Math.sin(2 * Math.PI * n * x);
    }
    const px = pad + t * (w - pad * 2);
    const py = mid - (y - 0.5) * amp * 2;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke();

  // little glow at the last point
  ctx.fillStyle = 'rgba(255,92,138,.16)';
  ctx.beginPath();
  ctx.arc(w - pad, mid, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#9A8291';
  ctx.font = '9px "IBM Plex Sans Arabic", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('0', pad, h - 5);
  ctx.textAlign = 'right';
  ctx.fillText('2T', w - pad, h - 5);

  badge(badgeEl, `🎵 ${N} هارمونيك فردي · الحواف بتبقى أحدّ`, true);
}

function drawSampling(canvas, fs, badgeEl) {
  const { ctx, w, h } = canvasSetup(canvas, 178);
  const pad = 18;
  const mid = h / 2 + 2;
  const amp = 52;
  const f = 3;
  const toX = t => pad + t * (w - pad * 2);
  const toY = v => mid - v * amp;
  drawGrid(ctx, w, h, pad);

  // original 3 Hz
  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = '#BDA9B6';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 400; i++) {
    const t = i / 400;
    const y = Math.sin(2 * Math.PI * f * t);
    i === 0 ? ctx.moveTo(toX(t), toY(y)) : ctx.lineTo(toX(t), toY(y));
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // samples + stems
  const nSamples = fs;
  for (let n = 0; n < nSamples; n++) {
    const t = n / fs;
    if (t > 1) break;
    const y = Math.sin(2 * Math.PI * f * t);
    ctx.strokeStyle = 'rgba(255,92,138,.35)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(toX(t), mid);
    ctx.lineTo(toX(t), toY(y));
    ctx.stroke();
    ctx.fillStyle = '#FF5C8A';
    ctx.beginPath();
    ctx.arc(toX(t), toY(y), 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  let alias = f;
  if (fs < 2 * f) {
    alias = Math.abs(f - Math.round(f / fs) * fs);
    const sign = Math.sin(2 * Math.PI * f / fs) >= 0 ? 1 : -1;
    ctx.beginPath();
    ctx.strokeStyle = '#7C5CFF';
    ctx.lineWidth = 2.6;
    for (let i = 0; i <= 400; i++) {
      const t = i / 400;
      const y = sign * Math.sin(2 * Math.PI * alias * t);
      i === 0 ? ctx.moveTo(toX(t), toY(y)) : ctx.lineTo(toX(t), toY(y));
    }
    ctx.stroke();
  }

  ctx.fillStyle = '#9A8291';
  ctx.font = '9px "IBM Plex Sans Arabic", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('0', pad, h - 5);
  ctx.textAlign = 'right';
  ctx.fillText('1s', w - pad, h - 5);

  if (fs < 2 * f) {
    badge(badgeEl, `⚠️ Aliasing! fs=${fs} < 6 · ظهر كـ ${alias.toFixed(1)} Hz`, false);
  } else {
    badge(badgeEl, `✅ سليمة: fs=${fs} ≥ 2fmax=6`, true);
  }
}

function drawSpectrum(canvas, fs, badgeEl) {
  const { ctx, w, h } = canvasSetup(canvas, 178);
  const pad = 14;
  const minF = -22;
  const maxF = 22;
  const B = 3;
  const baseY = h - 30;
  const topY = 30;
  const toX = f => pad + ((f - minF) / (maxF - minF)) * (w - pad * 2);

  // axis
  ctx.strokeStyle = '#EBD9D0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, baseY);
  ctx.lineTo(w - pad, baseY);
  ctx.stroke();

  // folding lines
  ctx.setLineDash([3, 4]);
  ctx.strokeStyle = '#FFB020';
  ctx.lineWidth = 1.4;
  [-fs / 2, fs / 2].forEach(f => {
    if (f < minF || f > maxF) return;
    ctx.beginPath();
    ctx.moveTo(toX(f), topY - 6);
    ctx.lineTo(toX(f), baseY);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  function triangle(center, color, alpha) {
    ctx.beginPath();
    ctx.moveTo(toX(center - B), baseY);
    ctx.lineTo(toX(center), topY);
    ctx.lineTo(toX(center + B), baseY);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  const replicas = [0, -fs, fs, -2 * fs, 2 * fs, -3 * fs, 3 * fs];
  replicas.forEach((c, i) => {
    if (c + B < minF || c - B > maxF) return;
    triangle(c, i === 0 ? '#FF5C8A' : '#7C5CFF', i === 0 ? 0.95 : 0.5);
  });

  ctx.fillStyle = '#9A8291';
  ctx.font = '9px "IBM Plex Sans Arabic", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('-fs', toX(-fs), h - 9);
  ctx.fillText('0', toX(0), h - 9);
  ctx.fillText('fs', toX(fs), h - 9);
  ctx.textAlign = 'left';
  ctx.fillText('B=3', pad, 15);

  if (fs < 2 * B) {
    badge(badgeEl, `⚠️ النسخ بتتداخل! fs=${fs} < 2B=6`, false);
  } else if (fs === 2 * B) {
    badge(badgeEl, `⚠️ النسخ بتلمس بعض · fs=2B=6 · محتاج فلتر مثالي`, false);
  } else {
    badge(badgeEl, `✅ فيه فراغ بين النسخ · fs=${fs} > 6`, true);
  }
}

function waveSVG(kind) {
  const color = '#FF5C8A';
  if (kind === 'square') {
    return `<svg viewBox="0 0 80 40"><path d="M4 30h18V10h18v20h18V10h18" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round"/></svg>`;
  }
  if (kind === 'sampled') {
    return `<svg viewBox="0 0 80 40"><path d="M4 30h6M16 14h6M28 26h6M40 16h6M52 30h6M64 20h6" stroke="#7C5CFF" stroke-width="2"/><circle cx="7" cy="30" r="2.4" fill="${color}"/><circle cx="19" cy="14" r="2.4" fill="${color}"/><circle cx="31" cy="26" r="2.4" fill="${color}"/><circle cx="43" cy="16" r="2.4" fill="${color}"/><circle cx="55" cy="30" r="2.4" fill="${color}"/><circle cx="67" cy="20" r="2.4" fill="${color}"/></svg>`;
  }
  if (kind === 'spike') {
    return `<svg viewBox="0 0 80 40"><path d="M4 32h30l4-26 4 26h34" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round"/></svg>`;
  }
  return `<svg viewBox="0 0 80 40"><path d="M4 20c6-18 12-18 18 0s12 18 18 0 12-18 18 0 12 18 18 0" fill="none" stroke="${color}" stroke-width="3"/></svg>`;
}

/* ============================================================
   ROUTING + EVENTS
   ============================================================ */
function navigate(to) {
  if (location.hash === to) route();
  else location.hash = to;
}

function route() {
  const raw = location.hash.replace(/^#\/?/, '') || 'home';
  const [page, param] = raw.split('/');
  cleanupDemos();
  if (page === 'lesson' && param) {
    if (!session || session.kind !== 'lesson' || session.lessonId !== param) {
      session = createLessonSession(param);
    }
    if (!session) { navigate('#/home'); return; }
    paintLesson();
    return;
  }
  if (page === 'review-run') {
    if (!session || session.kind !== 'review') session = createReviewSession();
    paintLesson();
    return;
  }
  session = null;
  if (page === 'review') renderReview();
  else if (page === 'sheet') renderSheet();
  else if (page === 'me') renderProfile();
  else renderHome();
}

document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-action]');
  if (!target || target.disabled) return;
  const action = target.dataset.action;

  if (action === 'go') {
    Sound.tap();
    navigate(target.dataset.to || '#/home');
    return;
  }
  if (action === 'toggle-sound') {
    state.sound = !state.sound;
    saveState();
    if (state.sound) Sound.tap();
    $$('.icon-btn[data-action="toggle-sound"]').forEach(b => { b.textContent = state.sound ? '🔊' : '🔇'; });
    $$('.toggle[data-action="toggle-sound"]').forEach(b => { b.classList.toggle('on', state.sound); });
    toast(state.sound ? 'الصوت شغال 🔊' : 'الصوت اتقفل 🔇');
    return;
  }
  if (action === 'continue') {
    const n = nextLesson();
    if (n) openLesson(n.lesson.id);
    else startReview();
    return;
  }
  if (action === 'start-lesson') {
    Sound.tap();
    openLesson(target.dataset.id);
    return;
  }
  if (action === 'start-review') {
    Sound.tap();
    startReview();
    return;
  }
  if (action === 'next-card') {
    if (!session) return;
    if (session.cardIndex >= session.cards.length - 1) {
      session.phase = 'quiz';
      session.qIndex = 0;
      initQuestionState();
      Sound.tap();
      paintLesson();
    } else {
      session.cardIndex++;
      session.revealCount = 0;
      Sound.tap();
      paintLesson();
    }
    return;
  }
  if (action === 'reveal-step') {
    if (!session) return;
    const card = session.cards[session.cardIndex];
    const max = (card.steps || []).length;
    session.revealCount = Math.min(max, session.revealCount + 1);
    Sound.tap();
    paintLesson(true);
    return;
  }
  if (action === 'select-option') {
    if (!session || session.checked) return;
    session.selected = Number(target.dataset.i);
    Sound.select();
    paintLesson(true);
    return;
  }
  if (action === 'select-tf') {
    if (!session || session.checked) return;
    session.selected = target.dataset.v === 'true';
    Sound.select();
    paintLesson(true);
    return;
  }
  if (action === 'check') {
    checkAnswer();
    return;
  }
  if (action === 'retry') {
    retryQuestion();
    return;
  }
  if (action === 'show-answer') {
    showAnswer();
    return;
  }
  if (action === 'next-question') {
    nextQuestion();
    return;
  }
  if (action === 'exit-lesson') {
    navigate('#/home');
    return;
  }
  if (action === 'next-lesson') {
    openLesson(target.dataset.id);
    return;
  }
  if (action === 'restart-lesson') {
    if (session?.lessonId) openLesson(session.lessonId);
    return;
  }
  if (action === 'match-pick') {
    if (!session || session.checked) return;
    const side = target.dataset.side;
    const pair = Number(target.dataset.pair);
    const sel = session.match.selected;
    if (!sel || sel.side === side) {
      session.match.selected = { side, pair };
      Sound.select();
      paintLesson(true);
      return;
    }
    if (sel.pair === pair) {
      session.match.matched.push(pair);
      session.match.selected = null;
      Sound.correct();
      vibrate(15);
      if (session.match.matched.length === currentQ().pairs.length) {
        checkAnswer();
      } else {
        paintLesson(true);
      }
    } else {
      session.match.mistakes++;
      session.match.selected = null;
      Sound.wrong();
      vibrate([20, 30, 20]);
      const grid = $('.match-grid');
      if (grid) {
        grid.classList.add('shake-screen');
        setTimeout(() => paintLesson(true), 330);
      } else {
        paintLesson(true);
      }
    }
    return;
  }
  if (action === 'order-pick') {
    if (!session || session.checked) return;
    const idx = Number(target.dataset.idx);
    if (!session.orderPicks.includes(idx)) {
      session.orderPicks.push(idx);
      Sound.select();
      paintLesson(true);
    }
    return;
  }
  if (action === 'order-remove') {
    if (!session || session.checked) return;
    const pos = Number(target.dataset.pos);
    if (pos >= 0 && pos < session.orderPicks.length) {
      session.orderPicks.splice(pos, 1);
      Sound.tap();
      paintLesson(true);
    }
    return;
  }
  if (action === 'reset') {
    if (!confirm('متأكدة عايزة تمسحي كل التقدم؟ البداية الجديدة حلوة… بس مش لازم.')) return;
    localStorage.removeItem(STORAGE_KEY);
    state = { ...DEFAULT_STATE };
    session = null;
    saveState();
    navigate('#/home');
    toast('بداية جديدة… يلا نكسّرها 💗');
    return;
  }
});

document.addEventListener('input', (e) => {
  if (e.target.matches('[data-input="answer"]') && session) {
    session.inputValue = e.target.value;
    const btn = $('[data-action="check"]');
    if (btn) btn.disabled = !canCheck(currentQ());
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.matches('[data-input="answer"]') && session && canCheck(currentQ())) {
    e.preventDefault();
    checkAnswer();
  }
});

window.addEventListener('hashchange', route);
window.addEventListener('resize', () => {
  activeDraws.forEach(fn => { try { fn(); } catch (e) {} });
});

/* ---------------- init ---------------- */
syncDaily();
if (!location.hash) location.hash = '#/home';
else route();


