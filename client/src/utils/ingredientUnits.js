export const INGREDIENT_UNIT_OPTIONS = [
  "",
  "tsp",
  "tbsp",
  "cup",
  "oz",
  "lb",
  "g",
  "kg",
  "ml",
  "l",
  "pinch",
  "dash",
  "whole",
];

const UNIT_ALIASES = {
  teaspoon: "tsp",
  teaspoons: "tsp",
  tsp: "tsp",

  tablespoon: "tbsp",
  tablespoons: "tbsp",
  tbsp: "tbsp",

  cup: "cup",
  cups: "cup",

  ounce: "oz",
  ounces: "oz",
  oz: "oz",

  pound: "lb",
  pounds: "lb",
  lb: "lb",
  lbs: "lb",

  gram: "g",
  grams: "g",
  g: "g",

  kilogram: "kg",
  kilograms: "kg",
  kg: "kg",

  milliliter: "ml",
  milliliters: "ml",
  millilitre: "ml",
  millilitres: "ml",
  ml: "ml",

  liter: "l",
  liters: "l",
  litre: "l",
  litres: "l",
  l: "l",

  pinch: "pinch",
  pinches: "pinch",

  dash: "dash",
  dashes: "dash",

  whole: "whole",
};

export function normalizeIngredientUnit(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const normalizedValue = String(value).trim().toLowerCase();

  if (!normalizedValue) {
    return "";
  }

  return UNIT_ALIASES[normalizedValue] || "";
}
