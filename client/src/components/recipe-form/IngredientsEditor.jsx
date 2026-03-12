import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";

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

export default function IngredientsEditor({
  ingredients,
  onIngredientChange,
  onAddIngredient,
  onRemoveIngredient,
}) {
  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Ingredients</h2>
          <Button type="button" variant="secondary" onClick={onAddIngredient}>
            Add Ingredient
          </Button>
        </div>

        <div className="space-y-4">
          {ingredients.map((ingredient, index) => (
            <div
              key={ingredient.id}
              className="rounded-2xl border border-stone-200 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-stone-700">
                  Ingredient {index + 1}
                </h3>

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
                  placeholder="Flour"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}