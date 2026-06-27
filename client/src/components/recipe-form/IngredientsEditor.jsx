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

  return parts.join(" ") || "New ingredient — add details";
}

export default function IngredientsEditor({
  ingredients,
  onIngredientChange,
  onAddIngredient,
  onRemoveIngredient,
}) {
  const completedIngredients = ingredients.filter(hasIngredientContent);
  const hasCompletedIngredients = completedIngredients.length > 0;

  const [isSectionExpanded, setIsSectionExpanded] = useState(
    !hasCompletedIngredients,
  );

 const [expandedIngredientId, setExpandedIngredientId] = useState(null);

  const activeExpandedIngredientId = ingredients.some(
    (ingredient) => ingredient.id === expandedIngredientId,
  )
    ? expandedIngredientId
    : null;

  const visibleIngredientChips = completedIngredients.slice(0, 5);

  const remainingIngredientCount =
    completedIngredients.length - visibleIngredientChips.length;

  function handleOpenSection() {
  setIsSectionExpanded(true);
  setExpandedIngredientId(null);
}

function handleCloseSection() {
  setExpandedIngredientId(null);
  setIsSectionExpanded(false);
}

function handleAddIngredient() {
  const newIngredientId = onAddIngredient();

  setIsSectionExpanded(true);

  if (newIngredientId) {
    setExpandedIngredientId(newIngredientId);
  }
}

  function handleRemoveIngredient(ingredientId) {
    const removedIngredientIndex = ingredients.findIndex(
      (ingredient) => ingredient.id === ingredientId,
    );

    const wasExpanded =
      activeExpandedIngredientId === ingredientId;

    onRemoveIngredient(ingredientId);

    if (!wasExpanded) {
      return;
    }

    const remainingIngredients = ingredients.filter(
      (ingredient) => ingredient.id !== ingredientId,
    );

    const nextIngredient =
      remainingIngredients[removedIngredientIndex] ||
      remainingIngredients[removedIngredientIndex - 1] ||
      remainingIngredients[0];

    setExpandedIngredientId(nextIngredient?.id || null);
  }

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold">Ingredients</h2>

            {!isSectionExpanded && (
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

          {!isSectionExpanded && (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddIngredient}
              >
                Add Ingredient
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={handleOpenSection}
                aria-expanded={isSectionExpanded}
              >
                Edit Ingredients
              </Button>
            </div>
          )}
        </div>

        {isSectionExpanded && (
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

            <div className="space-y-3">
              {ingredients.map((ingredient, index) => {
                const isExpanded =
                  activeExpandedIngredientId === ingredient.id;

                const ingredientLabel =
                  createIngredientLabel(ingredient);

                return (
                  <div
                    key={ingredient.id}
                    className={`rounded-2xl border transition ${
                      isExpanded
                        ? "border-purple-200 bg-white shadow-sm"
                        : "border-stone-200 bg-stone-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 p-4">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedIngredientId(
                            isExpanded ? null : ingredient.id,
                          )
                        }
                        className="min-w-0 flex-1 text-left"
                        aria-expanded={isExpanded}
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-purple-700">
                          Ingredient {index + 1}
                        </p>

                        {!isExpanded && (
                          <p className="mt-2 break-words text-sm leading-6 text-stone-700">
                            {ingredientLabel}
                          </p>
                        )}
                      </button>

                      <div className="flex shrink-0 items-center gap-3">
                        {!isExpanded && (
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() =>
                              setExpandedIngredientId(ingredient.id)
                            }
                          >
                            Edit
                          </Button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveIngredient(ingredient.id)
                          }
                          className="text-sm text-stone-500 transition hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="space-y-4 border-t border-stone-200 p-4">
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
                            placeholder="Flour"
                          />
                        </div>

                        <div className="flex justify-end border-t border-stone-200 pt-4">
                          <Button
                            type="button"
                            onClick={() =>
                              setExpandedIngredientId(null)
                            }
                          >
                            Done Editing Ingredient
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 border-t border-stone-200 pt-4 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddIngredient}
              >
                + Add Another Ingredient
              </Button>

              <Button type="button" onClick={handleCloseSection}>
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}