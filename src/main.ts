import Alpine from "alpinejs";
import { loadRecipes } from "./lib/recipe-loader";
import { scaleCuringRecipe, scaleRatioRecipe } from "./lib/calculator";
import { formatQuantity } from "./lib/format";
import { Quantity } from "./lib/quantity";
import type { Recipe, CuringResult, RatioResult } from "./lib/types";
import type { Unit } from "./lib/units";
import "./style.css";

interface AppState {
  recipes: Recipe[];
  selected: Recipe | null;
  weightValue: string;
  weightUnit: Unit;
  thicknessValue: string;
  thicknessUnit: Unit;
  result: CuringResult | RatioResult | null;
  selectRecipe(recipe: Recipe): void;
  back(): void;
  calculate(): void;
  formatAmount(q: Quantity): string;
  isCuringResult(): boolean;
}

Alpine.data("app", (): AppState => ({
  recipes: loadRecipes(),
  selected: null,
  weightValue: "",
  weightUnit: "lb",
  thicknessValue: "",
  thicknessUnit: "in",
  result: null,

  selectRecipe(recipe: Recipe) {
    this.selected = recipe;
    this.weightValue = "";
    this.thicknessValue = "";
    this.result = null;

    if (recipe.type === "Superjuice") {
      this.weightUnit = "g";
    } else {
      this.weightUnit = "lb";
    }
  },

  back() {
    this.selected = null;
    this.result = null;
  },

  calculate() {
    if (!this.selected || !this.weightValue) {
      this.result = null;
      return;
    }

    const weight = parseFloat(this.weightValue);
    if (isNaN(weight) || weight <= 0) {
      this.result = null;
      return;
    }

    if (this.selected.type === "Superjuice") {
      const weightGrams = Quantity.of(weight, this.weightUnit).as("g");
      this.result = scaleRatioRecipe(this.selected, weightGrams);
    } else {
      const thickness = parseFloat(this.thicknessValue);
      if (isNaN(thickness) || thickness <= 0) {
        this.result = null;
        return;
      }

      this.result = scaleCuringRecipe(this.selected, {
        weight: Quantity.of(weight, this.weightUnit),
        thickness: Quantity.of(thickness, this.thicknessUnit),
      });
    }
  },

  formatAmount(q: Quantity) {
    return formatQuantity(q);
  },

  isCuringResult() {
    return this.result !== null && "cureTimeDays" in this.result;
  },
}));

Alpine.start();
