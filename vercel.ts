import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  framework: "nextjs",
  crons: [
    // Checks for new offers/stories and posts SFW teasers to Telegram.
    // Hobby plan allows at most one run/day — bump to hourly if/when upgrading to Pro.
    { path: "/api/cron/telegram-autopost", schedule: "0 12 * * *" },
  ],
};
