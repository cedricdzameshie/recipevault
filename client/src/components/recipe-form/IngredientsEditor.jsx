import { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import { INGREDIENT_UNIT_OPTIONS } from "../../utils/ingredientUnits";

function hasIngredientContent(ingredient) {
  return Boolean(
    ingredient.ingredient?.trim() ||
      ingredient.quantity?.trim() ||
      ingredient.unit?.trim()
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

function getFirstIngredientId(ingredients) {
  return ingredients[0]?.id || null;
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
    !hasCompletedIngredients
  );

  const [expandedIngredientId, setExpandedIngredientId] = useState(() =>
    hasCompletedIngredients ? null : getFirstIngredientId(ingredients)
  );

  const activeExpandedIngredientId = ingredients.some(
    (ingredient) => ingredient.id === expandedIngredientId
  )
    ? expandedIngredientId
    : getFirstIngredientId(ingredients);

  const visibleIngredientChips = completedIngredients.slice(0, 5);

  const remainingIngredientCount =
    completedIngredients.length - visibleIngredientChips.length;

  function handleOpenSection() {
    setIsSectionExpanded(true);
    setExpandedIngredientId(getFirstIngredientId(ingredients));
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
      (ingredient) => ingredient.id === ingredientId
    );

    const wasExpanded = activeExpandedIngredientId === ingredientId;

    onRemoveIngredient(ingredientId);

    if (!wasExpanded) {
      return;
    }

    const remainingIngredients = ingredients.filter(
      (ingredient) => ingredient.id !== ingredientId
    );

    const nextIngredient =
      remainingIngredients[removedIngredientIndex] ||
      remainingIngredients[removedIngredientIndex - 1] ||
      remainingIngredients[0];

    setExpandedIngredientId(nextIngredient?.id || null);
  }

  return (
    <Card className="overflow-hidden">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/60">
              Step 2
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-stone-950">
              Ingredients
            </h2>

            <p className="mt-1 text-sm leading-6 text-stone-500">
              Add ingredients one at a time so the list stays easy to build on
              mobile.
            </p>

            {!isSectionExpanded ? (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium text-stone-600">
                  {completedIngredients.length === 1
                    ? "1 ingredient added"
                    : `${completedIngredients.length} ingredients added`}
                </p>

                {visibleIngredientChips.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {visibleIngredientChips.map((ingredient) => (
                      <span
                        key={ingredient.id}
                        className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-600"
                      >
                        {createIngredientLabel(ingredient)}
                      </span>
                    ))}

                    {remainingIngredientCount > 0 ? (
                      <span className="rounded-full border border-rv-plum/20 bg-rv-plum/5 px-3 py-1 text-xs font-semibold text-rv-plum">
                        +{remainingIngredientCount} more
                      </span>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-sm text-stone-500">
                    No ingredients added yet.
                  </p>
                )}
              </div>
            ) : null}
          </div>

          {!isSectionExpanded ? (
            <div className="w-full sm:w-auto">
              <Button
                type="button"
                variant="secondary"
                onClick={handleOpenSection}
                aria-expanded={isSectionExpanded}
              >
                Edit Ingredients
              </Button>
            </div>
          ) : null}
        </div>

        {isSectionExpanded ? (
          <div className="space-y-4 border-t border-stone-200 pt-4">
            <div className="space-y-3">
              {ingredients.map((ingredient, index) => {
                const isExpanded =
                  activeExpandedIngredientId === ingredient.id;

                const ingredientLabel = createIngredientLabel(ingredient);

                return (
                  <div
                    key={ingredient.id}
                    className={`overflow-hidden rounded-2xl border transition ${
                      isExpanded
                        ? "border-rv-plum/20 bg-white shadow-sm shadow-stone-900/5"
                        : "border-stone-200 bg-stone-50/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 p-4">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedIngredientId(
                            isExpanded ? null : ingredient.id
                          )
                        }
                        className="min-w-0 flex-1 text-left"
                        aria-expanded={isExpanded}
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rv-plum/75">
                          Ingredient {index + 1}
                        </p>

                        {!isExpanded ? (
                          <p className="mt-2 wrap-break-word text-base font-semibold leading-6 text-stone-900">
                            {ingredientLabel}
                          </p>
                        ) : null}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(ingredient.id)}
                        className="shrink-0 text-sm font-medium text-stone-500 transition hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>

                    {isExpanded ? (
                      <div className="space-y-4 border-t border-stone-200 bg-white p-4">
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            label="Quantity"
                            name="quantity"
                            value={ingredient.quantity}
                            onChange={(event) =>
                              onIngredientChange(
                                ingredient.id,
                                "quantity",
                                event.target.value
                              )
                            }
                            placeholder="2"
                          />

                          <label className="block space-y-2">
                            <span className="text-sm font-semibold text-stone-700">
                              Unit
                            </span>

                            <select
                              value={ingredient.unit}
                              onChange={(event) =>
                                onIngredientChange(
                                  ingredient.id,
                                  "unit",
                                  event.target.value
                                )
                              }
                              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 outline-none transition hover:border-stone-400 focus:border-rv-plum focus:ring-2 focus:ring-rv-plum/10 sm:text-sm"
                            >
                              {INGREDIENT_UNIT_OPTIONS.map((unit) => (
                                <option key={unit || "blank"} value={unit}>
                                  {unit || "No unit"}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>

                        <Input
                          label="Ingredient"
                          name="ingredient"
                          value={ingredient.ingredient}
                          onChange={(event) =>
                            onIngredientChange(
                              ingredient.id,
                              "ingredient",
                              event.target.value
                            )
                          }
                          placeholder="Flour"
                        />

                        <div className="flex justify-end border-t border-stone-200 pt-4">
                          <div className="w-full sm:w-auto">
                            <Button
                              type="button"
                              onClick={() => setExpandedIngredientId(null)}
                            >
                              Done
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 border-t border-stone-200 pt-4">
              <button
                type="button"
                onClick={handleAddIngredient}
                className="flex w-full items-center justify-center rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-rv-plum transition hover:bg-stone-50"
              >
                + Add Another Ingredient
              </button>

              <Button type="button" onClick={handleCloseSection}>
                Done with Ingredients
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}