/* ==========================================================================
   HealthyWolf — данные и контент воронки теста (RU/EN).
   Один источник для всех трёх страниц (лендинг / тест / результат).
   Тон бренда: прямой, без эзотерики и мотивационной воды, на «ты».
   ========================================================================== */
window.HW = {
  LANGS: ["ru", "en"],
  LS_LANG: "hw_lang",
  LS_RESULT: "hw_test_result",
  LS_LEADS: "hw_leads",

  // Шкала PANAS: 6 позитивных + 6 негативных пунктов. Порог квадранта = медиана.
  items: {
    positive: ["p_interested", "p_energetic", "p_inspired", "p_determined", "p_attentive", "p_active"],
    negative: ["n_tense", "n_anxious", "n_irritable", "n_downcast", "n_restless", "n_drained"],
  },
  MIN: 6, MAX: 30, THRESHOLD: 18, // диапазон суммы 6 пунктов = 6..30, медиана = 18

  // Порядок типов по углам квадранта: X = позитивная энергия →, Y = напряжение ↑
  // tl(низкий PA,высокий NA)=anxiety · tr(высокий PA,высокий NA)=overheat
  // bl(низкий PA,низкий NA)=calm     · br(высокий PA,низкий NA)=drive
  corners: { tl: "anxiety", tr: "overheat", bl: "calm", br: "drive" },

  labels: {
    ru: {
      p_interested: "Заинтересованный", p_energetic: "Полный энергии", p_inspired: "Воодушевлённый",
      p_determined: "Решительный", p_attentive: "Внимательный", p_active: "Активный",
      n_tense: "Напряжённый", n_anxious: "Встревоженный", n_irritable: "Раздражённый",
      n_downcast: "Подавленный", n_restless: "Беспокойный", n_drained: "Измотанный",
    },
    en: {
      p_interested: "Interested", p_energetic: "Energetic", p_inspired: "Inspired",
      p_determined: "Determined", p_attentive: "Attentive", p_active: "Active",
      n_tense: "Tense", n_anxious: "Anxious", n_irritable: "Irritable",
      n_downcast: "Downcast", n_restless: "Restless", n_drained: "Drained",
    },
  },

  ui: {
    ru: {
      brand: "Healthy<b>Wolf</b>",
      // лендинг
      eyebrow: "Тест состояния · 1 минута",
      h1: "В каком из 4 состояний ты живёшь? <em>90% людей не могут ответить.</em>",
      sub: "Тест на 1 минуту. 12 вопросов. <b>Бесплатно, без регистрации.</b>",
      startBtn: "Начать тест",
      startNote: "Результат сразу после теста",
      typesLbl: "Четыре состояния",
      axisX: "позитивная энергия →",
      axisY: "напряжение →",
      // тест
      layerNow: "Прямо сейчас",
      layerGeneral: "Обычно · 2 недели",
      frameNow: "Насколько это про тебя ПРЯМО СЕЙЧАС?",
      frameGeneral: "Насколько это про тебя ОБЫЧНО за последние 2 недели?",
      hint: "1 — совсем нет · 5 — очень сильно",
      low: "Совсем нет", high: "Очень сильно",
      back: "← Назад",
      countTpl: "{i} / {n}",
      // результат
      resEyebrow: "Твой тип",
      scorePA: "Позитивная энергия", scoreNA: "Напряжение",
      legendNow: "сейчас", legendUsual: "обычно",
      gateTitle: "Полный разбор",
      gateSub: "Что твой тип значит, главная ловушка, 3 шага и план на неделю — пришлю на почту.",
      emailPh: "твоя почта",
      emailBtn: "Прислать разбор",
      emailOk: "Готово. Проверь почту — полный разбор открыт ниже.",
      emailErr: "Проверь адрес — кажется, опечатка.",
      headMeaning: "Что это значит",
      headTrap: "Главная ловушка",
      headSteps: "3 шага",
      headCompare: "Сейчас vs обычно",
      compareSame: "И прямо сейчас, и обычно ты в состоянии «{t}». Это устойчивая картина — то, что видишь, отражает реальность, а не настроение одного дня.",
      compareDiff: "Прямо сейчас ты ближе к «{s}», а обычно живёшь в «{t}». Разрыв между «сейчас» и «обычно» — самое полезное здесь: он показывает, где ты просел или поймал ресурс. Ориентируйся на «обычно» — это твоя база.",
      shareBtn: "Поделиться результатом",
      shareCopied: "Ссылка скопирована",
      retake: "Пройти заново",
      toHome: "На главную",
      footerBrand: "<b>HealthyWolf</b> · базовая настройка человека",
      disclaimer: "Тест в познавательных целях, не медицинская диагностика.",
    },
    en: {
      brand: "Healthy<b>Wolf</b>",
      eyebrow: "State test · 1 minute",
      h1: "Which of the 4 states do you live in? <em>90% of people can't answer.</em>",
      sub: "A 1-minute test. 12 questions. <b>Free, no sign-up.</b>",
      startBtn: "Start the test",
      startNote: "Result right after the test",
      typesLbl: "Four states",
      axisX: "positive energy →",
      axisY: "tension →",
      layerNow: "Right now",
      layerGeneral: "Usually · 2 weeks",
      frameNow: "How much is this you RIGHT NOW?",
      frameGeneral: "How much is this you USUALLY over the past 2 weeks?",
      hint: "1 — not at all · 5 — very much",
      low: "Not at all", high: "Very much",
      back: "← Back",
      countTpl: "{i} / {n}",
      resEyebrow: "Your type",
      scorePA: "Positive energy", scoreNA: "Tension",
      legendNow: "now", legendUsual: "usually",
      gateTitle: "Full breakdown",
      gateSub: "What your type means, the main trap, 3 steps and a week's plan — I'll send it to your email.",
      emailPh: "your email",
      emailBtn: "Send my breakdown",
      emailOk: "Done. Check your email — the full breakdown is open below.",
      emailErr: "Check the address — looks like a typo.",
      headMeaning: "What it means",
      headTrap: "The main trap",
      headSteps: "3 steps",
      headCompare: "Now vs usually",
      compareSame: "Both right now and usually you're in «{t}». That's a stable picture — what you see reflects reality, not one day's mood.",
      compareDiff: "Right now you're closer to «{s}», while usually you live in «{t}». The gap between 'now' and 'usually' is the useful part: it shows where you've dipped or caught a resource. Go by 'usually' — that's your baseline.",
      shareBtn: "Share result",
      shareCopied: "Link copied",
      retake: "Take again",
      toHome: "Home",
      footerBrand: "<b>HealthyWolf</b> · a human's baseline setup",
      disclaimer: "This test is for informational purposes, not a medical diagnosis.",
    },
  },

  types: {
    ru: {
      drive: {
        name: "Драйв", tag: "много энергии, мало напряжения",
        short: "У тебя много энергии и мало напряжения. Ты в потоке: действуешь, доводишь до конца, получаешь удовольствие от сделанного. Это лучшее состояние, чтобы браться за важное — но именно из него легче всего выгореть, если не замечать усталость.",
        meaning: "Драйв — не черта характера, а уровень топлива. Сейчас бак полный и горит чисто. Задача — тратить его на правильное и восполнять заранее, а не считать бесконечным.",
        trap: "Ты путаешь драйв с бесконечным ресурсом и берёшь на себя слишком много. Энергия кажется вечной — до первого срыва. Драйв не бесконечен: его восполняют заранее, а не когда уже упал.",
        steps: [
          "Раз в неделю планируй один полный выходной без задач — по расписанию, а не «когда устану».",
          "Направь энергию в 1–2 главные цели, а не в 10 параллельных. Драйв, размазанный по мелочам, сгорает впустую.",
          "Следи за сном как за топливом: 7–8 часов даже когда «и так хорошо». На драйве его первым и урезают.",
        ],
      },
      overheat: {
        name: "Перегрев", tag: "энергия и напряжение — оба высокие",
        short: "Энергии много, но и напряжения через край. Ты тянешь на оборотах: делаешь много, но внутри всё сжато. Так можно сделать рывок, но долго на этом не живут — это прямой путь к выгоранию.",
        meaning: "Перегрев похож на продуктивность, но это продуктивность в кредит. Результат реальный — и счёт, который копит тело, тоже. Смысл не в том, чтобы делать меньше, а в том, чтобы перестать платить полную цену за каждый результат.",
        trap: "Ты принимаешь перегрев за продуктивность и гордишься тем, что «на пределе». Пока есть результат — кажется, что всё под контролем. Но тело копит счёт и предъявляет его сразу за всё.",
        steps: [
          "Убери из недели одно «надо», которое на самом деле никто не проверит. Проверь, рухнет ли что-то. Обычно — нет.",
          "Введи жёсткий стоп-час вечером: после него никакой работы и экранов с задачами. Напряжение снимается в паузах, а не «когда доделаю».",
          "10 минут в день без ничего: не телефон, не отдых «с пользой», а тишина. Это не лень — это сброс оборотов.",
        ],
      },
      anxiety: {
        name: "Тревога", tag: "напряжение высокое, энергии мало",
        short: "Напряжение высокое, а сил на него не хватает. Это выматывающее сочетание: тревожно, но нет ресурса даже на то, чтобы с этим справиться. Важно понять — это не слабость характера, а сигнал, что тело просит восстановления.",
        meaning: "Тревога на пустом баке — это проблема топлива, а не настроя. Воля не работает на парах. Прежде чем «менять отношение», ты заправляешься: сон, еда, меньше нагрузки. Тогда остальное становится возможным.",
        trap: "Ты пытаешься «взять себя в руки» и продавить состояние силой воли. Но на пустом баке воля не работает — становится только хуже, и добавляется вина, что «не справляешься». Сначала топливо, потом подвиги.",
        steps: [
          "Первым делом — сон и еда по режиму, даже через «не хочу». Тревога почти всегда сильнее на недосыпе и голоде.",
          "Сократи нагрузку осознанно: выбери 1–2 дела на день, остальное отложи без вины. Меньше входящего — меньше топлива для тревоги.",
          "Выгружай тревогу из головы на бумагу: выпиши, что именно грызёт. Названный страх управляем, безымянный — растёт.",
        ],
      },
      calm: {
        name: "Затишье", tag: "энергии и напряжения — мало",
        short: "И энергии, и напряжения немного. Это может быть спокойным, восстановительным затишьем — а может быть приглушённостью, когда ничего особо не радует и не цепляет. Разница огромная, и важно честно понять, какое из двух про тебя сейчас.",
        meaning: "Затишье — это либо отдых, либо флатлайн, и различить может только ты сам. Настоящий отдых восстанавливает; флатлайн только затягивается, чем дольше ты его пережидаешь. Тишину лечат маленьким действием, а не ещё большим бездействием.",
        trap: "Ты принимаешь апатию за отдых и ждёшь, что «само пройдёт». Но если ничего не радует неделями — это не покой, а флатлайн, и пассивное ожидание его только затягивает. Тишину лечат маленьким действием, а не бездействием.",
        steps: [
          "Честно ответь: это приятный покой или ничего не радует? Если второе — это точка, с которой нужно выбираться, а не отдыхать.",
          "Добавь одно маленькое действие, которое раньше зажигало: не «переверни жизнь», а один конкретный шаг сегодня. Энергия приходит в движении, а не перед ним.",
          "Верни телесную активность — 15 минут ходьбы. При затишье голова сама не заведётся, её проще запустить через тело.",
        ],
      },
    },
    en: {
      drive: {
        name: "Drive", tag: "high energy, low tension",
        short: "You've got plenty of energy and little tension. You're in flow — acting, finishing things, enjoying what you do. It's the best state to take on what matters, but also the easiest one to burn out from if you ignore fatigue.",
        meaning: "Drive isn't a personality trait — it's a fuel level. Right now the tank is full and burning clean. The job is to spend it on the right things and refill on purpose, not to treat it as infinite.",
        trap: "You mistake drive for an endless resource and take on too much. The energy feels permanent — until the first crash. Drive runs out; you top it up in advance, not after you've hit empty.",
        steps: [
          "Schedule one full day off with no tasks every week — by the calendar, not 'when I'm tired'.",
          "Point the energy at 1–2 main goals, not 10 parallel ones. Drive smeared across trifles burns for nothing.",
          "Guard sleep like fuel: 7–8 hours even when you 'feel fine'. On drive it's the first thing people cut.",
        ],
      },
      overheat: {
        name: "Overheat", tag: "energy and tension both high",
        short: "Lots of energy, but tension is over the top. You're running at high revs — doing a lot, but clenched inside. You can pull off a sprint like this, but no one lives here long: it's the direct road to burnout.",
        meaning: "Overheat looks like productivity, but it's productivity on credit. The output is real; so is the bill your body is quietly running up. The point isn't to do less — it's to stop paying full price for every result.",
        trap: "You take overheat for productivity and take pride in being 'at your limit'. As long as results come, it feels under control. But the body keeps the tab, and it collects all at once.",
        steps: [
          "Cut one 'must-do' from the week that nobody will actually check. See if anything collapses. Usually it doesn't.",
          "Set a hard stop-hour in the evening: after it, no work, no task-screens. Tension releases in pauses, not 'once I finish'.",
          "Ten minutes a day of nothing — not your phone, not 'useful rest', just silence. That's not laziness, it's dropping the revs.",
        ],
      },
      anxiety: {
        name: "Anxiety", tag: "high tension, low energy",
        short: "Tension is high, and there isn't enough energy to meet it. It's a draining mix — anxious, but without the resource to even deal with it. Read this clearly: it's not weak character, it's a signal that your body is asking for recovery.",
        meaning: "Anxiety on an empty tank is a fuel problem, not an attitude problem. Willpower doesn't run on fumes. Before you 'change your mindset', you refuel: sleep, food, less load. Then the rest becomes possible.",
        trap: "You try to 'pull yourself together' and force the state by willpower. But on an empty tank willpower fails — it only gets worse, plus the guilt of 'not coping'. Fuel first, heroics later.",
        steps: [
          "First: sleep and food on a schedule, even through 'I don't want to'. Anxiety is almost always louder on no sleep and an empty stomach.",
          "Cut your load on purpose: pick 1–2 things for the day, postpone the rest without guilt. Less incoming = less fuel for anxiety.",
          "Get the anxiety out of your head onto paper: write down what exactly gnaws. A named fear is manageable; an unnamed one grows.",
        ],
      },
      calm: {
        name: "Lull", tag: "low energy, low tension",
        short: "Both energy and tension are low. This can be a calm, restorative lull — or a flatness where nothing really lands or excites you. The difference is huge, and it matters to be honest about which one you're in right now.",
        meaning: "A lull is either rest or a flatline, and only you can tell which. Real rest recharges; a flatline just drags on the longer you wait it out. Stillness is broken by a small action, not by more waiting.",
        trap: "You take apathy for rest and expect it to 'pass on its own'. But if nothing has landed for weeks, that's not peace — it's a flatline, and passive waiting only stretches it out. You treat a lull with a small move, not more stillness.",
        steps: [
          "Answer honestly: is this pleasant calm, or does nothing bring joy? If it's the second, it's a place to climb out of, not to rest in.",
          "Add one small action that used to light you up — not 'change your life', one concrete step today. Energy comes in motion, not before it.",
          "Bring back physical movement — 15 minutes of walking. In a lull your head won't start on its own; it's easier to boot it through the body.",
        ],
      },
    },
  },

  /* -------- утилиты (используются на всех страницах) -------- */
  getLang: function () {
    try { var s = localStorage.getItem(this.LS_LANG); if (this.LANGS.indexOf(s) >= 0) return s; } catch (e) {}
    var nav = (navigator.language || "").slice(0, 2).toLowerCase();
    return nav === "en" ? "en" : "ru"; // ru по умолчанию (ro на воронке не участвует)
  },
  setLang: function (l) { try { localStorage.setItem(this.LS_LANG, l); } catch (e) {} },

  // тип по паре сумм (PA, NA). Порог = медиана.
  quadrant: function (pa, na) {
    var hiPA = pa >= this.THRESHOLD, hiNA = na >= this.THRESHOLD;
    if (hiPA && !hiNA) return "drive";
    if (hiPA && hiNA) return "overheat";
    if (!hiPA && hiNA) return "anxiety";
    return "calm";
  },
  // проценты 0..100 для позиции точки на квадранте
  pct: function (v) { return Math.round(((v - this.MIN) / (this.MAX - this.MIN)) * 100); },
};
