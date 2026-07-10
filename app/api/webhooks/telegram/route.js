export async function POST(request) {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    return new Response("Telegram bot not configured", { status: 503 });
  }
  const { bot } = await import("../../../../src/lib/telegram-bot.js");
  return bot.webhooks.telegram(request);
}
