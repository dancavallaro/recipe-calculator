# Recipe Calculator

A simple web app for recipe scaling calculations, designed for mobile use. Supports two recipe types:

- **Meat curing** — scale ingredients by meat weight, calculate Prague Powder #1 and cure time from thickness
- **Superjuice** — scale ingredients by a ratio against peel weight

## Development

```bash
npm install
npm run dev
```

Opens a local dev server with hot reload.

## Testing

```bash
npm test          # single run
npm run test:watch # watch mode
```

## Building

```bash
npm run build
```

Produces static files in `dist/`.

## Adding Recipes

Create a YAML file in `src/recipes/`. The app picks up new files automatically on rebuild.

**Curing recipe:**
```yaml
name: Corned Beef Brisket
type: CuredMeat
water:
  name: Distilled water
  amount: "1 gal"
meat:
  name: Beef brisket
  shape: Flat       # Flat or Cylinder
  amount: "4 lb"
ingredients:
  - name: Kosher salt
    amount: "1 cup"
```

**Superjuice recipe:**
```yaml
name: Lime Superjuice
type: Superjuice
water:
  name: Water
  ratio: 15
ingredients:
  - name: Citric acid
    ratio: 0.75
  - name: Malic acid
    ratio: 0.15
```

## Deployment

Build and push a Docker image, then apply the K8s manifests:

```bash
docker build -t cook-calc .
# push to your registry, then:
kubectl apply -f deploy/deployment.yaml
```

Update the hostname in `deploy/deployment.yaml` to match your domain.
