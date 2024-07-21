export function formatTime(seconds: number = 0): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = minutes.toFixed(0);
  const formattedSeconds = remainingSeconds.toFixed(0);

  return `${formattedMinutes} min : ${formattedSeconds} seg`;
}
