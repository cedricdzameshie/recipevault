import Input from "../common/Input";
import Button from "../common/Button";

const UNIT_OPTIONS = [
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

export default function StepIngredientsEditor({
  ingredients,
  onIngredientChange,
  onAddIngredient,
  onRemoveIngredient,
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-stone-800">
          Ingredients Used In This Step
        </h4>

        <Button type="button" variant="secondary" onClick={onAddIngredient}>
          Add Step Ingredient
        </Button>
      </div>

      <div className="space-y-4">
        {ingredients.map((ingredient, index) => (
          <div
            key={ingredient.id}
            className="rounded-2xl border border-stone-200 bg-white p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <h5 className="text-sm font-medium text-stone-700">
                Step Ingredient {index + 1}
              </h5>

              <button
                type="button"
                onClick={() => onRemoveIngredient(ingredient.id)}
                className="text-sm text-stone-600 transition hover:text-stone-900"
              >
                Remove
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-[120px_140px_1fr]">
              <Input
                label="Quantity"
                name="quantity"
                value={ingredient.quantity}
                onChange={(e) =>
                  onIngredientChange(ingredient.id, "quantity", e.target.value)
                }
                placeholder="2"
              />

              <label className="block space-y-2">
                <span className="text-sm font-medium text-stone-700">Unit</span>
                <select
                  value={ingredient.unit}
                  onChange={(e) =>
                    onIngredientChange(ingredient.id, "unit", e.target.value)
                  }
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                >
                  {UNIT_OPTIONS.map((unit) => (
                    <option key={unit || "blank"} value={unit}>
                      {unit || "No unit"}
                    </option>
                  ))}
                </select>
              </label>

              <Input
                label="Ingredient"
                name="ingredient"
                value={ingredient.ingredient}
                onChange={(e) =>
                  onIngredientChange(ingredient.id, "ingredient", e.target.value)
                }
                placeholder="Eggs"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}