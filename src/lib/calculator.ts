import { Quantity } from "./quantity";
import type {
  CuringRecipe, CuringInput, CuringResult,
  RatioRecipe, RatioResult,
  MeatShape, ScaledIngredient,
} from "./types";

const TARGET_PPM = 125;

export function calcCureTime(thickness: Quantity, shape: MeatShape): number {
  const inches = thickness.as("in");
  const factor = shape === "Cylinder" ? 0.5 : 1.0;
  return factor * 1.25 * inches * inches;
}

export function calcScaleFactor(actualWeight: Quantity, baseWeight: Quantity): number {
  return actualWeight.as("kg") / baseWeight.as("kg");
}

export function calcPraguePowder(meatWeight: Quantity, brineVolume: Quantity): Quantity {
  const totalVolume = brineVolume.as("l") + meatWeight.as("kg");
  const gramsSodiumNitrite = (totalVolume * 1000) * (TARGET_PPM / 1_000_000);
  const gramsPP1 = gramsSodiumNitrite / 0.0625;
  return Quantity.of(gramsPP1, "g");
}

export function scaleCuringRecipe(recipe: CuringRecipe, input: CuringInput): CuringResult {
  const scaleFactor = calcScaleFactor(input.weight, recipe.meat.baseWeight);

  const water = recipe.water.amount.scale(scaleFactor);

  const ingredients: ScaledIngredient[] = recipe.ingredients.map(ing => ({
    name: ing.name,
    amount: ing.amount.scale(scaleFactor),
  }));

  const praguePowder = calcPraguePowder(input.weight, water);
  const cureTimeDays = calcCureTime(input.thickness, recipe.meat.shape);

  return { water, praguePowder, cureTimeDays, ingredients };
}

export function scaleRatioRecipe(recipe: RatioRecipe, weight: number): RatioResult {
  const water = Quantity.of(recipe.waterRatio * weight, "g");

  const ingredients: ScaledIngredient[] = recipe.ingredients.map(ing => ({
    name: ing.name,
    amount: Quantity.of(ing.ratio * weight, "g"),
  }));

  return { water, ingredients };
}
