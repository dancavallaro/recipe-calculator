import * as yaml from "js-yaml";
import { Quantity } from "./quantity";
import type { Recipe, CuringRecipe, RatioRecipe, MeatShape } from "./types";

interface RawCuringRecipe {
  name: string;
  type: "CuredMeat";
  water: { name: string; amount: string };
  meat: { name: string; shape: string; amount: string };
  ingredients: { name: string; amount: string }[];
}

interface RawRatioRecipe {
  name: string;
  type: "Superjuice";
  water: { name: string; ratio: number };
  ingredients: { name: string; ratio: number }[];
}

type RawRecipe = RawCuringRecipe | RawRatioRecipe;

function parseCuringRecipe(raw: RawCuringRecipe, id: string): CuringRecipe {
  const shape = raw.meat.shape as MeatShape;
  if (shape !== "Flat" && shape !== "Cylinder") {
    throw new Error(`Invalid meat shape "${raw.meat.shape}" in recipe "${raw.name}"`);
  }

  return {
    type: "CuredMeat",
    name: raw.name,
    id,
    meat: {
      name: raw.meat.name,
      shape,
      baseWeight: Quantity.parse(raw.meat.amount),
    },
    water: {
      name: raw.water.name,
      amount: Quantity.parse(raw.water.amount),
    },
    ingredients: raw.ingredients.map(ing => ({
      name: ing.name,
      amount: Quantity.parse(ing.amount),
    })),
  };
}

function parseRatioRecipe(raw: RawRatioRecipe, id: string): RatioRecipe {
  return {
    type: "Superjuice",
    name: raw.name,
    id,
    waterRatio: raw.water.ratio,
    waterName: raw.water.name,
    ingredients: raw.ingredients.map(ing => ({
      name: ing.name,
      ratio: ing.ratio,
    })),
  };
}

function parseRecipe(content: string, id: string): Recipe {
  const raw = yaml.load(content) as RawRecipe;

  if (raw.type === "CuredMeat") {
    return parseCuringRecipe(raw as RawCuringRecipe, id);
  } else if (raw.type === "Superjuice") {
    return parseRatioRecipe(raw as RawRatioRecipe, id);
  }

  throw new Error(`Unknown recipe type in "${id}"`);
}

export function loadRecipes(): Recipe[] {
  const modules = import.meta.glob("/src/recipes/*.yaml", { eager: true, query: "?raw", import: "default" });
  const recipes: Recipe[] = [];

  for (const [path, content] of Object.entries(modules)) {
    const id = path.split("/").pop()!.replace(".yaml", "");
    recipes.push(parseRecipe(content as string, id));
  }

  return recipes.sort((a, b) => a.name.localeCompare(b.name));
}

export function loadRecipe(id: string): Recipe {
  const recipes = loadRecipes();
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) {
    throw new Error(`Recipe "${id}" not found`);
  }
  return recipe;
}
