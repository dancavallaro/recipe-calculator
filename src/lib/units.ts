export type Unit = "g" | "kg" | "lb" | "oz" | "tsp" | "Tbsp" | "cup" | "gal" | "l" | "ml" | "in" | "cm";

type UnitCategory = "mass" | "volume" | "length";

interface UnitDef {
  category: UnitCategory;
  baseUnit: Unit;
  toBase: number;
}

const unitDefs: Record<Unit, UnitDef> = {
  // Mass (base: g)
  g:   { category: "mass", baseUnit: "g", toBase: 1 },
  kg:  { category: "mass", baseUnit: "g", toBase: 1000 },
  lb:  { category: "mass", baseUnit: "g", toBase: 453.59237 },
  oz:  { category: "mass", baseUnit: "g", toBase: 28.349523125 },

  // Volume (base: ml)
  ml:  { category: "volume", baseUnit: "ml", toBase: 1 },
  tsp: { category: "volume", baseUnit: "ml", toBase: 4.92892 },
  Tbsp: { category: "volume", baseUnit: "ml", toBase: 14.7868 },
  cup: { category: "volume", baseUnit: "ml", toBase: 236.588 },
  l:   { category: "volume", baseUnit: "ml", toBase: 1000 },
  gal: { category: "volume", baseUnit: "ml", toBase: 3785.41 },

  // Length (base: cm)
  cm:  { category: "length", baseUnit: "cm", toBase: 1 },
  in:  { category: "length", baseUnit: "cm", toBase: 2.54 },
};

export function unitCategory(unit: Unit): UnitCategory {
  return unitDefs[unit].category;
}

export function convert(amount: number, from: Unit, to: Unit): number {
  const fromDef = unitDefs[from];
  const toDef = unitDefs[to];

  if (fromDef.category !== toDef.category) {
    throw new Error(`Cannot convert ${from} (${fromDef.category}) to ${to} (${toDef.category})`);
  }

  const base = amount * fromDef.toBase;
  return base / toDef.toBase;
}
