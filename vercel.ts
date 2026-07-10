import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  framework: "nextjs",
  crons: [
    // Checks for new offers/stories and posts SFW teasers to Telegram.
    { path: "/api/cron/telegram-autopost", schedule: "0 */6 * * *" },
  ],
};
