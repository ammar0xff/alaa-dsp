/* ============================================================
   إشارات الحب — محتوى رحلة آلاء في DSP
   مبني من محاضرات: Introduction / Signal & System /
   Fourier Series / Signal Sampling & Reconstruction
   ============================================================ */
window.CONTENT = {
  examISO: '2026-11-02T09:00:00+02:00',
  dailyGoal: 50,
  messages: {
    correct: [
      'برافو يا قمر! ✨',
      'إيه الجمال ده! 💗',
      'ماشية زي الصاروخ 🚀',
      'قلبي بيقول إنك فهمتيها صح 😌',
      'دي إجابة مهندسة بجد 👏',
      'صح صح صح! أنا فخور بيكي 💗'
    ],
    wrong: [
      'ولا يهمك… الغلط جزء من التعلم 💗',
      'قربنا جدًا! جرّبي تاني',
      'مش مشكلة، أنا معاكي. بصّي على الفكرة كده',
      'خدي نفس… إحنا هنفهمها مع بعض',
      'معلش يا قمر، المحاولة التانية بتبقى أحلى'
    ],
    complete: [
      'إنتي مش بتتعلمي… إنتي بتلمعي ✨',
      'قلبي بيكبر وأنتي بتفهمي 💗',
      'خلصنا حتة صعبة، والباقي أسهل. وعد.',
      'شوفي؟ قلتلك هتقدري. وأنا عند كلمتي 😌',
      'خطوة كمان وأنتي ماسكة المادة كلها 💪'
    ],
    notes: [
      'آلاء… إنتي مش محتاجة تكوني فاهمة كل حاجة من أول مرة. إنتي محتاجة بس تكمّلي. وأنا معاكي.',
      'الدنيا لو وشّشت عليكي، افتكري إنك أقوى إشارة في حياتي… ومفيش noise يقدر يشوّشها.',
      'يا أجمل مهندسة، كل فكرة صعبة هنكسّرها لحتت صغيرة، ونفهمها مع بعض.',
      'امتحان بكرة؟ طب ما إحنا هنعمله النهارده سهل. خدي نفس، ويلا.',
      'أنا فخور بيكي حتى لو غلطتي. المهم إنك بتحاولي.',
      'قلبي بيدق أسرع من أي sampling rate لما بتضحكي 😌💗',
      'بعد المذاكرة دي، أنا واثق إنك هتكسري الدنيا. وإنتي أصلاً كاسراها.'
    ]
  },

  units: [
    /* ================= UNIT 2 ================= */
    {
      id: 'signals', number: '02', emoji: '🌊',
      title: 'إشارات وأنظمة',
      tagline: 'من x(t) لحد خصائص الأنظمة… من غير تعقيد',
      color: '#2FB8A6', dark: '#168F80', soft: '#E5FAF6',
      lessons: [
        {
          id: 's1', title: 'Continuous ولا Discrete؟', subtitle: 'x(t) vs x[n]', icon: '📈', minutes: 5,
          cards: [
            {
              type: 'idea', kicker: 'الفرق الأساسي',
              title: 'x(t) وx[n]',
              body: [
                'الإشارة <b>المستمرة</b> <span dir="ltr">x(t)</span> معرّفة لكل لحظة زمن. زي فولت في دايرة.',
                'الإشارة <b>المتقطعة</b> <span dir="ltr">x[n]</span> معرّفة عند أعداد صحيحة n بس. بتيجي من sampling: <span dir="ltr">x[n] = x(nT)</span>.'
              ],
              formula: 'x[n] = x(nT),   n ∈ ℤ,   T = sampling interval',
              bullets: [
                'T هي الفترة بين عينتين',
                'n عدد صحيح… مفيش n = 1.5',
                'الإشارة المتقطعة لسه ممكن تكون سعتها continuous'
              ]
            },
            {
              type: 'idea', kicker: 'خدي بالك',
              title: 'Discrete in time ≠ Digital',
              body: [
                'العينة ممكن تكون 3.7 فولت، يعني لسه <b>continuous amplitude</b>.',
                'الرقمية بتحتاج <b>quantization</b> كمان عشان السعة تبقى مستويات محدودة.'
              ],
              bullets: [
                '<b>CT:</b> كل الزمن + سعة متصلة',
                '<b>DT:</b> أزمنة متقطعة + سعة متصلة',
                '<b>Digital:</b> أزمنة متقطعة + سعة مكمّمة'
              ],
              note: 'ممكن ييجي سؤال: هل كل DT signal رقمي؟ الإجابة لأ.'
            },
            {
              type: 'idea', kicker: 'عمليات بسرعة',
              title: 'Shift وScale من غير لخبطة',
              body: [
                '<b>Time shift:</b> x(t−t₀) تأخير لليمين، وx(t+t₀) تقديم لليسار.',
                '<b>Time scaling:</b> x(at) بتضغط أو تفرد الإشارة.',
                '<b>Amplitude scaling:</b> A·x(t) بتغيّر الارتفاع.'
              ],
              formula: 'x(2t+3) = x(2(t+1.5))\n→ ضغط ×2 وإزاحة لليسار 1.5',
              note: 'الإزاحة جوه الدالة عكس الاتجاه اللي بتتوقعه. خدي بالك!'
            },
            {
              type: 'example', kicker: 'مثال محلول',
              title: 'x(2t+3) بالخطوات',
              problem: 'لو x(t) عندك، إزاي نرسم x(2t+3)؟',
              steps: [
                'اكتبيها x(2(t+1.5)) عشان تشوفي الإزاحة بوضوح.',
                'الضرب في 2 جوه الدالة = ضغط في الزمن بعامل 2.',
                '+1.5 جوه الدالة = إزاحة لليسار بمقدار 1.5 (مش 3).'
              ],
              answer: 'الترتيب: ضغط ×2 ثم إزاحة لليسار 1.5… أو إزاحة لليسار 3 ثم ضغط ×2. النتيجة واحدة.'
            }
          ],
          questions: [
            {
              type: 'mcq', review: true,
              q: 'العلاقة الصح بين sampling والإشارة المتقطعة؟',
              options: ['x[n] = x(nT)', 'x[n] = x(t)/n', 'x[n] = x(n+T)', 'x[n] = x(t)+n'],
              answer: 0,
              explain: 'بناخد العينة عند الزمن nT، فـ x[n]=x(nT).'
            },
            {
              type: 'tf', review: true,
              q: 'الإشارة المتقطعة في الزمن لازم تكون مكمّمة في السعة.',
              answer: false,
              explain: 'لأ. ممكن تكون DT وسعتها continuous. التكميم خطوة تانية بعد الsampling.'
            },
            {
              type: 'mcq',
              q: 'x(2t) بتعمل إيه؟',
              options: ['تمد الإشارة ×2', 'تضغط الإشارة في الزمن ×2', 'تزيحها لليمين 2', 'تقلبها'],
              answer: 1,
              explain: 'الضرب في 2 جوه الدالة بيضغط الزمن للنص. في الرسم الشكل بيبقى أضيق.'
            },
            {
              type: 'mcq',
              q: 'x(t+3) إزاحة…',
              options: ['لليمين 3', 'لليسار 3', 'لأعلى 3', 'لأسفل 3'],
              answer: 1,
              explain: 'الزيادة جوه الدالة معناها تقديم في الزمن، يعني الإشارة تتحرك لليسار.'
            }
          ]
        },
        {
          id: 's2', title: 'دوري ولا مش دوري؟', subtitle: 'Periodic, even & odd', icon: '🔁', minutes: 5,
          cards: [
            {
              type: 'idea', kicker: 'الدورية',
              title: 'إشارة بتكرر نفسها',
              body: [
                'الإشارة الدورية بتكرر نفس الشكل كل فترة T: <span dir="ltr">x(t)=x(t+T)</span>.',
                'أصغر T موجبة بتعمل كده اسمها <b>fundamental period T₀</b>.'
              ],
              formula: 'f₀ = 1/T₀\nω₀ = 2π/T₀ = 2πf₀',
              bullets: [
                '<b>Periodic:</b> بتتكرر بنمط ثابت',
                '<b>Aperiodic:</b> بتتغير من غير تكرار دوري'
              ],
              note: 'إشارة CT دورية بعد الـ sampling ممكن ما تفضلش دورية DT. خدي بالك من الملاحظة دي.'
            },
            {
              type: 'idea', kicker: 'التماثل',
              title: 'Even وOdd',
              body: [
                '<b>Even:</b> متماثلة حول المحور الرأسي، <span dir="ltr">x(−t)=x(t)</span>. زي cos.',
                '<b>Odd:</b> <span dir="ltr">x(−t)=−x(t)</span>. زي sin.'
              ],
              formula: 'x(t) = xₑ(t) + xₒ(t)\nxₑ(t) = ½[x(t) + x(−t)]\nxₒ(t) = ½[x(t) − x(−t)]',
              note: 'أي إشارة تقدر تتحلل لجزء even وجزء odd. الحيلة دي بتوفر وقت في فورييه.'
            },
            {
              type: 'idea', kicker: 'تصنيفات كمان',
              title: 'Deterministic وRandom + Energy/Power',
              body: [
                '<b>Deterministic:</b> قيمتها معروفة أو محددة في أي وقت. <b>Random:</b> غير مؤكدة قبل ما تحصل، زي thermal noise.',
                '<b>Energy signal:</b> <span dir="ltr">0<E<∞</span>. <b>Power signal:</b> <span dir="ltr">0<P<∞</span>.'
              ],
              formula: 'E = ∫ |x(t)|² dt\nP = lim (1/T) ∫ |x(t)|² dt',
              bullets: [
                'إشارة الطاقة: طاقتها الكلية محدودة',
                'إشارة القدرة: قدرتها المتوسطة محدودة'
              ]
            },
            {
              type: 'example', kicker: 'مثال سريع',
              title: 'x(t)=cos(2π·50t)',
              problem: 'إيه T₀ وf₀ وω₀؟',
              steps: [
                'f₀ = 50 Hz لأن المعامل جوه الـ cos هو 2πf₀t.',
                'T₀ = 1/f₀ = 1/50 = 0.02 s.',
                'ω₀ = 2πf₀ = 100π rad/s.'
              ],
              answer: 'T₀ = 0.02 s، f₀ = 50 Hz، ω₀ = 100π rad/s.'
            }
          ],
          questions: [
            {
              type: 'mcq', review: true,
              q: 'cos إشارة…',
              options: ['Odd', 'Even', 'Random', 'Aperiodic دائمًا'],
              answer: 1,
              explain: 'cos(−t)=cos(t)، فالإشارة even. sin هي اللي odd.'
            },
            {
              type: 'input', review: true,
              q: 'إشارة دورية T₀ = 0.02 s. f₀ كام؟',
              suffix: 'Hz', answers: ['50', '50hz', '50 hz'],
              hint: 'f₀ = 1/T₀',
              explain: 'f₀ = 1/0.02 = 50 Hz.'
            },
            {
              type: 'tf',
              q: 'الإشارة العشوائية معروفة القيمة قبل حدوثها.',
              answer: false,
              explain: 'العشوائية معناها عدم التأكد قبل الحدوث، زي الضوضاء الحرارية.'
            },
            {
              type: 'mcq',
              q: 'إشارة الطاقة بتحقق…',
              options: ['E = 0', '0 < E < ∞', 'P = ∞', 'E < 0'],
              answer: 1,
              explain: 'إشارة الطاقة طاقتها الكلية محدودة وموجبة. إشارة القدرة قدرتها المتوسطة محدودة.'
            }
          ]
        },
        {
          id: 's3', title: 'الإشارات الأساسية', subtitle: 'Step, impulse, sinc…', icon: '🧩', minutes: 6,
          cards: [
            {
              type: 'idea', kicker: '1',
              title: 'Unit step',
              body: [
                '<span dir="ltr">u(t)=0</span> لو t<0، و1 لو t≥0. زي مفتاح اتقفل فجأة.',
                'في DT: <span dir="ltr">u[n]=1</span> لـ n≥0.'
              ],
              formula: 'u(t) = { 0, t < 0\n         1, t ≥ 0'
            },
            {
              type: 'idea', kicker: '2',
              title: 'Unit ramp',
              body: [
                '<span dir="ltr">r(t)=t·u(t)</span>. بتبدأ من صفر وبتزيد ب slope = 1.',
                'هي <b>تكامل</b> الـ step، ومشتقتها هي الـ step.'
              ],
              formula: 'r(t) = t u(t)\nr[n] = n u[n]'
            },
            {
              type: 'idea', kicker: '3',
              title: 'Unit impulse (Delta)',
              body: [
                '<span dir="ltr">δ(t)=0</span> في كل مكان ما عدا t=0، لكن <b>المساحة</b> تحتها = 1.',
                'مهم جدًا: القيمة عند النقطة نفسها مش المهمة، المساحة هي المهمة.'
              ],
              formula: '∫ δ(t) dt = 1\n∫ x(t) δ(t−t₀) dt = x(t₀)\nδ[n] = 1 at n=0, else 0',
              note: 'خاصية السحب (sifting) دي بتظهر كتير في الامتحانات.'
            },
            {
              type: 'idea', kicker: '4',
              title: 'Sinusoid وExponential',
              body: [
                'السينوسويد: <span dir="ltr">A sin(ω₀t+θ)</span>. الـ exponential: <span dir="ltr">e^{at}</span>.',
                'لو a<0 → decaying، لو a>0 → growing. والمركّب <span dir="ltr">e^{jω₀t}=cosω₀t+j sinω₀t</span>.'
              ],
              formula: 'A sin(ω₀t + θ)\ne^{at}\ne^{jω₀t} = cos(ω₀t) + j sin(ω₀t)',
              bullets: [
                'A = amplitude',
                'θ = phase',
                'ω₀ = angular frequency (rad/s)'
              ]
            },
            {
              type: 'idea', kicker: '5',
              title: 'Rect وSinc',
              body: [
                '<b>Rect:</b> بوابة قيمتها 1 جوه فترة ومفيش برّاها.',
                '<b>Sinc:</b> <span dir="ltr">sin(πt)/(πt)</span>. بتظهر كتير في الفلاتر والـ sampling.'
              ],
              formula: 'rect(t/τ)\nsinc(t) = sin(πt)/(πt),   sinc(0)=1'
            }
          ],
          questions: [
            {
              type: 'match', review: true,
              q: 'وصّلي كل إشارة بتعريفها.',
              pairs: [
                ['u(t)', '0 لـ t<0 و1 لـ t≥0'],
                ['r(t)', 't·u(t)'],
                ['δ(t)', 'مساحتها 1 عند t=0'],
                ['sinc(t)', 'sin(πt)/(πt)']
              ],
              explain: 'step، ramp، impulse، sinc… الأربعة دول أساس أي كلام في DSP.'
            },
            {
              type: 'mcq', review: true,
              q: '∫δ(t)dt من −∞ لـ ∞ =؟',
              options: ['0', '1', '∞', 't'],
              answer: 1,
              explain: 'تعريف الـ impulse إن المساحة الكلية = 1.'
            },
            {
              type: 'tf', review: true,
              q: 'الـ ramp هي مشتقة الـ step.',
              answer: false,
              explain: 'العكس: الـ ramp هي تكامل الـ step، ومشتقة الـ ramp هي الـ step.'
            },
            {
              type: 'mcq',
              q: 'e^{−3t} (t≥0) إشارة…',
              options: ['Growing exponential', 'Decaying exponential', 'Sinusoidal', 'Impulse'],
              answer: 1,
              explain: 'الأس سالب، فالقيمة بتقل مع الوقت → decaying exponential.'
            }
          ]
        },
        {
          id: 's4', title: 'الأنظمة وخصائصها', subtitle: 'System properties', icon: '⚙️', minutes: 6,
          cards: [
            {
              type: 'idea', kicker: 'النظام',
              title: 'النظام بيحوّل إشارة لإشارة',
              body: [
                '<b>System</b> = مجموعة عناصر بتاخد input x وتطلع output y.',
                'أمثلة: دايرة كهربية، CD player، قناة اتصال بتضعّف الإشارة وتضيف noise.'
              ],
              formula: 'x(t) → H → y(t)',
              note: 'نفس الفكرة في DT: x[n] → H → y[n].'
            },
            {
              type: 'idea', kicker: 'الذاكرة والسببية',
              title: 'Memory وCausality',
              body: [
                '<b>Memoryless:</b> الخرج يعتمد على الدخل الحالي بس. زي <span dir="ltr">y(t)=x(t)</span>.',
                '<b>Memory:</b> الخرج بيعتمد على ماضي أو مستقبل. زي <span dir="ltr">y[n]=x[n−1]</span>.'
              ],
              bullets: [
                '<b>Causal:</b> الخرج يعتمد على الحاضر والماضي فقط',
                '<b>Noncausal:</b> بيعتمد على المستقبل',
                'Memoryless ⇒ causal، لكن العكس مش شرط'
              ],
              formula: 'y[n] = x[n+2]  →  Noncausal\ny[n] = x[n−1]  →  Causal + Memory'
            },
            {
              type: 'idea', kicker: 'الاستقرار',
              title: 'BIBO Stability',
              body: [
                'النظام مستقر BIBO لو أي input محدود بيطلّع output محدود.',
                'لو دخلت إشارة جوه Mx، الخرج لازم يفضل جوه My.'
              ],
              formula: '|x(t)| ≤ Mx < ∞  ⇒  |y(t)| ≤ My < ∞'
            },
            {
              type: 'idea', kicker: 'الخطية والزمن',
              title: 'Linearity وTime-Invariance',
              body: [
                '<b>Linear</b> = superposition + homogeneity. لو دخلين، الخرج = مجموع الخرجين بنفس المعاملات.',
                '<b>Time-invariant:</b> نفس الدخل بعد إزاحة زمنية يطلّع نفس الخرج بعد نفس الإزاحة.'
              ],
              formula: 'a x₁ + b x₂ → a y₁ + b y₂\nx(t−t₀) → y(t−t₀)'
            }
          ],
          questions: [
            {
              type: 'mcq', review: true,
              q: 'y[n] = x[n+2] نظام…',
              options: ['Causal', 'Noncausal', 'Memoryless', 'Static'],
              answer: 1,
              explain: 'الخرج بيعتمد على عينة مستقبلية n+2، فهو noncausal.'
            },
            {
              type: 'mcq',
              q: 'y(t) = x(t) نظام…',
              options: ['Memoryless وCausal', 'Memory وNoncausal', 'غير مستقر دائمًا', 'غير خطي'],
              answer: 0,
              explain: 'الخرج من الدخل الحالي بس → memoryless، وبالتالي causal.'
            },
            {
              type: 'tf', review: true,
              q: 'النظام الخطي لازم يحقق superposition وhomogeneity.',
              answer: true,
              explain: 'الخطية = superposition (جمع) + homogeneity (scaling).'
            },
            {
              type: 'match',
              q: 'وصّلي الخاصية بمعناها.',
              pairs: [
                ['Causal', 'الخرج مش بيعتمد على المستقبل'],
                ['Memoryless', 'الخرج من الدخل الحالي بس'],
                ['Stable', 'دخل محدود ⇒ خرج محدود'],
                ['Time-invariant', 'إزاحة الدخل ⇒ نفس إزاحة الخرج']
              ],
              explain: 'أربع خصائص بتتسأل كتير: causal، memoryless، stable، time-invariant.'
            }
          ]
        },
        {
          id: 's5', title: 'العمليات على الإشارة', subtitle: 'Shift & scale', icon: '✂️', minutes: 4,
          cards: [
            {
              type: 'idea', kicker: 'القواعد',
              title: 'Shift وScale',
              body: [
                'الإزاحة جوه الدالة عكس الاتجاه اللي بتتوقعه: <span dir="ltr">x(t−2)</span> إزاحة لليمين 2.',
                'الضغط جوه الدالة: <span dir="ltr">x(2t)</span> بتضغط الزمن للنص. البرّا: <span dir="ltr">2x(t)</span> بتضاعف السعة.'
              ],
              formula: 'x(t−t₀): right t₀\nx(t+t₀): left t₀\nx(at): compress by a (a>1)'
            },
            {
              type: 'idea', kicker: 'طريقة آمنة',
              title: 'شوفي الضغط الأول',
              body: [
                'حوّلي التعبير لصيغة <span dir="ltr">x(a(t−b))</span> عشان تعرفي الإزاحة والضغط.',
                'بعدين طبّقي: الضغط بيغيّر المسافات، والإزاحة بتغيّر المكان.'
              ],
              formula: 'x(2t+3) = x(2(t+1.5))'
            },
            {
              type: 'example', kicker: 'مثال',
              title: 'مثلث من 0 لـ 4',
              problem: 'x(t) = مثلث من 0 لـ 4. ارسمي x(2t−2).',
              steps: [
                'x(2t−2) = x(2(t−1)).',
                'ضغط ×2: العرض يبقى 2 بدل 4.',
                'إزاحة لليمين 1: يبدأ عند 1 وينتهي عند 3.'
              ],
              answer: 'المدى الجديد: t ∈ [1, 3].'
            },
            {
              type: 'note', kicker: 'حيلة سريعة',
              title: 'متلخبطيش 3 بـ1.5',
              quote: 'لو الإزاحة جوه مع الضغط: اطلعي الـ coefficient factor الأول. x(2t+3) ≠ إزاحة 3… دي إزاحة 1.5 بعد الضغط.',
              note: 'ولما ترسمي، جرّبي نقطتين: t=0 وt=1، وشوفي القيمة الأصلية عندها فين.'
            }
          ],
          questions: [
            {
              type: 'mcq',
              q: 'x(t−4) إزاحة…',
              options: ['لليسار 4', 'لليمين 4', 'لأعلى 4', 'ضغط ×4'],
              answer: 1,
              explain: 'الطرح جوه الدالة = تأخير = إزاحة لليمين.'
            },
            {
              type: 'mcq',
              q: 'x(3t) بتعمل إيه في الزمن؟',
              options: ['فرد ×3', 'ضغط ×3', 'إزاحة 3', 'مقلوب'],
              answer: 1,
              explain: 'المعامل أكبر من 1 جوه الدالة بيضغط الزمن بمقداره.'
            },
            {
              type: 'tf',
              q: 'x(2t+3) = x(2(t+1.5)) فالإزاحة 1.5 لليسار.',
              answer: true,
              explain: 'صح: إزاحة لليسار 1.5 بعد ضغط ×2.'
            },
            {
              type: 'input',
              q: 'x(t) مداها [0, 4]. x(2t) هيكون مداها من 0 لـ كام؟',
              answers: ['2', '٢'],
              hint: 'الضغط بيقسم المدى على 2',
              explain: 'x(2t) بتضغط الزمن للنص، فالمدى يبقى [0, 2].'
            }
          ]
        }
      ]
    },

    /* ================= UNIT 1 ================= */
    {
      id: 'intro', number: '01', emoji: '🎛️',
      title: 'مقدمة DSP',
      tagline: 'الإشارة، الرحلة، وليه الدنيا بقت رقمية',
      color: '#7C5CFF', dark: '#5B3FE0', soft: '#EFEAFF',
      lessons: [
        {
          id: 'i1', title: 'الإشارة = معلومة', subtitle: 'Signal basics', icon: '💡', minutes: 4,
          cards: [
            {
              type: 'idea', kicker: 'أول فكرة',
              title: 'الإشارة = حاجة بتتغيّر وبتشيل معلومة',
              body: [
                'أي كمية نقدر نقيسها وبتوصّل معلومة من نقطة لنقطة، دي <b>إشارة</b>. صوتك، ضربات قلبك، درجة حرارة جسمك… كلها إشارات.',
                'في الكلام التقني بنكتبها كدالة في متغير مستقل، زي الزمن <span dir="ltr">t</span>.'
              ],
              bullets: [
                'كهربية: فولت أو تيار في دايرة',
                'صوتية: ضغط الهوا عند المايك',
                'ميكانيكية: سرعة عربية مع الوقت',
                'ضوئية: شدة بكسل في صورة'
              ],
              note: '<b>Signal</b> = function of one or more independent variables that carries information.'
            },
            {
              type: 'idea', kicker: 'بُعد الإشارة',
              title: '1D و2D و3D… الحكاية في عدد المتغيرات',
              body: [
                'عدد المتغيرات المستقلة بيحدد بُعد الإشارة. الصوت <b>1D</b> لأن القيمة بتتغير مع الزمن بس.',
                'الصورة <b>2D</b> لأن الشدة دالة في <span dir="ltr">(x, y)</span>. الفيديو <b>3D</b> لأن فيه زمن كمان.'
              ],
              formula: 'Audio: x(t)\nImage: I(x, y)\nVideo: I(x, y, t)',
              bullets: [
                'Multi-channel: أكتر من مصدر، فبنمثلها vector زي <span dir="ltr">[s₁(t), s₂(t), s₃(t)]</span>',
                'الصورة أبيض وأسود اللي بتتغير مع الوقت = إشارة 3D'
              ]
            },
            {
              type: 'idea', kicker: 'التعريف',
              title: 'DSP يعني إيه؟',
              body: [
                '<b>Digital Signal Processing</b> هي المعالجة الرقمية للإشارة بعد ما نحولها لأرقام (samples).',
                'الهدف: نستخرج الإشارة المفيدة من الإشارة غير المفيدة، ونحسّنها.'
              ],
              bullets: [
                '<b>Smoothing:</b> تنعيم الإشارة',
                '<b>Filtering:</b> شيل الضوضاء أو نطاق ترددي مش عايزينه',
                '<b>Prediction:</b> توقع القيمة الجاية'
              ],
              formula: 'Analog → samples → numbers → processing → numbers → analog',
              note: 'DSP = numerical manipulation of signals and data in <b>sampled form</b>.'
            },
            {
              type: 'example', kicker: 'مثال من حياتك',
              title: 'صوتك في مكالمة فيها وشوشة… DSP يساعد إزاي؟',
              problem: 'صوتك وصل للمايك، بس فيه noise من الشارع. إزاي نظام DSP يرجّع صوت واضح؟',
              steps: [
                'المايك يحوّل الصوت لإشارة كهربية أنالوج.',
                'ADC ياخد عينات ويحوّلها لأرقام.',
                'فلتر رقمي يشيل الوشوشة ويحافظ على الكلام.',
                'DAC يرجّع الأرقام لصوت تسمعيه.'
              ],
              answer: 'النتيجة: صوت أوضح. ونفس الفكرة بنستخدمها في الصور والأشعة والرادار.'
            }
          ],
          questions: [
            {
              type: 'mcq', review: true,
              q: 'إيه التعريف الأقرب للإشارة؟',
              options: [
                'أي كمية ثابتة مش بتتغير',
                'أي دالة أو كمية متغيرة بتشيل معلومة',
                'أي جهاز كهربي',
                'أي رقم صحيح'
              ],
              answer: 1,
              explain: 'الإشارة دالة في متغير مستقل (زي الزمن) وبتنقل معلومة. الثابت مش إشارة مفيدة.'
            },
            {
              type: 'mcq',
              q: 'صورة ثابتة (الشدة كدالة في x و y) تعتبر إشارة…',
              options: ['1D', '2D', '3D', 'صفرية'],
              answer: 1,
              explain: 'عندنا متغيرين مستقلين x و y، يبقى 2D. الفيديو بيزوّد الزمن فيبقى 3D.'
            },
            {
              type: 'tf',
              q: 'الإشارة بعد الـ ADC بتكون متقطعة في الزمن ومكمّمة في السعة.',
              answer: true,
              explain: 'صح. الـ ADC = sampling (تقطيع الزمن) + quantization (تقريب السعة لمستويات محدودة).'
            },
            {
              type: 'mcq',
              q: 'أي واحدة مش من أهداف DSP الأساسية؟',
              options: ['Smoothing', 'Filtering', 'Prediction', 'زيادة الضوضاء'],
              answer: 3,
              explain: 'DSP بيهدف لتنعيم الإشارة وفلترتها وتوقعها… مش بيضيف ضوضاء!'
            }
          ]
        },
        {
          id: 'i2', title: 'رحلة الإشارة', subtitle: 'From mic to speaker', icon: '🛤️', minutes: 5,
          cards: [
            {
              type: 'idea', kicker: 'خط السكة',
              title: 'الرحلة كاملة من المايك للسماعة',
              body: [
                'أي نظام DSP محترم بيمشي في ترتيب ثابت. لو فهمتي الترتيب ده، كسبتي جزء كبير من أسئلة المحاضرة.'
              ],
              diagram: 'adc',
              bullets: [
                '<b>Anti-alias lowpass filter</b> قبل الـ ADC',
                '<b>Sample & Hold</b> بعد الفلتر',
                '<b>ADC</b> = Sampling + Quantization',
                '<b>DSP processor</b> يعالج الأرقام',
                '<b>DAC</b> يرجّع أنالوج',
                '<b>Reconstruction lowpass filter</b> بعد الـ DAC'
              ],
              note: 'الفلتر اللي قبل ADC اسمه <b>anti-aliasing</b>، واللي بعد DAC اسمه <b>reconstruction / anti-image</b>.'
            },
            {
              type: 'idea', kicker: 'فرق مهم',
              title: 'Sampling مش Quantization',
              body: [
                '<b>Sampling:</b> بناخد قيم الإشارة كل <span dir="ltr">T</span> ثانية. الإشارة بتبقى متقطعة في الزمن، لكن السعة لسه continuous.',
                '<b>Quantization:</b> بنقرّب السعة لأقرب مستوى من مستويات محدودة. هنا الإشارة بتبقى رقمية فعلاً.'
              ],
              formula: 'f_s = 1 / T     (samples per second, Hz)',
              note: 'ADC = Sampling + Quantization. الاتنين مش حاجة واحدة.'
            },
            {
              type: 'idea', kicker: 'الفلاتر',
              title: 'ليه فلتر قبل وفلتر بعد؟',
              body: [
                'قبل ADC: نشيل أي تردد أكبر من <span dir="ltr">fs/2</span> عشان ما يحصلش aliasing.',
                'بعد DAC: نشيل الصور (images) والانتقالات الحادة ونرجّع الشكل الأنالوج الناعم.'
              ],
              formula: 'LPF → ADC → DSP → DAC → LPF',
              bullets: [
                'فلتر قبل = حماية من التداخل',
                'فلتر بعد = تجميل وإرجاع الإشارة'
              ]
            },
            {
              type: 'example', kicker: 'اختبري نفسك',
              title: 'وصلنا الترتيب؟',
              problem: 'رتّبي رحلة الإشارة من المايك للسماعة.',
              steps: [
                'Analog input',
                'Anti-alias LPF',
                'Sample & Hold + ADC',
                'DSP',
                'DAC',
                'Reconstruction LPF',
                'Analog output'
              ],
              answer: 'لو نسيتي، افتكري: نضّفي قبل ما تدخّلي، ونضّفي بعد ما تخرجي 😌'
            }
          ],
          questions: [
            {
              type: 'order', review: true,
              q: 'رتّبي أول 4 خطوات في نظام DSP.',
              items: ['Analog input', 'Anti-alias LPF', 'Sample & Hold + ADC', 'DSP'],
              explain: 'قبل أي sampling لازم نفلتر عشان نمنع الترددات العالية. بعدها sample & hold ثم ADC ثم المعالج.'
            },
            {
              type: 'mcq',
              q: 'الـ ADC بيتكوّن من…',
              options: ['Sampling + Quantization', 'Filtering + Amplification', 'DAC + LPF', 'FFT + IFFT'],
              answer: 0,
              explain: 'ADC = Analog to Digital Converter: sampling في الزمن + quantization في السعة.'
            },
            {
              type: 'tf',
              q: 'الـ reconstruction filter بييجي بعد الـ DAC.',
              answer: true,
              explain: 'صح. بعد DAC بنحتاج lowpass filter يشيل الصور والانتقالات الحادة.'
            },
            {
              type: 'mcq',
              q: 'وظيفة الـ anti-alias filter؟',
              options: [
                'تكبير الإشارة',
                'منع الترددات فوق fs/2 قبل السampling',
                'تحويل الأرقام لأنالوج',
                'حفظ العينات'
              ],
              answer: 1,
              explain: 'الفلتر بيمنع الترددات اللي ممكن تتطبق (alias) بعد السampling. مكانه قبل ADC.'
            }
          ]
        },
        {
          id: 'i3', title: 'ليه DSP أحسن؟', subtitle: 'Advantages & limits', icon: '⚡', minutes: 4,
          cards: [
            {
              type: 'idea', kicker: 'المزايا',
              title: 'ليه DSP أحلى من Analog؟',
              body: [
                'الأنالوج حلو وسريع، لكن DSP بيديكي تحكم ودقة مش سهلة في الدواير التقليدية.'
              ],
              bullets: [
                '<b>مرونة:</b> تغيّري الوظيفة بتغيير الكود مش الدايرة',
                '<b>دقة وتكرار:</b> نفس النتيجة كل مرة',
                '<b>تخزين ونقل أسهل:</b> الإشارة أرقام',
                '<b>خوارزميات معقدة:</b> FFT وفلترة متقدمة'
              ]
            },
            {
              type: 'idea', kicker: 'الحدود',
              title: 'بس فيه حدود…',
              bullets: [
                'سرعة الـ ADC والمعالج',
                'إشارات bandwidth عالي جدًا محتاجة sampling سريع',
                'تكلفة واستهلاك طاقة في بعض التطبيقات'
              ],
              note: 'مش كل حاجة digital أحسن. المهندس بيختار حسب التطبيق.'
            },
            {
              type: 'idea', kicker: 'في كل حتة',
              title: 'فين بنشوف DSP؟',
              bullets: [
                '<b>طب:</b> CT, MRI, Ultrasound, ECG',
                '<b>اتصالات:</b> موبايل، مودم، صوت وفيديو',
                '<b>ترفيه:</b> ضغط صوت وصورة',
                '<b>صناعة ورادار وأبحاث فضائية</b>'
              ],
              note: 'أي حاجة فيها ضغط، فلترة، أو استخراج معلومة… DSP غالبًا موجود.'
            },
            {
              type: 'note', kicker: 'نصيحة امتحان 💡',
              title: 'الدرجة على الحل مش الناتج',
              quote: 'المحاضرة بتقول: الدرجة على الحل والخطوات، مش على الناتج النهائي. اكتبي خطواتك… حتى لو الناتج غلط ممكن تاخدي الدرجة كاملة.',
              note: 'ولو الناتج صح من غير تبرير، ممكن تاخدي صفر. فالخطوات هي الأمان.'
            }
          ],
          questions: [
            {
              type: 'mcq', review: true,
              q: 'ميزة أساسية لـ DSP؟',
              options: [
                'المرونة وإعادة البرمجة',
                'إنه مش محتاج ADC',
                'إنه بيشتغل على إشارة continuous فقط',
                'إنه بيلغي الحاجة للفلاتر'
              ],
              answer: 0,
              explain: 'المرونة أكبر ميزة: نفس الهاردوير بيعمل وظائف مختلفة بالبرمجة.'
            },
            {
              type: 'mcq',
              q: 'حد من حدود DSP؟',
              options: [
                'مش بيقدر يخزن أرقام',
                'سرعة ADC/المعالج مع bandwidth عالي',
                'بيحتاج ورق وقلم',
                'مش بيشتغل في الطب'
              ],
              answer: 1,
              explain: 'الإشارات ذات bandwidth عالي جدًا محتاجة sampling سريع ومعالج سريع.'
            },
            {
              type: 'match',
              q: 'وصّلي كل تطبيق بمجاله.',
              pairs: [
                ['CT وMRI', 'طب'],
                ['ضغط الصوت والفيديو', 'ترفيه'],
                ['الرادار', 'استشعار وعسكري'],
                ['موبايل ومودم', 'اتصالات']
              ],
              explain: 'DSP موجود في الطب والاتصالات والترفيه والرادار… وكل حاجة تقريبًا.'
            },
            {
              type: 'tf',
              q: 'الـ DSP دايماً أفضل من الأنالوج في كل تطبيق.',
              answer: false,
              explain: 'لأ. فيه حالات الأنالوج أفضل أو أرخص أو أسرع. الاختيار بيعتمد على التطبيق.'
            }
          ]
        }
      ]
    },

    /* ================= UNIT 3 ================= */
    {
      id: 'fourier', number: '03', emoji: '🎼',
      title: 'سلسلة فورييه',
      tagline: 'كل موجة معقدة = نوتات بسيطة… تعالي نفكّها',
      color: '#FF8A3D', dark: '#D96619', soft: '#FFF0E4',
      lessons: [
        {
          id: 'f1', title: 'فكرة فورييه', subtitle: 'The big idea', icon: '🎵', minutes: 5,
          cards: [
            {
              type: 'idea', kicker: 'الفكرة الكبيرة',
              title: 'كل إشارة دورية = نوتات',
              body: [
                'فورييه قال: أي إشارة دورية معقدة نقدر نكوّنها من مجموع موجات جيبية بسيطة.',
                'كل موجة ليها تردد وسعة وphase. والترددات كلها مضاعفات للتردد الأساسي.'
              ],
              bullets: [
                '<b>DC:</b> القيمة المتوسطة',
                '<b>Even part:</b> موجات cos',
                '<b>Odd part:</b> موجات sin'
              ],
              formula: 'x(t) = a₀/2 + Σ [aₙcos(nω₀t) + bₙsin(nω₀t)]',
              note: 'المجموع من n=1 لـ ∞. الـ DC لوحده هو a₀/2.'
            },
            {
              type: 'idea', kicker: 'الترددات',
              title: 'الأساسي والهارمونيكس',
              body: [
                'التردد الأساسي <span dir="ltr">ω₀=2π/T</span> هو النوتة الأولى.',
                '<span dir="ltr">nω₀</span> هو الهارمونيك رقم n. زي أوتار الجيتار: نفس النوتة بدرجات أعلى.'
              ],
              formula: 'ω₀ = 2π/T\nωₙ = nω₀',
              bullets: [
                'n=1 → fundamental',
                'n=2 → second harmonic',
                'n=3 → third harmonic…'
              ]
            },
            {
              type: 'demo', kicker: 'جرّبي بنفسك',
              title: 'ابني موجة مربعة بالهارمونيكس',
              body: [
                'زيدي عدد الهارمونيكس وشوفي إزاي الموجة المربعة بتتبني قدامك.',
                'أول ما تزوّدي، الحواف بتبقى أحدّ… لكن مش هتبقى مثالية 100% (ظاهرة Gibbs).'
              ],
              demo: 'fourier'
            },
            {
              type: 'idea', kicker: 'Series ولا Transform؟',
              title: 'إمتى نستخدم إيه؟',
              body: [
                '<b>Periodic → Fourier Series:</b> طيف خطوط (line spectrum) عند nf₀.',
                '<b>Aperiodic → Fourier Transform:</b> طيف متصل لكل الترددات.'
              ],
              formula: 'Periodic → discrete lines\nAperiodic → continuous spectrum',
              note: 'الفرق ده سؤال نظري بيتكرر كتير.'
            }
          ],
          questions: [
            {
              type: 'mcq', review: true,
              q: 'سلسلة فورييه بتستخدم مع إشارة…',
              options: ['دورية', 'عشوائية', 'غير دورية', 'مكمّمة'],
              answer: 0,
              explain: 'Series للإشارات الدورية. غير الدورية ليها Fourier Transform.'
            },
            {
              type: 'input', review: true,
              q: 'T = 0.01 s. f₀ كام؟',
              suffix: 'Hz', answers: ['100', '100hz', '100 hz'],
              hint: 'f₀ = 1/T',
              explain: 'f₀ = 1/0.01 = 100 Hz. وω₀ = 2πf₀ = 200π rad/s.'
            },
            {
              type: 'tf', review: true,
              q: 'الهارمونيكس هي مضاعفات صحيحة للتردد الأساسي.',
              answer: true,
              explain: 'صح. كل هارمونيك تردده nω₀ حيث n=1,2,3,…'
            },
            {
              type: 'mcq',
              q: 'الجزء DC في سلسلة فورييه =؟',
              options: ['a₀', 'a₀/2', 'a₁', 'b₁'],
              answer: 1,
              explain: 'المعادلة فيها a₀/2، فالقيمة المتوسطة هي a₀/2 مش a₀.'
            }
          ]
        },
        {
          id: 'f2', title: 'المعاملات والرسم', subtitle: 'a₀, aₙ, bₙ', icon: '🧮', minutes: 6,
          cards: [
            {
              type: 'idea', kicker: 'الحساب',
              title: 'إزاي نطلع المعاملات؟',
              body: [
                'بنضرب الإشارة في cos أو sin وندمج على فترة كاملة. النتيجة بتقولنا نصيب كل تردد.',
                'التكامل هنا على أي فترة كاملة T.'
              ],
              formula: 'a₀ = (2/T) ∫ x(t) dt\naₙ = (2/T) ∫ x(t) cos(nω₀t) dt\nbₙ = (2/T) ∫ x(t) sin(nω₀t) dt'
            },
            {
              type: 'idea', kicker: 'اختصارات',
              title: 'الزوجي والفردي بيوفروا وقت',
              body: [
                'لو الإشارة <b>even</b>، معاملات الـ sin بتساوي صفر.',
                'لو الإشارة <b>odd</b>، معاملات الـ cos (والـ DC) بتساوي صفر.'
              ],
              formula: 'even ⇒ bₙ = 0\nodd  ⇒ aₙ = 0, a₀ = 0',
              note: 'الاختصار ده بيوفر عليكي نص التكاملات في الامتحان.'
            },
            {
              type: 'example', kicker: 'مثال المحاضرة',
              title: 'المربع 0/1',
              problem: 'x(t)=1 في أول نص فترة، و0 في التاني. T=2π. احسبي a₀ وaₙ وbₙ.',
              steps: [
                'a₀ = (2/T)∫₀^π 1 dt = 1.',
                'aₙ = (2/T)∫₀^π cos(nt)dt = 0.',
                'bₙ = (2/T)∫₀^π sin(nt)dt = (1/(nπ))(1−cos nπ).',
                'يبقى bₙ = 2/(nπ) للفردي، و0 للزوجي.'
              ],
              answer: 'x(t) = 1/2 + (2/π)[sin t + (1/3)sin3t + (1/5)sin5t + …]'
            },
            {
              type: 'demo', kicker: 'شوفيها بتحصل',
              title: 'كل هارمونيك فردي بيضيف حتة',
              body: [
                'المربع 0/1 مفيهوش هارمونيكس زوجية. جرّبي تزوّدي الحدود الفردية وشوفي الحواف.'
              ],
              demo: 'fourier',
              note: 'قمة Gibbs حوالي 9% من قيمة القفزة، وبتفضل موجودة مهما زودتي الحدود.'
            }
          ],
          questions: [
            {
              type: 'mcq', review: true,
              q: 'bₙ للمربع 0/1 عند n فردي =؟',
              options: ['1/(nπ)', '2/(nπ)', '0', 'nπ'],
              answer: 1,
              explain: 'bₙ = (1/(nπ))(1−cos nπ). للفردي cos nπ=−1، يبقى 2/(nπ).'
            },
            {
              type: 'tf', review: true,
              q: 'الإشارة الزوجية معاملات الـ sin فيها = 0.',
              answer: true,
              explain: 'صح. لأن sin دالة فردية والتكامل مع إشارة even بيطلع صفر.'
            },
            {
              type: 'input', review: true,
              q: 'a₀ للمربع 0/1 = 1. قيمة الـ DC (a₀/2) =؟',
              answers: ['0.5', '.5', '1/2', '٠.٥'],
              hint: 'اقسمي a₀ على 2',
              explain: 'a₀/2 = 1/2 = 0.5.'
            },
            {
              type: 'mcq',
              q: 'aₙ للمربع 0/1 =؟',
              options: ['1', '0', '2/(nπ)', 'nπ'],
              answer: 1,
              explain: 'تكامل cos على نصف فترة متماثل بيطلع صفر، فكل aₙ=0.'
            }
          ]
        },
        {
          id: 'f3', title: 'الطيف والـ DTFS', subtitle: 'Harmonics & spectrum', icon: '📊', minutes: 5,
          cards: [
            {
              type: 'idea', kicker: 'شكل تاني',
              title: 'السعة والزاوية',
              body: [
                'بدل sin وcos، بنجمع كل هارمونيك في موجة واحدة بسعة Cₙ وزاوية θₙ.',
                'ده أوضح للرسم والطيف.'
              ],
              formula: 'Cₙ = √(aₙ² + bₙ²)\nθₙ = tan⁻¹(bₙ/aₙ)\nx(t) = a₀/2 + Σ Cₙ cos(nω₀t − θₙ)'
            },
            {
              type: 'idea', kicker: 'الطيف',
              title: 'Line spectrum',
              body: [
                'ارسمي خط عند كل تردد nf₀، وطوله = السعة Cₙ.',
                'الطيف بيوريكي مين الترددات الموجودة وقوتها. الإشارة الدورية = خطوط مفصولة.'
              ],
              bullets: [
                'DC عند 0',
                'الأساسي عند f₀',
                'هارمونيكس عند 2f₀, 3f₀, …'
              ],
              note: 'الطيف المستمر يخص الإشارات غير الدورية (Fourier Transform).'
            },
            {
              type: 'idea', kicker: 'DTFS',
              title: 'لو الإشارة متقطعة ودورية',
              body: [
                'نفس فكرة فورييه، لكن المجموع على N عينة.',
                'التحليل بيطلع X[k]، والتركيب بيرجّع x[n]. خدي بالك من معامل 1/N في التركيب.'
              ],
              formula: 'X[k] = Σₙ₌₀^{N−1} x[n] e^{−j(2π/N)kn}\nx[n] = (1/N) Σₖ₌₀^{N−1} X[k] e^{j(2π/N)kn}'
            },
            {
              type: 'example', kicker: 'قيمة عملية',
              title: 'سعة أول هارمونيك للمربع',
              problem: 'المربع 0/1: سعة الهارمونيك الأول C₁ كام؟',
              steps: [
                'b₁ = 2/π، وa₁ = 0.',
                'C₁ = √(0² + (2/π)²) = 2/π.',
                '2/π ≈ 0.637.'
              ],
              answer: 'أول هارمونيك عنده حوالي 64% من سعة موجة الـ sin الأساسية.'
            }
          ],
          questions: [
            {
              type: 'mcq', review: true,
              q: 'Cₙ =؟',
              options: ['aₙ + bₙ', '√(aₙ² + bₙ²)', 'aₙ / bₙ', '√(aₙ + bₙ)'],
              answer: 1,
              explain: 'السعة المحصلة = جذر مجموع مربعي المعاملين (فيثاغورس).'
            },
            {
              type: 'tf', review: true,
              q: 'الإشارة الدورية طيفها خطوط (line spectrum).',
              answer: true,
              explain: 'صح. الخطوط عند nf₀ بارتفاعات Cₙ.'
            },
            {
              type: 'mcq',
              q: 'الإشارة غير الدورية طيفها…',
              options: ['خطوط', 'مستمر', 'نقطة واحدة', 'صفر دائمًا'],
              answer: 1,
              explain: 'غير الدورية → Fourier Transform → طيف متصل.'
            },
            {
              type: 'mcq',
              q: 'في DTFS، التركيب فيه معامل…',
              options: ['1/N', 'N', 'N²', 'لا شيء'],
              answer: 0,
              explain: 'x[n] = (1/N)ΣX[k]e^{j...}، فمعامل 1/N موجود في التركيب.'
            }
          ]
        }
      ]
    },

    /* ================= UNIT 4 ================= */
    {
      id: 'sampling', number: '04', emoji: '🎚️',
      title: 'Sampling والاسترجاع',
      tagline: 'نايكويست، الطيف، والـ Aliasing… أهم وحدة في الامتحان',
      color: '#38BDF8', dark: '#1285B8', soft: '#E5F7FF',
      lessons: [
        {
          id: 'sa1', title: 'ADC: من أنالوج لرقمي', subtitle: 'Sampling & quantization', icon: '🔢', minutes: 5,
          cards: [
            {
              type: 'idea', kicker: 'الخطوة الأولى',
              title: 'Sampling',
              body: [
                'بناخد عينة كل T ثانية: <span dir="ltr">x[n]=x(nT)</span>.',
                'النتيجة متقطعة في الزمن، لكن السعة لسه continuous.'
              ],
              formula: 'f_s = 1/T     (samples/sec, Hz)',
              bullets: [
                'T = sampling interval',
                'fs = sampling frequency',
                'عينات أسرع = معلومات أكتر'
              ]
            },
            {
              type: 'idea', kicker: 'الخطوة التانية',
              title: 'Quantization',
              body: [
                'بنقرّب كل سعة لأقرب مستوى من عدد محدود من المستويات.',
                'هنا الإشارة بتبقى رقمية: متقطعة في الزمن ومكمّمة في السعة.'
              ],
              bullets: [
                '<b>Sampling:</b> الزمن',
                '<b>Quantization:</b> السعة',
                '<b>ADC:</b> الاتنين مع بعض'
              ],
              note: 'الـ quantization error هو الفرق بين القيمة الحقيقية وأقرب مستوى.'
            },
            {
              type: 'idea', kicker: 'Sample & Hold',
              title: 'ليه بنمسك العينة؟',
              body: [
                'الـ ADC محتاج وقت يحوّل القيمة. فالدايرة بتشيل العينة وتحافظ على قيمتها طول الفترة T.',
                'ده اسمه <b>sample-and-hold</b>، وبيخلي التحويل مستقر.'
              ],
              diagram: 'adc',
              formula: 'sample → hold → quantize → encode'
            },
            {
              type: 'example', kicker: 'حساب سريع',
              title: 'من fs لـ T',
              problem: 'إشارة اتسمّبت بـ 8000 Hz. T كام؟',
              steps: [
                'T = 1/f_s.',
                'T = 1/8000 = 0.000125 s.',
                'بالمللي ثانية: ×1000 = 0.125 ms.'
              ],
              answer: 'T = 0.125 ms.'
            }
          ],
          questions: [
            {
              type: 'mcq', review: true,
              q: 'الـ sampling بيخلّي الإشارة متقطعة في…',
              options: ['السعة بس', 'الزمن بس', 'الزمن والسعة', 'ولا حاجة'],
              answer: 1,
              explain: 'Sampling بيقطع الزمن. Quantization هي اللي بتقطع السعة.'
            },
            {
              type: 'input', review: true,
              q: 'f_s = 8000 Hz. T بالمللي ثانية؟',
              suffix: 'ms', answers: ['0.125', '0.125ms', '.125', '٠.١٢٥'],
              hint: 'T = 1/fs ثم ×1000',
              explain: 'T = 1/8000 s = 0.000125 s = 0.125 ms.'
            },
            {
              type: 'tf',
              q: 'الـ quantization بتأثر على السعة.',
              answer: true,
              explain: 'صح. بتقرّب السعة لمستويات محدودة، وده مصدر quantization error.'
            },
            {
              type: 'mcq',
              q: 'وظيفة sample & hold؟',
              options: ['تثبيت قيمة العينة وقت التحويل', 'حذف الضوضاء', 'تكبير التردد', 'تحويل رقمي لأنالوج'],
              answer: 0,
              explain: 'بتحافظ على قيمة العينة ثابتة عشان ADC يلحق يحوّلها.'
            }
          ]
        },
        {
          id: 'sa2', title: 'نظرية نايكويست', subtitle: 'Nyquist theorem', icon: '🏆', minutes: 6,
          cards: [
            {
              type: 'idea', kicker: 'القاعدة الذهبية',
              title: 'f_s ≥ 2f_max',
              body: [
                'عشان نرجّع الإشارة بدون تشويه، لازم نسمّب بمعدل أكبر من أو يساوي ضعف أعلى تردد فيها.',
                'fmax = أعلى تردد موجود في الإشارة، مش التردد اللي إنتي عايزاه.'
              ],
              formula: 'f_s ≥ 2 f_max',
              bullets: [
                '<b>Nyquist rate</b> = 2fmax',
                '<b>Nyquist interval</b> = 1/(2fmax)',
                'لو الشرط اتكسر → Aliasing'
              ],
              note: 'لو f_s < 2fmax مفيش رجوع كامل. المعلومة اتلخبطت خلاص.'
            },
            {
              type: 'idea', kicker: 'أمثلة المحاضرة',
              title: 'Speech وAudio',
              body: [
                '<b>Speech:</b> fmax=4kHz → fs≥8kHz، Nyquist interval = 1/8000 = 0.125ms.',
                '<b>Audio:</b> fmax=20kHz → fs≥40kHz، Nyquist interval = 1/40000 = 25µs.'
              ],
              formula: 'Speech: 8 kHz, 0.125 ms\nAudio: 40 kHz, 25 µs',
              note: '25µs = 25 microsecond = 0.000025 s. خدي بالك من الوحدة.'
            },
            {
              type: 'demo', kicker: 'العبي بالـ sampling',
              title: 'امتى الموجة بتتشوّه؟',
              body: [
                'حرّكي الـ fs وشوفي. لو الـ fs أقل من 2fmax، العينات بتخدعك وبتظهر تردد تاني.',
                'ده بالظبط اللي بيحصل في فيديو العجلة اللي بتبان بترجع لورا.'
              ],
              demo: 'sampling'
            },
            {
              type: 'idea', kicker: 'Aliasing',
              title: 'التردد الظاهري',
              body: [
                'التردد العالي بيتنكر في شكل تردد واطي. التردد الظاهري = أقرب مسافة بين f وأي مضاعف للـ fs.',
                'لو f=7kHz وfs=8kHz، التردد الظاهري = |7−8| = 1kHz.'
              ],
              formula: 'f_alias = |f − round(f/f_s)·f_s|'
            }
          ],
          questions: [
            {
              type: 'input', review: true,
              q: 'f_max = 3 kHz. أقل f_s = كام Hz؟',
              suffix: 'Hz', answers: ['6000', '6000hz', '6khz', '6k', '٦٠٠٠'],
              hint: 'f_s = 2fmax',
              explain: 'fs ≥ 2×3000 = 6000 Hz = 6 kHz.'
            },
            {
              type: 'mcq', review: true,
              q: 'Nyquist interval لإشارة f_max = 4 kHz؟',
              options: ['0.125 ms', '0.25 ms', '8 ms', '4 ms'],
              answer: 0,
              explain: '1/(2×4000) = 1/8000 s = 0.125 ms.'
            },
            {
              type: 'tf', review: true,
              q: 'f_s = 1.5 f_max كافي لإرجاع الإشارة بدون تشويه.',
              answer: false,
              explain: 'لأ. لازم fs ≥ 2fmax. 1.5fmax أقل من المطلوب → aliasing.'
            },
            {
              type: 'mcq',
              q: 'Aliasing بيحصل لما…',
              options: ['fs ≥ 2fmax', 'fs < 2fmax', 'fmax = 0', 'fs = 0'],
              answer: 1,
              explain: 'لو fs أقل من ضعف أعلى تردد، النسخ بتتداخل والترددات العالية تتطبق على واطية.'
            }
          ]
        },
        {
          id: 'sa3', title: 'طيف الإشارة المسمّبة', subtitle: 'Spectrum & replicas', icon: '🌈', minutes: 6,
          cards: [
            {
              type: 'idea', kicker: 'في التردد',
              title: 'Sampling = تكرار الطيف',
              body: [
                'لما نسمّب، طيف الإشارة الأصلي بيتكرر عند ±fs, ±2fs, …',
                'كل نسخة اسمها <b>image</b>. لازم نشيلها بفلتر reconstruction.'
              ],
              formula: 'Replicas at ±n f_s,  n = 1, 2, 3, …',
              bullets: [
                'النسخة الأصلية عند 0 (baseband)',
                'أول صورة عند fs−B و fs+B',
                'لازم مفيش تداخل بينهم'
              ]
            },
            {
              type: 'idea', kicker: '3 حالات',
              title: 'فراغ، لمس، ولا تداخل',
              body: [
                '<b>fs > 2B:</b> فيه فراغ بين النسخ → سهل نفلتر.',
                '<b>fs = 2B:</b> النسخ بتلمس بعض → محتاج فلتر مثالي (غير عملي).',
                '<b>fs < 2B:</b> النسخ بتتداخل → Aliasing وتشويه.'
              ],
              formula: 'B = f_max\nFolding frequency = f_s / 2',
              note: 'أي تردد فوق fs/2 بيتطبق على صورة أقل منه.'
            },
            {
              type: 'demo', kicker: 'شوفي الطيف',
              title: 'النسخ بتقرب من بعض',
              body: [
                'حرّكي fs وشوفي المثلثات بتتحرك. أول ما تتداخل، يبقى دخلنا في Aliasing.'
              ],
              demo: 'spectrum'
            },
            {
              type: 'example', kicker: 'مثال المحاضرة',
              title: '5cos(2π·1000t) عند fs=8000',
              problem: 'فين الصور في الطيف؟',
              steps: [
                'الإشارة الأصلية عند ±1 kHz.',
                'النسخ بتتكرر كل fs=8 kHz.',
                'يبقى عند 7 kHz و9 kHz و15 kHz و17 kHz …'
              ],
              answer: 'الصور عند ±1k + n·8k. فلتر lowpass بيشيل كل حاجة ما عدا ±1kHz.'
            }
          ],
          questions: [
            {
              type: 'mcq', review: true,
              q: 'النسخ في الطيف بتفصل بينها…',
              options: ['fmax', 'fs', 'fs/2', 'T'],
              answer: 1,
              explain: 'النسخ بتتكرر كل fs، يعني المسافة بين أي نسختين = fs.'
            },
            {
              type: 'mcq', review: true,
              q: 'Folding frequency =؟',
              options: ['fs', '2fs', 'fs/2', 'fmax/2'],
              answer: 2,
              explain: 'أعلى تردد نقدر نمثله بأمان = fs/2. فوق كده بيبدأ التطبيق (folding).'
            },
            {
              type: 'tf', review: true,
              q: 'لو fs < 2B، ممكن نرجّع الإشارة الأصلية بفلتر مثالي.',
              answer: false,
              explain: 'لأ. التداخل irreversible. الفلتر المثالي مش هيفرق بين الأصل والصورة.'
            },
            {
              type: 'mcq',
              q: 'إشارة 1kHz اتسمّبت 8kHz. صورة عند…',
              options: ['3 kHz', '7 kHz', '4 kHz', '2 kHz'],
              answer: 1,
              explain: 'الصور عند 8±1 = 7 و9 kHz (وكمان 16±1 = 15 و17…).'
            }
          ]
        },
        {
          id: 'sa4', title: 'الاسترجاع ومكافحة Aliasing', subtitle: 'Reconstruction & anti-alias', icon: '🛡️', minutes: 7,
          cards: [
            {
              type: 'idea', kicker: 'الرجوع',
              title: 'Reconstruction',
              body: [
                'بعد DSP، الـ DAC بيحوّل الأرقام لسلسلة نبضات.',
                'فلتر lowpass بعد الـ DAC بيشيل الصور والانتقالات الحادة ويرجّع الشكل الأنالوج.'
              ],
              formula: 'DAC → Reconstruction LPF → analog output'
            },
            {
              type: 'idea', kicker: 'الحالات الثلاثة',
              title: 'إمتى الفلتر يكون عملي؟',
              body: [
                '<b>fs = 2B:</b> فلتر مثالي فقط (غير عملي).',
                '<b>fs > 2B:</b> فراغ كافي لفلتر عملي anti-image.',
                '<b>fs < 2B:</b> Aliasing وتشويه irreversible.'
              ],
              note: 'الفلتر العملي محتاج transition band، عشان كده في الواقع بنختار fs أكبر من 2B شوية.'
            },
            {
              type: 'idea', kicker: 'الحماية',
              title: 'Anti-aliasing filter',
              body: [
                'فلتر lowpass قبل الـ ADC بيقلل الترددات فوق fs/2 قبل ما تتسمّب.',
                'كل ما الـ order n يعلى، الـ roll-off يبقى أحدّ والـ aliasing noise يقل.'
              ],
              formula: 'Aliasing noise % =\n100 × √(1+(f_a/f_c)²ⁿ) / √(1+((f_s−f_a)/f_c)²ⁿ)\nfor 0 < f_a < f_c',
              note: 'n = order الفلتر، fc = cutoff، fa = التردد اللي بنحسب عنده، fs = sampling rate.'
            },
            {
              type: 'example', kicker: 'مثال 67.8%',
              title: 'fs=8000، fc=3400، n=2',
              problem: 'احسبي aliasing noise عند fa=fc وعند fa=1000.',
              steps: [
                'عند fa=fc=3400: النسبة = √2 / √(1+(4600/3400)⁴) ≈ 0.678 → 67.8%.',
                'عند fa=1000: √(1+(1000/3400)⁴) / √(1+(7000/3400)⁴) ≈ 0.2305 → 23.05%.',
                'كل ما fa يقل، الـ aliasing noise يقل.'
              ],
              answer: '67.8% عند الـ cutoff، و23.05% عند 1 kHz.'
            }
          ],
          questions: [
            {
              type: 'mcq',
              q: 'فلتر الاسترجاع نوعه…',
              options: ['Highpass', 'Lowpass', 'Bandpass', 'Allpass'],
              answer: 1,
              explain: 'محتاجين نمرر الترددات المنخفضة ونشيل الصور العالية → lowpass.'
            },
            {
              type: 'input', review: true,
              q: 'fs=8000، fmax=3000. هل fs > 2fmax؟ اكتبي 1 لو أيوه، 0 لو لا.',
              answers: ['1', '١'],
              hint: '2fmax = 6000',
              explain: '2fmax=6000، و8000>6000، فآه. الشرط متحقق.'
            },
            {
              type: 'mcq',
              q: 'هدف anti-alias filter؟',
              options: [
                'يشيل الترددات فوق fs/2 قبل السampling',
                'يزوّد الضوضاء',
                'يحوّل لأنالوج',
                'يخزّن الإشارة'
              ],
              answer: 0,
              explain: 'بيمنع الترددات العالية من إنها تتطبق (alias) بعد الsampling.'
            },
            {
              type: 'tf', review: true,
              q: 'زيادة order الفلتر بتقلل aliasing noise.',
              answer: true,
              explain: 'صح. الـ roll-off بيبقى أحدّ، فالتفريق بين fa و(fs−fa) بيبقى أوضح.'
            }
          ]
        }
      ]
    }
  ],

  sheet: [
    {
      id: 'signals', title: 'الإشارات والأنظمة', icon: '🌊',
      items: [
        { t: 'Signal', d: 'دالة في متغير مستقل وبتشيل معلومة. 1D صوت، 2D صورة، 3D فيديو.' },
        { t: 'CT vs DT', d: 'x(t) لكل t. x[n]=x(nT) عند أعداد صحيحة. DT مش معناها digital.' },
        { t: 'Periodic', d: 'x(t)=x(t+T). أصغر T = T₀، وf₀=1/T₀، وω₀=2πf₀.', f: 'x(t)=x(t+T)\nf₀=1/T₀   ω₀=2π/T₀' },
        { t: 'Even / Odd', d: 'Even: x(−t)=x(t). Odd: x(−t)=−x(t).', f: 'xₑ(t)=½[x(t)+x(−t)]\nxₒ(t)=½[x(t)−x(−t)]' },
        { t: 'Energy / Power', d: 'Energy signal: 0<E<∞. Power signal: 0<P<∞.', f: 'E=∫|x(t)|²dt\nP=lim (1/T)∫|x(t)|²dt' },
        { t: 'Step / Ramp / Impulse', d: 'u خطوة، r=t·u، δ مساحتها 1 عند 0.', f: 'r(t)=t·u(t)\n∫δ(t)dt=1' },
        { t: 'System', d: 'بيحوّل input لـ output. Memoryless، causal، stable، linear، time-invariant.', f: 'x(t) → H → y(t)' },
        { t: 'Linearity', d: 'Superposition + homogeneity.', f: 'a x₁+b x₂ → a y₁+b y₂' }
      ]
    },
    {
      id: 'fourier', title: 'سلسلة فورييه', icon: '🎼',
      items: [
        { t: 'الفكرة', d: 'أي إشارة دورية = DC + موجات sin/cos عند مضاعفات f₀.', f: 'x(t)=a₀/2+Σ[aₙcos(nω₀t)+bₙsin(nω₀t)]' },
        { t: 'المعاملات', d: 'التكامل على فترة كاملة T.', f: 'a₀=(2/T)∫x(t)dt\naₙ=(2/T)∫x(t)cos(nω₀t)dt\nbₙ=(2/T)∫x(t)sin(nω₀t)dt' },
        { t: 'اختصارات', d: 'even ⇒ bₙ=0. odd ⇒ aₙ=0 وa₀=0.', f: 'even: only cos + DC\nodd: only sin' },
        { t: 'المربع 0/1', d: 'a₀=1، aₙ=0، bₙ=2/(nπ) للفردي فقط.', f: 'x(t)=1/2+(2/π)[sin t + ⅓sin3t + ⅕sin5t+…]' },
        { t: 'السعة والزاوية', d: 'نجمع sin وcos في موجة واحدة.', f: 'Cₙ=√(aₙ²+bₙ²)\nθₙ=tan⁻¹(bₙ/aₙ)' },
        { t: 'الطيف', d: 'دوري → خطوط عند nf₀. غير دوري → طيف متصل.', f: 'Periodic → lines\nAperiodic → continuous' },
        { t: 'DTFS', d: 'تحليل وسنتيز لإشارة DT دورية طولها N.', f: 'X[k]=Σx[n]e^{−j(2π/N)kn}\nx[n]=(1/N)ΣX[k]e^{j(2π/N)kn}' }
      ]
    },
    {
      id: 'sampling', title: 'Sampling والاسترجاع', icon: '🎚️',
      items: [
        { t: 'ADC', d: 'Sampling (الزمن) + Quantization (السعة). sample & hold يثبت القيمة.' },
        { t: 'Sampling rate', d: 'عدد العينات في الثانية.', f: 'f_s=1/T' },
        { t: 'Nyquist', d: 'لازم fs ≥ 2fmax. Nyquist rate=2fmax، Nyquist interval=1/(2fmax).', f: 'f_s ≥ 2 f_max' },
        { t: 'أمثلة', d: 'Speech 4kHz → 8kHz و0.125ms. Audio 20kHz → 40kHz و25µs.', f: 'Speech: 8 kHz, 0.125 ms\nAudio: 40 kHz, 25 µs' },
        { t: 'الطيف', d: 'النسخ عند ±nfs. Folding frequency = fs/2.', f: 'Replicas at ±n f_s\nFolding = f_s/2' },
        { t: '3 حالات', d: 'fs>2B فراغ، fs=2B لمس (مثالي)، fs<2B تداخل = aliasing.', f: 'fs > 2B  → practical\nfs = 2B  → ideal only\nfs < 2B  → aliasing' },
        { t: 'Anti-alias noise', d: 'فلتر lowpass قبل ADC. n أعلى → noise أقل.', f: 'Aliasing % = 100·√(1+(f_a/f_c)²ⁿ) / √(1+((f_s−f_a)/f_c)²ⁿ)' },
        { t: 'مثال', d: 'fs=8000، fc=3400، n=2: عند fa=fc → 67.8%. عند fa=1000 → 23.05%.' }
      ]
    },
    {
      id: 'exam', title: 'حيل الامتحان', icon: '🎯',
      items: [
        { t: 'اكتبي الخطوات', d: 'المحاضرة بتقول الدرجة على الحل كله مش الناتج. ناتج صح من غير تبرير = صفر محتمل.' },
        { t: 'اتأكدي من الوحدات', d: 'Hz / kHz / ms / µs. 25µs = 0.000025s. حوّلي قبل الحساب.' },
        { t: 'اقري fmax صح', d: 'أعلى تردد موجود في الإشارة. في 5cos(2π·1000t) + 3cos(2π·3000t) → fmax=3000.' },
        { t: 'Even/Odd shortcut', d: 'قبل أي تكامل فورييه: الإشارة even؟ يبقى bₙ=0. odd؟ يبقى aₙ=0.' },
        { t: 'Aliasing مش سحر', d: 'لو fs<2fmax مفيش استرجاع كامل. اكتبي كده في السؤال النظري وارتاحي.' },
        { t: 'نصيحة أخيرة', d: 'خدي نفس. إنتي فاهمة أكتر مما بتتصوري. راجعي الورقة دي، ونامي بدري.' }
      ]
    }
  ],

  reviewIntro: [
    { icon: '🏆', t: 'أهم 3 قواعد', d: 'Nyquist، الطيف، ومعاملات فورييه' },
    { icon: '🎯', t: '12 سؤال مختلط', d: 'من كل المحاضرات مع شرح فوري' },
    { icon: '💗', t: 'من غير ضغط', d: 'الغلط هنا مش بيخصم حاجة' }
  ]
};


