/** Short haptic pattern — works on Android; iOS Safari is limited. */
export function vibrateForNotification(): void {
  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  try {
    navigator.vibrate([100, 50, 100]);
  } catch {
    // ignore
  }
}
