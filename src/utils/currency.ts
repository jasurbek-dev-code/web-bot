/**
 * Format a number as Uzbek Som (UZS)
 * Example: 28000 → "28 000 UZS"
 */
export function formatUZS(amount: number): string {
  if (isNaN(amount)) return "0 UZS";
  return (
    Math.round(amount)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " UZS"
  );
}
