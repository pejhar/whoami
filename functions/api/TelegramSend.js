export async function onRequestPost(context) {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = context.env;

  try {
    const body = await context.request.text();

    let message;
    try {
      message = JSON.parse(body).message;
    } catch (e) {
      throw new Error("Invalid JSON body");
    }

    if (!message) {
      throw new Error("No message provided in request body.");
    }

    const ip = context.request.headers.get("cf-connecting-ip") || "Unavailable";
    const cf = context.request.cf || {};
    const city = cf.city || "N/A";
    const country = cf.country || "N/A";

    const telegramText = `📬 New message received!

📝 Message:
${message}

🌐 Sender info:
IP Address: ${ip}
Location: ${city}, ${country}
`;

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramText
        })
      }
    );

    const result = await telegramRes.text();

    if (!telegramRes.ok) {
      throw new Error(`Telegram API error: ${result}`);
    }

    return new Response(result, {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error("Worker error:", err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
