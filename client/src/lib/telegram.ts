export const TELEGRAM_BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'clonehodlbot';

export function getTelegramLoginUrl() {
  return `https://t.me/${TELEGRAM_BOT_USERNAME}`;
}

export function formatPoints(points: number | string) {
  const numPoints = typeof points === 'string' ? parseFloat(points) : points;
  return numPoints.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function calculateUsdValue(points: number | string, rate: number) {
  const numPoints = typeof points === 'string' ? parseFloat(points) : points;
  return (numPoints * rate).toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD'
  });
}