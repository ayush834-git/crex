export function formatRelativeUpdate(timestamp: string) {
  const diffSeconds = Math.max(0, Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000));
  if (diffSeconds < 60) return `Updated ${diffSeconds}s ago`;
  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) return `Updated ${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `Updated ${hours}h ago`;
}

export function formatMatchTime(timestamp: string) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function clampNumber(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}
