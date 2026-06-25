import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { INGREDIENT_UNIT_OPTIONS } from "../../utils/ingredientUnits";

function hasIngredientContent(ingredient) {
  return Boolean(
    ingredient.ingredientId ||
      ingredient.quantity?.trim() ||
      ingredient.unit?.trim() ||
      ingredient.ingredient?.trim() ||
      ingredient.name?.trim(),
  );
}

function formatIngredient(ingredient) {
  return [
    ingredient.quantity,
    ingredient.unit,
    ingredient.ingredient || ingredient.name,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function StepIngredientsEditor({
  recipeIngredients = [],
  ingredients = [],
  onIngredientChange,
  onAddIngredient,
  onAddLinkedIngredient,
  onRemoveIngredient,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRecipeIngredientId, setSelectedRecipeIngredientId] =
    useState("");

  const linkedIngredientIds = new Set(
    ingredients
      .map((ingredient) => ingredient.ingredientId)
      .filter(Boolean),
  );

  const availableRecipeIngredients = recipeIngredients.filter(
    (ingredient) =>
      ingredient.ingredient?.trim() &&
      !linkedIngredientIds.has(ingredient.id),
  );

  const completedIngredients = ingredients.filter(hasIngredientContent);
  const ingredientCount = completedIngredients.length;

  const ingredientCountLabel =
    ingredientCount === 1
      ? "1 ingredient attached"
      : `${ingredientCount} ingredients attached`;

  function getRecipeIngredient(ingredientId) {
    return recipeIngredients.find(
      (ingredient) => ingredient.id === ingredientId,
    );
  }

  function getDisplayIngredient(stepIngredient) {
    if (!stepIngredient.ingredientId) {
      return stepIngredient;
    }

    const recipeIngredient = getRecipeIngredient(
      stepIngredient.ingredientId,
    );

    return recipeIngredient || stepIngredient;
  }

  function handleOpenEditor() {
    setIsExpanded(true);
  }

  function handleAddIngredient() {
    onAddIngredient();
    setIsExpanded(true);
  }

  function handleAttachRecipeIngredient() {
    if (!selectedRecipeIngredientId) {
      return;
    }

    const selectedIngredient = getRecipeIngredient(
      selectedRecipeIngredientId,
    );

    if (!selectedIngredient) {
      return;
    }

    onAddLinkedIngredient(selectedIngredient);
    setSelectedRecipeIngredientId("");
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-stone-800">
            Ingredients Used In This Step
          </h4>

          <p className="mt-1 text-sm text-stone-500">
            {ingredientCountLabel}
          </p>

          {!isExpanded && ingredientCount > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {completedIngredients.slice(0, 3).map((ingredient) => (
                <span
                  key={ingredient.id}
                  className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-700"
                >
                  {formatIngredient(
                    getDisplayIngredient(ingredient),
                  )}
                </span>
              ))}

              {ingredientCount > 3 && (
                <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-500">
                  +{ingredientCount - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {!isExpanded && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleOpenEditor}
            aria-expanded={isExpanded}
          >
            {ingredientCount > 0
              ? "Edit Ingredients"
              : "Add Ingredients"}
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4 border-t border-stone-200 pt-4">
          <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-4">
            <div>
              <h5 className="text-sm font-semibold text-stone-800">
                Use Recipe Ingredient
              </h5>

              <p className="mt-1 text-sm text-stone-500">
                Attach an ingredient from the main recipe list so it
                stays connected.
              </p>
            </div>

            {availableRecipeIngredients.length > 0 ? (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="block flex-1 space-y-2">
                  <span className="text-sm font-medium text-stone-700">
                    Recipe ingredient
                  </span>

                  <select
                    value={selectedRecipeIngredientId}
                    onChange={(event) =>
                      setSelectedRecipeIngredientId(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 outline-none transition hover:border-stone-400 focus:border-purple-700 focus:ring-2 focus:ring-purple-100 sm:text-sm"
                  >
                    <option value="">Choose an ingredient</option>

                    {availableRecipeIngredients.map((ingredient) => (
                      <option
                        key={ingredient.id}
                        value={ingredient.id}
                      >
                        {formatIngredient(ingredient)}
                      </option>
                    ))}
                  </select>
                </label>

                <Button
                  type="button"
                  onClick={handleAttachRecipeIngredient}
                  disabled={!selectedRecipeIngredientId}
                >
                  Attach Ingredient
                </Button>
              </div>
            ) : (
              <p className="mt-4 text-sm text-stone-500">
                All recipe ingredients are already attached to this
                step.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-stone-500">
              Add a custom ingredient needed only during this step.
            </p>

            <Button
              type="button"
              variant="secondary"
              onClick={handleAddIngredient}
            >
              Add Custom Ingredient
            </Button>
          </div>

          <div className="space-y-4">
            {ingredients.map((ingredient, index) => {
              const isLinkedIngredient = Boolean(
                ingredient.ingredientId,
              );

              const displayIngredient =
                getDisplayIngredient(ingredient);

              return (
                <div
                  key={ingredient.id}
                  className="rounded-2xl border border-stone-200 bg-white p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h5 className="text-sm font-medium text-stone-700">
                        {isLinkedIngredient
                          ? "Recipe Ingredient"
                          : `Custom Step Ingredient ${index + 1}`}
                      </h5>

                      {isLinkedIngredient && (
                        <p className="mt-1 text-xs font-medium text-purple-700">
                          Linked to the main recipe list
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onRemoveIngredient(ingredient.id)
                      }
                      className="text-sm text-stone-500 transition hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>

                  {isLinkedIngredient ? (
                    <div className="rounded-xl border border-purple-100 bg-purple-50 px-4 py-3">
                      <p className="font-medium text-stone-800">
                        {formatIngredient(displayIngredient)}
                      </p>

                      <p className="mt-1 text-xs text-stone-500">
                        Quantity, unit, and name come from the main
                        recipe ingredient.
                      </p>
                    </div>
                  ) : (
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
                          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 outline-none transition hover:border-stone-400 focus:border-purple-700 focus:ring-2 focus:ring-purple-100 sm:text-sm"
                        >
                          {INGREDIENT_UNIT_OPTIONS.map((unit) => (
                            <option
                              key={unit || "blank"}
                              value={unit}
                            >
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
                        placeholder="Eggs"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-stone-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddIngredient}
            >
              + Add Custom Ingredient
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
  );
}