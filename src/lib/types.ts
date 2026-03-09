import type { Quantity } from "./quantity";

export interface ScaledIngredient {
  name: string;
  amount: Quantity;
}

export interface RatioIngredient {
  name: string;
  ratio: number;
}

export type MeatShape = "Flat" | "Cylinder";

export interface MeatInfo {
  name: string;
  shape: MeatShape;
  baseWeight: Quantity;
}

export interface CuringRecipe {
  type: "CuredMeat";
  name: string;
  id: string;
  meat: MeatInfo;
  water: ScaledIngredient;
  ingredients: ScaledIngredient[];
}

export interface RatioRecipe {
  type: "Superjuice";
  name: string;
  id: string;
  waterRatio: number;
  waterName: string;
  ingredients: RatioIngredient[];
}

export type Recipe = CuringRecipe | RatioRecipe;

export interface CuringInput {
  weight: Quantity;
  thickness: Quantity;
}

export interface CuringResult {
  water: Quantity;
  praguePowder: Quantity;
  cureTimeDays: number;
  ingredients: ScaledIngredient[];
}

export interface RatioResult {
  water: Quantity;
  ingredients: ScaledIngredient[];
}
