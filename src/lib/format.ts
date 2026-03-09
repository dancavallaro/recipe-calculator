import { Quantity } from "./quantity";
import { convert } from "./units";

export function formatQuantity(q: Quantity, options?: { isLiquid?: boolean; digits?: number }): string {
  const digits = options?.digits ?? 2;
  const isLiquid = options?.isLiquid ?? false;
  const base = `${Number(q.amount.toFixed(digits))} ${q.units}`;

  // Gallons < 1: show in cups instead
  if (q.units === "gal" && q.amount < 1) {
    const cups = q.as("cup");
    return `${Number(cups.toFixed(digits))} cup`;
  }

  // Large gram amounts of liquid: show approximate cups (assuming water density ~1g/ml)
  if (isLiquid && q.units === "g" && q.amount >= 100) {
    const cups = convert(q.amount, "ml", "cup");
    if (cups >= 0.5) {
      return `${base} (~${Number(cups.toFixed(1))} cup)`;
    }
  }

  return base;
}
