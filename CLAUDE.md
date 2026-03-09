# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static web app for recipe scaling calculations, designed for personal use on mobile (iPhone). Two recipe types:

1. **Simple ratio recipes** (e.g., citrus superjuice): ingredients scaled by a ratio against a user-provided weight (e.g., peel weight).
2. **Meat curing recipes**: ingredients scaled by user-provided meat weight, with cure time calculated from meat thickness. Prague powder #1 (6.25% sodium nitrite) is automatically calculated and not specified per-recipe.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — type-check with tsc then build to `dist/`
- `npm test` — run Vitest (single run)
- `npm run test:watch` — run Vitest in watch mode

## Tech Stack

- **Vite** — build tool, handles YAML imports via `import.meta.glob` with `?raw`
- **Alpine.js** — reactive UI (declared in `index.html`, wired in `src/main.ts`)
- **TypeScript** — strict mode
- **Vitest** — testing
- **js-yaml** — YAML parsing for recipe files

## Architecture

### Core library (`src/lib/`)

- `units.ts` — Custom unit conversion for ~12 units (mass/volume/length). No external dependency.
- `quantity.ts` — Immutable `Quantity` value object (amount + unit). `scale()` is pure — no auto-conversion.
- `format.ts` — Display formatting: gallons < 1 → cups, large gram amounts → cup estimate.
- `types.ts` — Discriminated union types: `CuringRecipe | RatioRecipe`, with separate `ScaledIngredient` and `RatioIngredient` (no optional fields).
- `calculator.ts` — Pure functions: `scaleCuringRecipe()`, `scaleRatioRecipe()`, `calcCureTime()`, `calcPraguePowder()`.
- `recipe-loader.ts` — Loads YAML files from `src/recipes/` at build time via `import.meta.glob`, parses into typed `Recipe` objects.

### Recipe data (`src/recipes/`)

One YAML file per recipe. Adding a recipe = create a YAML file + redeploy. See `docs/REQUIREMENTS.md` for schema details.

Current recipes: brisket, ham, bacon, maple_bacon, lime_superjuice.

### UI

Single-page Alpine.js app in `index.html`. Two views: recipe list (tappable cards) and recipe detail (inputs + scaled results). Mobile-first CSS at 480px max-width.

## Key Domain Formulas

- **Cure time**: `shapeFactor × 1.25 × thickness²` (thickness in inches; Flat=1.0, Cylinder=0.5)
- **Scale factor**: `actualWeight(kg) / baseWeight(kg)`
- **Prague powder**: `(brineVolume(L) + meatWeight(kg)) × 1000 × (125/1e6) / 0.0625`
- **Ratio scaling**: `ingredient.ratio × userWeight` for each ingredient

## Testing

Tests in `src/lib/__tests__/`. Calculator tests port known-good values from the original curing-calculator project (`/Users/dan/workspace/curing-calculator/`). Custom `toBeCloseEnough` Vitest matcher for floating-point Quantity comparison.

## Deployment

- `Dockerfile` — multi-stage: node build → nginx static serve
- `deploy/deployment.yaml` — K8s Deployment, Service, HTTPRoute (Gateway API)
- Self-hosted Kubernetes cluster with domain, DNS, LoadBalancer, and HTTPRoute support
