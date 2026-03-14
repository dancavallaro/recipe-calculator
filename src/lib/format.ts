import { Quantity } from "./quantity";
import { convert } from "./units";

function smartRound(value: number, maxDigits: number): string {
  // Use fewer decimal places for larger numbers
  let digits = maxDigits;
  if (value >= 100) digits = Math.min(digits, 0);
  else if (value >= 10) digits = Math.min(digits, 1);
  return `${Number(value.toFixed(digits))}`;
}

export function formatQuantity(q: Quantity, options?: { isLiquid?: boolean; digits?: number }): string {
  const digits = options?.digits ?? 2;
  const isLiquid = options?.isLiquid ?? false;
  const base = `${smartRound(q.amount, digits)} ${q.units}`;

  // Gallons < 1: show in cups instead
  if (q.units === "gal" && q.amount < 1) {
    const cups = q.as("cup");
    return `${smartRound(cups, digits)} cup`;
  }

  // Large gram amounts of liquid: show approximate cups (assuming water density ~1g/ml)
  if (isLiquid && q.units === "g" && q.amount >= 100) {
    const cups = convert(q.amount, "ml", "cup");
    if (cups >= 0.5) {
      return `${base} (~${Number(cups.toFixed(1))} cup)`;
    }
  }

  // Large volume amounts in smaller units: show cups in parentheses
  if (q.units === "Tbsp" || q.units === "tsp" || q.units === "ml") {
    const cups = convert(q.amount, q.units, "cup");
    if (cups >= 0.2) {
      return `${base} (${Number(cups.toFixed(2))} cup)`;
    }
  }

  return base;
}
