/* ==========================================================================
   HealthyWolf — воронка теста: данные + движок квиза + рендер результата.
   Один файл для RU (/test/…) и EN (/en/test/…). Язык берётся из <html lang>.
   PANAS: 12 пунктов × 2 слоя (сейчас / обычно) = 24 вопроса.
   Тип по слою «обычно» (trait). Порог 18, диапазон суммы 6 пунктов = 6..30.
   ========================================================================== */
(function () {
  "use strict";

  var HW = {
    LS_RESULT: "hw_test_result",
    MIN: 6, MAX: 30, THRESHOLD: 18,

    // Приёмник лида (Google Apps Script web app). Пусто = отправка выключена,
    // почта только пишется в localStorage (как раньше). Вставь сюда /exec-URL
    // после деплоя скрипта из tools/telegram-relay.gs — и лиды полетят в Telegram.
    // Используется только запасной нативной формой (типы без systeme.io URL ниже).
    RELAY_URL: "",

    // Формы-страницы systeme.io по типу состояния (встраиваются как iframe).
    // Почту принимает и хранит сам systeme.io — свой бэкенд не нужен.
    // Пусто у типа = URL ещё не задан → показываем запасную нативную форму,
    // чтобы лиды этого типа не уходили в чужой сегмент. Просто вставь URL.
    FORMS: {
      energy:  "https://janopolrian.systeme.io/a946457c",
      stress:  "https://janopolrian.systeme.io/a946457c-98503d98-45a297b0",
      anxiety: "", // TODO: вставь URL формы systeme.io для типа ANXIETY (тревога)
      apathy:  "", // TODO: вставь URL формы systeme.io для типа APATHY (апатия)
    },

    // 6 позитивных + 6 негативных пунктов PANAS
    positive: ["interested", "energetic", "inspired", "determined", "attentive", "active"],
    negative: ["tense", "anxious", "irritable", "downcast", "restless", "drained"],
    // порядок показа (перемешаны валентности, стабильный)
    order: ["interested", "tense", "energetic", "anxious", "inspired", "irritable",
            "determined", "downcast", "attentive", "restless", "active", "drained"],

    // лестница состояний сверху вниз: S4..S1
    ladder: ["energy", "stress", "anxiety", "apathy"],

    labels: {
      ru: {
        interested: "Заинтересованный", energetic: "Полный энергии", inspired: "Воодушевлённый",
        determined: "Решительный", attentive: "Внимательный", active: "Активный",
        tense: "Напряжённый", anxious: "Встревоженный", irritable: "Раздражённый",
        downcast: "Подавленный", restless: "Беспокойный", drained: "Измотанный",
      },
      en: {
        interested: "Interested", energetic: "Energetic", inspired: "Inspired",
        determined: "Determined", attentive: "Attentive", active: "Active",
        tense: "Tense", anxious: "Anxious", irritable: "Irritable",
        downcast: "Downcast", restless: "Restless", drained: "Drained",
      },
    },

    ui: {
      ru: {
        testPath: "/test/", quizPath: "/test/quiz/", resultPath: "/test/result/",
        frameNow: "Прямо сейчас я чувствую себя…",
        frameUsual: "Обычно за последние 2 недели…",
        layerNow: "Слой 01 · Сейчас", layerUsual: "Слой 02 · Обычно",
        item: "Пункт", of: "из",
        low: "совсем нет", high: "очень сильно",
        back: "← Назад",
        axisX: "СИЛЫ →", axisY: "НАПРЯЖЕНИЕ →",
        axisXhint: "сколько у тебя сил", axisYhint: "сколько внутри напряжения",
        // результат
        stampReport: "ОТЧЁТ", stampObject: "ОБЪЕКТ: ТЫ", stampMethod: "МЕТОД: PANAS",
        yourState: "ТВОЁ СОСТОЯНИЕ",
        fig1: "РИС. 01 — ЛЕСТНИЦА СОСТОЯНИЙ", fig2: "РИС. 02 — НАУЧНАЯ КАРТА · PANAS",
        tab1: "ТАБЛИЦА 01 — БАЛЛЫ",
        you: "ТЫ",
        ladderNote: "Состояние — не приговор. По этой лестнице можно подняться — разбор покажет как.",
        colFuel: "СИЛЫ", colTension: "НАПРЯЖЕНИЕ", colNow: "СЕЙЧАС", colUsual: "ОБЫЧНО",
        tableNote: "ВЫСОКИЙ ≥ 18 · ДИАПАЗОН 6–30",
        headA: "Что на самом деле значит",
        headB: "Главная ловушка",
        headC: "Три конкретных шага",
        headD: "Сейчас и обычно",
        dBody: "Твой тип определяется по слою «обычно» — это устойчивая база за последние две недели. «Сейчас» — срез сегодняшнего дня. Если они расходятся, это нормально: один тяжёлый день не меняет тип. Спад в «сейчас» — сигнал восстановиться, а не диагноз.",
        gateTitle: "Полный разбор + план на 7 дней",
        gateSub: "Что твой тип значит, главная ловушка, три шага и план на неделю — отправлю на почту.",
        gateEmail: "твоя почта", gateBtn: "Открыть полный разбор",
        gateLocked: "ЗАКРЫТО",
        gateOk: "Готово — полный разбор открыт ниже.",
        gateErr: "Проверь адрес — кажется, опечатка.",
        gateFormTitle: "ПОЛНЫЙ РАЗБОР + ПЛАН НА 7 ДНЕЙ — НА ПОЧТУ",
        gateUnlock: "Я оставил почту — открыть разбор",
        gateLegal: 'Нажимая кнопку в форме, ты соглашаешься с <a href="/privacy/">Политикой конфиденциальности</a>',
        share: "ПОДЕЛИТЬСЯ РЕЗУЛЬТАТОМ", shareCopied: "ССЫЛКА СКОПИРОВАНА",
        retake: "ПРОЙТИ ЗАНОВО",
        shareText: "Моё состояние по тесту HealthyWolf — {t}. Проверь своё:",
      },
      en: {
        testPath: "/en/test/", quizPath: "/en/test/quiz/", resultPath: "/en/test/result/",
        frameNow: "Right now I feel…",
        frameUsual: "Usually over the past 2 weeks…",
        layerNow: "Layer 01 · Now", layerUsual: "Layer 02 · Usually",
        item: "Item", of: "of",
        low: "not at all", high: "very much",
        back: "← Back",
        axisX: "FUEL →", axisY: "TENSION →",
        axisXhint: "how much fuel you have", axisYhint: "how much tension is inside",
        stampReport: "REPORT", stampObject: "OBJECT: YOU", stampMethod: "METHOD: PANAS",
        yourState: "YOUR STATE",
        fig1: "FIG. 01 — STATE LADDER", fig2: "FIG. 02 — SCIENCE MAP · PANAS",
        tab1: "TABLE 01 — SCORES",
        you: "YOU",
        ladderNote: "A state isn't a verdict. You can climb this ladder — the breakdown shows how.",
        colFuel: "FUEL", colTension: "TENSION", colNow: "NOW", colUsual: "USUALLY",
        tableNote: "HIGH ≥ 18 · RANGE 6–30",
        headA: "What it really means",
        headB: "The main trap",
        headC: "Three concrete steps",
        headD: "Now and usually",
        dBody: "Your type is set by the 'usually' layer — your stable baseline over the past two weeks. 'Now' is a snapshot of today. If they differ, that's fine: one hard day doesn't change your type. A dip in 'now' is a cue to recover, not a diagnosis.",
        gateTitle: "Full breakdown + 7-day plan",
        gateSub: "What your type means, the main trap, three steps and a week's plan — I'll send it to your email.",
        gateEmail: "your email", gateBtn: "Open the full breakdown",
        gateLocked: "LOCKED",
        gateOk: "Done — the full breakdown is open below.",
        gateErr: "Check the address — looks like a typo.",
        gateFormTitle: "FULL BREAKDOWN + 7-DAY PLAN — TO YOUR INBOX",
        gateUnlock: "I left my email — open my breakdown",
        gateLegal: 'By submitting the form you agree to the <a href="/en/privacy/">Privacy Policy</a>',
        share: "SHARE RESULT", shareCopied: "LINK COPIED",
        retake: "TAKE AGAIN",
        shareText: "My state on the HealthyWolf test — {t}. Check yours:",
      },
    },

    // Порядок в лестнице/квадранте:
    //  energy  = СИЛЫ↑ НАПРЯЖЕНИЕ↓   stress = СИЛЫ↑ НАПРЯЖЕНИЕ↑
    //  anxiety = СИЛЫ↓ НАПРЯЖЕНИЕ↑   apathy = СИЛЫ↓ НАПРЯЖЕНИЕ↓
    types: {
      ru: {
        energy: {
          name: "ЭНЕРГИЯ", form: "силы есть, напряжения нет",
          gist: "Силы есть, напряжения нет. Ты в потоке — действуешь, доводишь до конца.",
          a1: "У тебя много сил и мало напряжения. Ты в потоке: берёшься за дело и доводишь до конца, получаешь удовольствие от сделанного. Это лучшее состояние, чтобы браться за важное — и именно из него легче всего незаметно выгореть, если не замечать усталость.",
          a2: "Что происходит внутри: бак топлива полный и горит чисто — нервная система работает без хронического стресс-фона, ресурсы восстанавливаются быстрее, чем тратятся. Это не черта характера, а уровень заряда. Задача — тратить его на правильное и восполнять заранее, а не считать бесконечным.",
          b: "Ты путаешь энергию с бесконечным ресурсом и берёшь на себя слишком много. Заряд кажется вечным — до первого срыва. Энергию восполняют заранее, а не когда уже упал в ноль.",
          c: [
            "Раз в неделю ставь один полный выходной без задач — по расписанию, а не «когда устану». Отдых на пике заряда стоит дешевле, чем восстановление после провала.",
            "Направь силы в 1–2 главные цели, а не в 10 параллельных. Энергия, размазанная по мелочам, сгорает впустую и не даёт результата, которым можно гордиться.",
            "Следи за сном как за топливом: 7–8 часов даже когда «и так хорошо». На высокой энергии сон урезают первым — и первым же теряют.",
          ],
        },
        stress: {
          name: "СТРЕСС", form: "сил много, но весь на взводе",
          gist: "Сил много, но ты весь на взводе. Делаешь много — а внутри всё сжато.",
          a1: "Сил много, но и напряжения через край. Ты тянешь на оборотах: успеваешь многое, но внутри всё сжато, тело не отпускает. Так можно сделать рывок — но долго на этом не живут, это прямой путь к выгоранию.",
          a2: "Что происходит внутри: организм держит режим повышенной мобилизации — как будто угроза рядом, хотя её нет. Ресурсы вроде есть, но уходят не на дело, а на само напряжение. Внешне это похоже на продуктивность, только продуктивность в кредит: результат реальный, и счёт, который копит тело, тоже.",
          b: "Ты принимаешь взвинченность за продуктивность и почти гордишься тем, что «на пределе». Пока есть результат — кажется, всё под контролем. Но тело копит счёт и предъявляет его сразу за всё — обычно в самый неподходящий момент.",
          c: [
            "Убери из недели одно «надо», которое на самом деле никто не проверит. Проверь, рухнет ли что-то. Обычно — нет, а напряжения становится ощутимо меньше.",
            "Введи жёсткий стоп-час вечером: после него никакой работы и экранов с задачами. Напряжение снимается в паузах, а не «когда доделаю» — доделать можно бесконечно.",
            "10 минут в день без ничего: не телефон, не «полезный отдых», а тишина или медленное дыхание. Это не лень, а осознанный сброс оборотов — телу нужен сигнал, что угрозы нет.",
          ],
        },
        anxiety: {
          name: "ТРЕВОГА", form: "сил нет, всё напряжено",
          gist: "Сил нет, но всё внутри напряжено. Выматывающее сочетание — тревожно, а ресурса нет.",
          a1: "Напряжение высокое, а сил на него не хватает. Это самое выматывающее сочетание: тревожно, но нет ресурса даже на то, чтобы с этим справиться. Читай прямо — это не слабость характера, а сигнал, что тело просит восстановления.",
          a2: "Что происходит внутри: система тревоги включена, а топлива под неё нет. Организм жжёт остатки на фоновое беспокойство — отсюда усталость даже без нагрузки, тяжёлое утро, мысли по кругу. Воля на парах не работает. Сначала ты заправляешься — сон, еда, меньше нагрузки — и только потом остальное становится возможным.",
          b: "Ты пытаешься «взять себя в руки» и продавить состояние силой воли. Но на пустом баке воля не работает — становится только хуже, и сверху добавляется вина, что «не справляешься». Порядок обратный: сначала топливо, потом подвиги.",
          c: [
            "Первым делом — сон и еда по режиму, даже через «не хочу». Тревога почти всегда громче на недосыпе и голоде; это не психология, это биохимия.",
            "Сократи нагрузку осознанно: выбери 1–2 дела на день, остальное отложи без вины. Меньше входящего — меньше топлива для тревоги.",
            "Выгружай тревогу из головы на бумагу: выпиши, что именно грызёт. Названный страх становится управляемым, безымянный — растёт и расплывается на всё сразу.",
          ],
        },
        apathy: {
          name: "АПАТИЯ", form: "сил нет, и ничего не хочется",
          gist: "Сил нет, и ничего особо не хочется. Важно различить: покой это или флатлайн.",
          a1: "И сил немного, и напряжения немного, и ничего особо не цепляет. Это может быть спокойной восстановительной паузой — а может быть приглушённостью, когда ничего не радует и не тянет. Разница огромная, и важно честно понять, что из двух про тебя сейчас.",
          a2: "Что происходит внутри: система вознаграждения работает вполсилы — то, что раньше зажигало, не даёт отклика, поэтому и энергии на действие не находится. Настоящий отдых восстанавливает; флатлайн только затягивается, чем дольше его пережидаешь. И различить может только ты сам — по одному признаку: радует хоть что-то или нет.",
          b: "Ты принимаешь апатию за отдых и ждёшь, что «само пройдёт». Но если неделями ничего не радует — это не покой, а флатлайн, и пассивное ожидание его только растягивает. Тишину лечат маленьким действием, а не ещё большим бездействием.",
          c: [
            "Честно ответь себе: это приятный покой или ничего не радует? Если второе — это точка, из которой выбираются, а не в которой отдыхают.",
            "Добавь одно маленькое действие, которое раньше зажигало — не «переверни жизнь», а один конкретный шаг сегодня. Энергия приходит в движении, а не появляется перед ним.",
            "Верни телесную активность — хотя бы 15 минут ходьбы. При апатии голова сама не заведётся, её проще запустить через тело, а не наоборот.",
          ],
        },
      },
      en: {
        energy: {
          name: "ENERGY", form: "fuel high, tension low",
          gist: "Fuel high, tension low. You're in flow — acting and finishing things.",
          a1: "You've got plenty of fuel and little tension. You're in flow: you take things on and finish them, and you enjoy what you do. It's the best state to tackle what matters — and the easiest one to quietly burn out from if you ignore fatigue.",
          a2: "What's going on inside: the tank is full and burning clean — your nervous system runs without a chronic stress background, and resources recover faster than they're spent. This isn't a personality trait, it's a charge level. The job is to spend it on the right things and refill in advance, not to treat it as infinite.",
          b: "You mistake energy for an endless resource and take on too much. The charge feels permanent — until the first crash. You top energy up in advance, not once you've hit zero.",
          c: [
            "Schedule one full day off with no tasks every week — by the calendar, not 'when I'm tired'. Rest at peak charge is far cheaper than recovery after a crash.",
            "Point your fuel at 1–2 main goals, not 10 parallel ones. Energy smeared across trifles burns for nothing and gives you no result to be proud of.",
            "Guard sleep like fuel: 7–8 hours even when you 'feel fine'. On a high it's the first thing people cut — and the first thing they lose.",
          ],
        },
        stress: {
          name: "STRESS", form: "fuel high, but wired tight",
          gist: "Fuel high, but you're wired tight. Doing a lot — clenched inside.",
          a1: "Lots of fuel, but tension is over the top. You run at high revs: you get a lot done, but everything is clenched inside and your body won't let go. You can pull off a sprint like this — but no one lives here long, it's the direct road to burnout.",
          a2: "What's going on inside: your body holds a state of high alert — as if a threat were near, though it isn't. There's resource, but it goes into the tension itself, not the work. From outside it looks like productivity — only productivity on credit: the output is real, and so is the bill your body is quietly running up.",
          b: "You take being wired for productivity and almost take pride in running 'at your limit'. As long as results come, it feels under control. But the body keeps the tab and collects all at once — usually at the worst possible moment.",
          c: [
            "Cut one 'must-do' from the week that nobody will actually check. See if anything collapses. Usually it doesn't — and there's noticeably less tension.",
            "Set a hard stop-hour in the evening: after it, no work, no task-screens. Tension releases in pauses, not 'once I finish' — you can finish forever.",
            "Ten minutes a day of nothing: not your phone, not 'useful rest', just silence or slow breathing. That's not laziness, it's dropping the revs — the body needs a signal that there's no threat.",
          ],
        },
        anxiety: {
          name: "ANXIETY", form: "fuel low, tension high",
          gist: "Fuel low, but everything's tense inside. A draining mix — anxious with no resource.",
          a1: "Tension is high, and there isn't enough fuel to meet it. It's the most draining mix: anxious, but without the resource to even deal with it. Read this straight — it's not weak character, it's a signal that your body is asking for recovery.",
          a2: "What's going on inside: the alarm system is on, but there's no fuel under it. Your body burns its reserves on background worry — hence fatigue with no load, heavy mornings, thoughts on a loop. Willpower doesn't run on fumes. First you refuel — sleep, food, less load — and only then does the rest become possible.",
          b: "You try to 'pull yourself together' and force the state by willpower. But on an empty tank willpower fails — it only gets worse, plus the guilt of 'not coping'. The order is reversed: fuel first, heroics later.",
          c: [
            "First: sleep and food on a schedule, even through 'I don't want to'. Anxiety is almost always louder on no sleep and an empty stomach — that's not psychology, it's biochemistry.",
            "Cut your load on purpose: pick 1–2 things for the day, postpone the rest without guilt. Less incoming = less fuel for anxiety.",
            "Get the anxiety out of your head onto paper: write down exactly what gnaws. A named fear becomes manageable; an unnamed one grows and smears itself over everything at once.",
          ],
        },
        apathy: {
          name: "APATHY", form: "fuel low, nothing feels worth it",
          gist: "Fuel low, nothing feels worth it. The key is telling rest from a flatline.",
          a1: "Fuel is low, tension is low, and nothing really lands. This can be a calm, restorative lull — or a flatness where nothing brings joy or pulls at you. The difference is huge, and it matters to be honest about which one you're in right now.",
          a2: "What's going on inside: the reward system is running at half power — what used to light you up gives no response, so there's no energy for action either. Real rest recharges; a flatline just drags on the longer you wait it out. Only you can tell which, by one sign: does anything bring joy, or not.",
          b: "You take apathy for rest and expect it to 'pass on its own'. But if nothing has landed for weeks, that's not peace — it's a flatline, and passive waiting only stretches it out. You treat stillness with a small action, not more stillness.",
          c: [
            "Answer honestly: is this pleasant calm, or does nothing bring joy? If it's the second, it's a place to climb out of, not to rest in.",
            "Add one small action that used to light you up — not 'change your life', one concrete step today. Energy comes in motion, it doesn't show up before it.",
            "Bring back physical movement — at least 15 minutes of walking. In apathy your head won't start on its own; it's easier to boot it through the body, not the other way round.",
          ],
        },
      },
    },

    /* ---------- утилиты ---------- */
    lang: function () { return document.documentElement.lang === "en" ? "en" : "ru"; },
    quadrant: function (pa, na) {
      var hiPA = pa >= this.THRESHOLD, hiNA = na >= this.THRESHOLD;
      if (hiPA && !hiNA) return "energy";
      if (hiPA && hiNA) return "stress";
      if (!hiPA && hiNA) return "anxiety";
      return "apathy";
    },
    pct: function (v) { return Math.max(0, Math.min(100, Math.round(((v - this.MIN) / (this.MAX - this.MIN)) * 100))); },
    isEmail: function (s) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((s || "").trim()); },
    esc: function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); },

    save: function (o) { try { localStorage.setItem(this.LS_RESULT, JSON.stringify(o)); } catch (e) {} },
    load: function () { try { return JSON.parse(localStorage.getItem(this.LS_RESULT) || "null"); } catch (e) { return null; } },

    // Отправка лида на посредник (Apps Script → Telegram). Фоново, тихо.
    // sendBeacon шлёт как text/plain — «простой» запрос, без CORS-preflight;
    // доходит, даже если пользователь сразу уходит со страницы.
    sendLead: function (lead) {
      if (!this.RELAY_URL) return; // не настроено — молча выходим
      var body = JSON.stringify(lead);
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon(this.RELAY_URL, new Blob([body], { type: "text/plain;charset=UTF-8" }));
          return;
        }
      } catch (e) {}
      // Фолбэк для старых браузеров без sendBeacon.
      try {
        fetch(this.RELAY_URL, { method: "POST", mode: "no-cors", keepalive: true,
          headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: body });
      } catch (e2) {}
    },
  };

  window.HW = HW;

  /* ======================================================================
     ДВИЖОК КВИЗА  (страница /test/quiz/)
     ====================================================================== */
  HW.initQuiz = function () {
    var lang = HW.lang(), t = HW.ui[lang], lbl = HW.labels[lang];
    var root = document.getElementById("quiz");
    if (!root) return;

    // 24 шага: слой now (12) + слой usual (12)
    var steps = [];
    ["now", "usual"].forEach(function (layer) {
      HW.order.forEach(function (key) { steps.push({ key: key, layer: layer }); });
    });
    var answers = new Array(steps.length).fill(0);
    var i = 0;

    var elBar = root.querySelector(".quiz__bar > i");
    var elCount = root.querySelector(".quiz__count");
    var elLayer = root.querySelector(".quiz__layer");
    var elFrame = root.querySelector(".quiz__frame");
    var elWord = root.querySelector(".quiz__word");
    var elScale = root.querySelector(".scale");
    var elBack = root.querySelector(".quiz__back");
    var elEnds = root.querySelector(".scale__ends");

    elEnds.innerHTML = "<span>1 · " + t.low + "</span><span>" + t.high + " · 5</span>";
    elBack.textContent = t.back;

    // кнопки шкалы 1..5
    elScale.innerHTML = "";
    for (var n = 1; n <= 5; n++) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = n; b.dataset.v = n;
      b.setAttribute("aria-label", n + " / 5");
      elScale.appendChild(b);
    }

    function render() {
      var s = steps[i];
      elBar.style.width = ((i) / steps.length * 100) + "%";
      elCount.innerHTML = t.item + " <b>" + String(i + 1).padStart(2, "0") + "</b> / " + steps.length;
      elLayer.textContent = s.layer === "now" ? t.layerNow : t.layerUsual;
      elFrame.textContent = s.layer === "now" ? t.frameNow : t.frameUsual;
      elWord.textContent = lbl[s.key];
      Array.prototype.forEach.call(elScale.children, function (btn) {
        btn.classList.toggle("sel", Number(btn.dataset.v) === answers[i]);
      });
      elBack.style.visibility = i === 0 ? "hidden" : "visible";
    }

    elScale.addEventListener("click", function (e) {
      var btn = e.target.closest("button"); if (!btn) return;
      answers[i] = Number(btn.dataset.v);
      render();
      setTimeout(next, 180);
    });
    elBack.addEventListener("click", function () { if (i > 0) { i--; render(); } });

    function next() {
      if (i < steps.length - 1) { i++; render(); }
      else finish();
    }

    function finish() {
      elBar.style.width = "100%";
      var sum = { now: { pa: 0, na: 0 }, usual: { pa: 0, na: 0 } };
      steps.forEach(function (s, idx) {
        var val = answers[idx] || 1; // защита: неотвеченное = 1
        var pos = HW.positive.indexOf(s.key) >= 0;
        sum[s.layer][pos ? "pa" : "na"] += val;
      });
      var type = HW.quadrant(sum.usual.pa, sum.usual.na);
      HW.save({
        type: type,
        paNow: sum.now.pa, naNow: sum.now.na,
        paUsual: sum.usual.pa, naUsual: sum.usual.na,
        ts: new Date().toISOString(),
      });
      location.href = t.resultPath;
    }

    render();
  };

  /* ======================================================================
     РЕНДЕР РЕЗУЛЬТАТА  (страница /test/result/)
     ====================================================================== */
  HW.initResult = function () {
    var lang = HW.lang(), t = HW.ui[lang], T = HW.types[lang];
    var r = HW.load();
    if (!r || !T[r.type]) { location.href = t.testPath; return; }
    var type = r.type, info = T[type];

    function $(id) { return document.getElementById(id); }
    function set(id, html) { var e = $(id); if (e) e.innerHTML = html; }

    // дата отчёта из ts
    var d = r.ts ? new Date(r.ts) : new Date();
    var dateStr = String(d.getDate()).padStart(2, "0") + "." +
      String(d.getMonth() + 1).padStart(2, "0") + "." + d.getFullYear();

    // штампы
    set("r-stamps",
      '<span class="stamp"><span class="dot">■</span> ' + t.stampReport + " · " + dateStr + " · " + t.stampObject + '</span>' +
      '<span class="stamp">' + t.stampMethod + "</span>");

    set("r-eyebrow", t.yourState);
    set("r-type", info.name);
    set("r-form", info.form);
    set("r-gist", info.gist);

    /* ---- РИС.01 лестница ---- */
    set("r-fig1", t.fig1);
    var ladder = "";
    HW.ladder.forEach(function (k, idx) {
      var s = T[k], on = k === type;
      var sIdx = "S" + (4 - idx);
      ladder += '<div class="ladder__step' + (on ? " on" : "") + '">' +
        '<span class="s-i">' + sIdx + "</span>" +
        '<span><span class="s-name">' + s.name + '</span><br><span class="s-form">' + s.form + "</span></span>" +
        (on ? '<span class="ladder__you"><span class="d"></span>' + t.you + "</span>" : "<span></span>") +
        "</div>";
    });
    set("r-ladder", ladder);
    set("r-laddernote", t.ladderNote);

    /* ---- РИС.02 квадрант ---- */
    set("r-fig2", t.fig2);
    var qx = HW.pct(r.paUsual), qy = HW.pct(r.naUsual);
    var qEl = $("r-quadpt");
    if (qEl) { qEl.style.left = qx + "%"; qEl.style.bottom = qy + "%"; }
    set("r-axisx", t.axisX); set("r-axisy", t.axisY);

    /* ---- ТАБЛИЦА 01 баллы ---- */
    set("r-tab1", t.tab1);
    function hi(v) { return v >= HW.THRESHOLD ? ' class="hi"' : ""; }
    set("r-scoretable",
      "<thead><tr><th></th><th>" + t.colNow + "</th><th>" + t.colUsual + "</th></tr></thead><tbody>" +
      "<tr><th>" + t.colFuel + "</th><td" + hi(r.paNow) + ">" + r.paNow + " / 30</td><td" + hi(r.paUsual) + ">" + r.paUsual + " / 30</td></tr>" +
      "<tr><th>" + t.colTension + "</th><td" + hi(r.naNow) + ">" + r.naNow + " / 30</td><td" + hi(r.naUsual) + ">" + r.naUsual + " / 30</td></tr>" +
      "</tbody>");
    set("r-tablenote", t.tableNote);

    /* ---- РАЗБОР A–D (за гейтом) ---- */
    set("r-headA", t.headA + " «" + info.name + "»");
    set("r-a1", HW.esc(info.a1));
    set("r-a2", HW.esc(info.a2));
    set("r-headB", t.headB);
    set("r-b", HW.esc(info.b));
    set("r-headC", t.headC);
    var steps = "";
    info.c.forEach(function (s, idx) {
      steps += '<div class="step"><span class="n">' + String(idx + 1).padStart(2, "0") + '</span><p>' + HW.esc(s) + "</p></div>";
    });
    set("r-steps", steps);
    set("r-headD", t.headD);
    set("r-dbody", t.dBody);
    // плашки D
    set("r-compare",
      '<div class="cell"><div class="k">' + t.colNow + '</div><div class="v">' + r.paNow + " / " + r.naNow + '</div><div class="k" style="margin-top:6px">' + t.colFuel + " / " + t.colTension + '</div></div>' +
      '<div class="cell"><div class="k">' + t.colUsual + '</div><div class="v">' + r.paUsual + " / " + r.naUsual + '</div><div class="k" style="margin-top:6px">' + t.colFuel + " / " + t.colTension + '</div></div>');

    /* ---- EMAIL-ГЕЙТ ---- */
    set("r-gatelocked", "[ " + t.gateLocked + " ]");
    var gate = $("r-gate");
    var doneEl = $("r-gatedone");
    if (doneEl) doneEl.textContent = t.gateOk;

    // Раскрытие разбора: снимает блюр, прячет карточку/замок, показывает doneEl.
    function unlockGate() { gate.classList.add("open"); }

    var formUrl = HW.FORMS[type];

    if (formUrl) {
      /* ===== ВАРИАНТ А — форма systeme.io во фрейме =====
         Почту принимает systeme.io. Submit кросс-доменного iframe напрямую
         не поймать, поэтому раскрываем разбор по ручной кнопке (см. ниже). */
      var titleEl = $("r-gatetitle");
      var subEl = $("r-gatesub");
      var nativeForm = $("r-gateform");
      var okBox = $("r-gateok");
      var card = nativeForm ? nativeForm.parentNode : (titleEl ? titleEl.parentNode : null);

      if (titleEl) { titleEl.textContent = t.gateFormTitle; titleEl.className = "gate__embed-title mono"; }
      if (subEl) subEl.style.display = "none";       // контекст даёт сам заголовок формы
      if (nativeForm) nativeForm.style.display = "none";
      if (okBox) okBox.style.display = "none";

      var embed = document.createElement("div");
      embed.className = "gate__embed";

      var iframe = document.createElement("iframe");
      iframe.className = "gate__embed-frame";
      iframe.src = formUrl;
      iframe.title = t.gateFormTitle;
      iframe.setAttribute("scrolling", "no");
      iframe.setAttribute("loading", "lazy");

      var legal = document.createElement("p");
      legal.className = "gate__embed-legal mono";
      legal.innerHTML = t.gateLegal;

      var unlockBtn = document.createElement("button");
      unlockBtn.type = "button";
      unlockBtn.className = "btn btn--sm btn--block gate__embed-unlock";
      unlockBtn.textContent = t.gateUnlock;
      unlockBtn.hidden = true;

      embed.appendChild(iframe);
      embed.appendChild(legal);
      embed.appendChild(unlockBtn);
      if (card) card.appendChild(embed);

      var revealed = false;
      unlockBtn.addEventListener("click", function () {
        if (revealed) return; revealed = true;
        unlockGate();
      });
      function showUnlock() { if (!revealed) unlockBtn.hidden = false; }

      // Fallback: показать кнопку через 25с после загрузки — даже если
      // взаимодействие с формой не задетектилось.
      setTimeout(showUnlock, 25000);

      // Детект взаимодействия: клик в кросс-доменный iframe уводит фокус окна,
      // и document.activeElement становится этим iframe. Тогда через ~5с — кнопка.
      var interacted = false;
      window.addEventListener("blur", function () {
        setTimeout(function () {
          if (interacted) return;
          if (document.activeElement === iframe) {
            interacted = true;
            setTimeout(showUnlock, 5000);
          }
        }, 0);
      });

    } else {
      /* ===== ВАРИАНТ Б (запасной) — нативная форма =====
         Пока у типа нет URL systeme.io. Ведёт себя как раньше: локальная
         запись лида + опциональный пинг в Telegram (если задан RELAY_URL). */
      set("r-gatetitle", t.gateTitle);
      set("r-gatesub", t.gateSub);
      var form = $("r-gateform");
      var emailInput = $("r-email");
      var okMsg = $("r-gateok");
      if (emailInput) emailInput.placeholder = t.gateEmail;
      var gateBtn = $("r-gatebtn");
      if (gateBtn) gateBtn.textContent = t.gateBtn;

      if (form) {
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var val = emailInput.value;
          if (!HW.isEmail(val)) {
            okMsg.textContent = t.gateErr; okMsg.classList.add("gate__err");
            emailInput.focus(); return;
          }
          var lead = {
            email: val.trim(), type: type,
            lang: document.documentElement.lang === "en" ? "en" : "ru",
            ts: new Date().toISOString(),
          };
          try {
            var leads = JSON.parse(localStorage.getItem("hw_leads") || "[]");
            leads.push(lead);
            localStorage.setItem("hw_leads", JSON.stringify(leads));
          } catch (e2) {}
          HW.sendLead(lead);
          okMsg.textContent = "";
          unlockGate();
        });
      }
    }

    /* ---- КНОПКИ ---- */
    var shareBtn = $("r-share"), retakeBtn = $("r-retake");
    if (shareBtn) {
      shareBtn.textContent = t.share;
      shareBtn.addEventListener("click", function () {
        var url = location.origin + t.testPath;
        var text = t.shareText.replace("{t}", info.name);
        if (navigator.share) {
          navigator.share({ title: "HealthyWolf", text: text, url: url }).catch(function () {});
        } else {
          var full = text + " " + url;
          if (navigator.clipboard) navigator.clipboard.writeText(full).catch(function () {});
          var prev = shareBtn.textContent;
          shareBtn.textContent = t.shareCopied;
          setTimeout(function () { shareBtn.textContent = prev; }, 1800);
        }
      });
    }
    if (retakeBtn) {
      retakeBtn.textContent = t.retake;
      retakeBtn.addEventListener("click", function () { location.href = t.quizPath; });
    }
  };

  /* ======================================================================
     АВТО-ИНИТ по data-page + общие мелочи
     ====================================================================== */
  function boot() {
    // запоминаем язык текущей страницы (для языкового редиректа на корне)
    try { localStorage.setItem("hw_lang", document.documentElement.lang === "en" ? "en" : "ru"); } catch (e) {}

    // fade-up при скролле
    var io;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
      }, { threshold: 0.12 });
      document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
    } else {
      document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    }

    // бургер-меню
    var burger = document.querySelector(".burger"), links = document.querySelector(".nav__links");
    if (burger && links) {
      burger.addEventListener("click", function () {
        links.classList.toggle("open");
        burger.setAttribute("aria-expanded", links.classList.contains("open"));
      });
      links.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { links.classList.remove("open"); });
      });
    }

    var page = document.body.getAttribute("data-page");
    if (page === "quiz" && HW.initQuiz) HW.initQuiz();
    if (page === "result" && HW.initResult) HW.initResult();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
