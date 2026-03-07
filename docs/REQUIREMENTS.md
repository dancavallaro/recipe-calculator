## Overview

I want to create a very simple static web app, for personal use only, for performing
recipe calculations for cooking. There are two different types of recipes it must
support, and the two types require different calculations for scaling, but ultimately
I want the UI to be more-or-less the same for both, and I want to share as much code
as possible, the same representation for the recipe data, etc.

## Recipe types

Currently there are two types of recipes I want to support, which require different
scaling calculations but should generally have a similar UX and data representation.

### Simple ratio

These recipes have a list of ingredients and base quantities, and scaled by ratio 
calculated based on a user-provided value. 

Currently my only such use case is for citrus "superjuice" recipes, which are 
calculated based on the user-provided weight of peels. For example, my lime superjuice
recipe is:

* Citric acid: 0.75x peel weight
* Malic acid: 0.15x peel weight
* Water: 15x peel weight

The user would input, for example, 15 grams of peels, and the app would calculate
11.3g citric acid, 2.3g malic acid, and 225g (slightly < 1 cup) water. The parenthetical
value in cups is just an estimated value so I know what size measuring cup to use (1 cup,
2 cups, or 4 cups).

### Meat curing

These recipes are for various meats cured using Prague powder #1 (6.25% sodium nitrite).
The user inputs the weight of the meat, which is used to scale the ingredients, and the
thickness of the meat (at the thickest point) which is used to calculate the curing time.

These recipes, and my original implementation, are based off the Amazing Ribs Smoked Homemade
Bacon recipe at https://amazingribs.com/tested-recipes/pork-recipes/smoked-homemade-bacon/.

Here's an example cured meat recipe for maple bacon in YAML format:

```yaml
name: Maple Bacon
water:
  name: Distilled water
  amount: "0.046875 gal"
meat:
  name: Pork belly
  shape: Flat
  amount: "3 lb"
ingredients:
  - name: Kosher salt
    amount: "4.5 tsp"
  - name: Dark brown sugar
    amount: "3 Tbs"
  - name: Ground black pepper
    amount: "4.5 tsp"
  - name: Dark maple syrup
    amount: "0.5 cup"
```

Based on the user-provided weight and thickness, the app would calculate the scaled amount
of each ingredient in the recipe, including water, and including Prague powder #1 (which
is calculated automatically, and not explicitly specified in each recipe). The scaling 
should also take into account the additional volume of any liquid ingredients, such as
maple syrup in the maple bacon recipe.

See /Users/dan/workspace/curing-calculator/lib/calculator.ts for my original implementation
of these scaling calculations. I believe they are correct, but you must validate the
correctness before beginning implementation here.

## UI/UX

It can be a simple webapp, with some simple styling to make it aesthetically pleasing
and easy to read on my phone (an iPhone). The user should be able to select a recipe from
a list, see the base ingredients, and be presented with input fields to input the 
user-provided values for that recipe. When they input those values, the app should calculate
and display the scaled ingredient quantities. The app should also display the calculated
cure time for cured meat recipes.

## Recipe representation

I do not need any UI workflow for managing the recipes, they will be stored as static data
in the app and I'm OK with requiring a code commit + deployment to update recipes. It should
be easy for me to add new recipes and modify existing recipes, e.g. by creating a new YAML
file in a directory or something like that. You should recommend the file structure and YAML
schema based on the requirements given.

## Implementation details

I am a professional software developer with many years of backend development experience,
but I'm pretty inexperienced with frontend development, so I don't have much of an opinion
on frontend implementation choices. I don't love Javascript, and have used Typescript 
before, so I'm partial to Typescript but I'm open to recommendations -- if pure Javascript
is easy enough and would keep things much simpler, I'm open to that.

## Deployment/infrastructure details

I host my own Kubernetes cluster, and I have a domain with DNS set up and support for
LoadBalancers, HTTPRoutes (via Gateway), and Ingresses, so I can host pretty much anything.
I don't have any preference for specific technologies or frameworks, so you need to make
a recommendation based on my requirements.

## Example recipes

This list is not exhaustive, but should be enough to illustrate the requirements.

### Superjuice recipes

```yaml
name: Lime superjuice
water:
  name: Water
  ratio: 15
ingredients:
  - name: Citric acid
    ratio: 0.75
  - name: Malic acid
    ratio: 0.15
```

### Cured meat recipes

```yaml
name: Cured ham
water:
  name: Distilled water
  amount: "3 gal"
meat:
  name: Whole fresh ham
  shape: Cylinder
  amount: "20 lb"
ingredients:
  - name: Kosher salt
    amount: "2.5 cup"
```
