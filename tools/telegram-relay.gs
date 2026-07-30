/**
 * HealthyWolf — посредник «сайт → Telegram».
 * Принимает POST с лидом от воронки теста и шлёт уведомление в Telegram.
 * Токен бота живёт ЗДЕСЬ (на стороне Google), в код сайта не попадает.
 *
 * === КАК РАЗВЕРНУТЬ (5 минут) ===
 *  1. Создай бота: в Telegram напиши @BotFather → /newbot → получишь ТОКЕН.
 *  2. Узнай свой chat_id: напиши что-нибудь своему боту, потом открой
 *     https://api.telegram.org/bot<ТОКЕН>/getUpdates — в ответе найди
 *     "chat":{"id": ЧИСЛО } — это и есть CHAT_ID. (Или напиши @userinfobot.)
 *  3. Зайди на https://script.google.com → New project → вставь этот файл.
 *  4. Впиши BOT_TOKEN и CHAT_ID ниже.
 *  5. Deploy → New deployment → тип "Web app":
 *        Execute as: Me
 *        Who has access: Anyone
 *     Скопируй выданный URL вида https://script.google.com/macros/s/AKfy.../exec
 *  6. Вставь этот /exec-URL в assets/hw.js → RELAY_URL.
 *  Готово. Теперь при вводе почты тебе в Telegram прилетает уведомление.
 */

var BOT_TOKEN = "ВСТАВЬ_ТОКЕН_БОТА";   // от @BotFather
var CHAT_ID   = "ВСТАВЬ_CHAT_ID";       // куда слать (твой личный чат или группа)

function doPost(e) {
  try {
    var lead = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    var email = String(lead.email || "").slice(0, 200);
    var type  = String(lead.type  || "?");
    var lang  = String(lead.lang  || "?");

    if (!email || email.indexOf("@") < 0) return _ok(); // мусор — тихо игнорим

    var text =
      "🐺 Новый лид HealthyWolf\n" +
      "📧 " + email + "\n" +
      "🧭 Тип: " + type + "\n" +
      "🌐 Язык: " + lang;

    _sendTelegram(text);
  } catch (err) {
    // не роняем — сайту всё равно вернём ok
  }
  return _ok();
}

// GET — чтобы можно было открыть URL в браузере и проверить, что живой.
function doGet() {
  return ContentService.createTextOutput("HealthyWolf relay is alive");
}

function _sendTelegram(text) {
  var url = "https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage";
  UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    muteHttpExceptions: true,
    payload: JSON.stringify({ chat_id: CHAT_ID, text: text, disable_web_page_preview: true }),
  });
}

function _ok() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Ручная проверка из редактора: Run → testPing (должно прийти сообщение в Telegram).
function testPing() {
  _sendTelegram("✅ HealthyWolf relay: тестовое сообщение. Всё работает.");
}
