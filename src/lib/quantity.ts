import { type Unit, convert } from "./units";

export class Quantity {
  readonly amount: number;
  readonly units: Unit;

  private constructor(amount: number, units: Unit) {
    this.amount = amount;
    this.units = units;
  }

  as(unit: Unit): number {
    return convert(this.amount, this.units, unit);
  }

  to(unit: Unit): Quantity {
    return Quantity.of(this.as(unit), unit);
  }

  scale(factor: number): Quantity {
    return Quantity.of(this.amount * factor, this.units);
  }

  str(digits: number = 2): string {
    return `${this.amount.toFixed(digits)} ${this.units}`;
  }

  static of(amount: number, units: Unit): Quantity {
    return new Quantity(amount, units);
  }

  static parse(s: string): Quantity {
    const parts = s.trim().split(/\s+/);
    if (parts.length !== 2) {
      throw new Error(`Invalid quantity format: "${s}"`);
    }
    const amount = parseFloat(parts[0]);
    if (isNaN(amount)) {
      throw new Error(`Invalid number in quantity: "${s}"`);
    }
    return new Quantity(amount, parts[1] as Unit);
  }
}
