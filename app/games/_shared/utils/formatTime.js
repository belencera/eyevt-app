export function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m > 0) return `${m}:${String(s).padStart(2, '0')}`
  return String(s)
}
