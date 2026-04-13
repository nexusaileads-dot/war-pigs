export const getWebAppUrl = (): string => {
  return process.env.TELEGRAM_MINI_APP_URL || 'https://t.me/your_bot/warpigs';
};
