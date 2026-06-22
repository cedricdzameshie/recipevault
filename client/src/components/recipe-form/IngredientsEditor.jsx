import { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import { INGREDIENT_UNIT_OPTIONS } from "../../utils/ingredientUnits";


function hasIngredientContent(ingredient) {
  return Boolean(
    ingredient.ingredient?.trim() ||
      ingredient.quantity?.trim() ||
      ingredient.unit?.trim(),
  );
}

function createIngredientLabel(ingredient) {
  const parts = [
    ingredient.quantity?.trim(),
    ingredient.unit?.trim(),
    ingredient.ingredient?.trim(),
  ].filter(Boolean);

  return parts.join(" ") || "Unnamed ingredient";
}

export default function IngredientsEditor({
  ingredients,
  onIngredientChange,
  onAddIngredient,
  onRemoveIngredient,
}) {
  const completedIngredients = ingredients.filter(hasIngredientContent);

  const [isExpanded, setIsExpanded] = useState(
    completedIngredients.length === 0,
  );

  const visibleIngredientChips = completedIngredients.slice(0, 5);
  const remainingIngredientCount =
    completedIngredients.length - visibleIngredientChips.length;

  function handleAddIngredient() {
    onAddIngredient();
    setIsExpanded(true);
  }

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold">Ingredients</h2>

            {!isExpanded && (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-stone-500">
                  {completedIngredients.length === 1
                    ? "1 ingredient added"
                    : `${completedIngredients.length} ingredients added`}
                </p>

                {visibleIngredientChips.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {visibleIngredientChips.map((ingredient) => (
                      <span
                        key={ingredient.id}
                        className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-600"
                      >
                        {createIngredientLabel(ingredient)}
                      </span>
                    ))}

                    {remainingIngredientCount > 0 && (
                      <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs text-purple-700">
                        +{remainingIngredientCount} more
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-stone-500">
                    No ingredients added yet.
                  </p>
                )}
              </div>
            )}
          </div>

          {!isExpanded && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsExpanded(true)}
              aria-expanded={isExpanded}
            >
              Edit Ingredients
            </Button>
          )}
        </div>

        {isExpanded && (
          <div className="space-y-4 border-t border-stone-200 pt-4">
            <div className="flex justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddIngredient}
              >
                Add Ingredient
              </Button>
            </div>

            <div className="space-y-4">
              {ingredients.map((ingredient, index) => (
                <div
                  key={ingredient.id}
                  className="rounded-2xl border border-stone-200 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
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
                      onChange={(event) =>
                        onIngredientChange(
                          ingredient.id,
                          "quantity",
                          event.target.value,
                        )
                      }
                      placeholder="2"
                    />

                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-stone-700">
                        Unit
                      </span>

                      <select
                        value={ingredient.unit}
                        onChange={(event) =>
                          onIngredientChange(
                            ingredient.id,
                            "unit",
                            event.target.value,
                          )
                        }
                        className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-stone-500 sm:text-sm"
                      >
                        {INGREDIENT_UNIT_OPTIONS.map((unit) => (
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
                      onChange={(event) =>
                        onIngredientChange(
                          ingredient.id,
                          "ingredient",
                          event.target.value,
                        )
                      }
                      placeholder="Flour"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-stone-200 pt-4 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddIngredient}
              >
                + Add Another Ingredient
              </Button>

              <Button
                type="button"
                onClick={() => setIsExpanded(false)}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}