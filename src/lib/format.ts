import { Quantity } from "./quantity";

export function formatQuantity(q: Quantity, digits: number = 2): string {
  const base = `${Number(q.amount.toFixed(digits))} ${q.units}`;

  // Gallons < 1: show in cups instead
  if (q.units === "gal" && q.amount < 1) {
    const cups = q.as("cup");
    return `${Number(cups.toFixed(digits))} cup`;
  }

  // Large gram amounts of water: show approximate cups
  if (q.units === "g" && q.amount >= 100) {
    const cups = q.as("cup");
    if (cups >= 0.5) {
      return `${base} (~${Number(cups.toFixed(1))} cup)`;
    }
  }

  return base;
}
