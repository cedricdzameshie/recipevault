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
      ingredient.name?.trim()
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

function createCustomIngredientLabel(ingredient) {
  return formatIngredient(ingredient) || "Custom ingredient — add details";
}

function getFirstEmptyCustomIngredient(ingredients) {
  return ingredients.find(
    (ingredient) =>
      !ingredient.ingredientId &&
      !ingredient.quantity?.trim() &&
      !ingredient.unit?.trim() &&
      !ingredient.ingredient?.trim() &&
      !ingredient.name?.trim()
  );
}

export default function StepIngredientsEditor({
  recipeIngredients = [],
  ingredients = [],
  onIngredientChange,
  onAddIngredient,
  onAddLinkedIngredient,
  onRemoveIngredient,
}) {
  const [selectedRecipeIngredientId, setSelectedRecipeIngredientId] =
    useState("");
  const [customIngredientId, setCustomIngredientId] = useState(null);

  const linkedIngredientIds = new Set(
    ingredients
      .map((ingredient) => ingredient.ingredientId)
      .filter(Boolean)
  );

  const availableRecipeIngredients = recipeIngredients.filter(
    (ingredient) =>
      ingredient.ingredient?.trim() && !linkedIngredientIds.has(ingredient.id)
  );

  const completedIngredients = ingredients.filter(hasIngredientContent);

  const linkedStepIngredients = completedIngredients.filter(
    (ingredient) => ingredient.ingredientId
  );

  const customStepIngredients = completedIngredients.filter(
    (ingredient) => !ingredient.ingredientId
  );

  const activeCustomIngredient = ingredients.find(
    (ingredient) => ingredient.id === customIngredientId
  );

  function getRecipeIngredient(ingredientId) {
    return recipeIngredients.find((ingredient) => ingredient.id === ingredientId);
  }

  function getDisplayIngredient(stepIngredient) {
    if (!stepIngredient.ingredientId) {
      return stepIngredient;
    }

    const recipeIngredient = getRecipeIngredient(stepIngredient.ingredientId);

    return recipeIngredient || stepIngredient;
  }

  function handleAttachRecipeIngredient() {
    if (!selectedRecipeIngredientId) {
      return;
    }

    const selectedIngredient = getRecipeIngredient(selectedRecipeIngredientId);

    if (!selectedIngredient) {
      return;
    }

    onAddLinkedIngredient(selectedIngredient);
    setSelectedRecipeIngredientId("");
  }

  function handleAddCustomIngredient() {
    const emptyIngredient = getFirstEmptyCustomIngredient(ingredients);

    if (emptyIngredient) {
      setCustomIngredientId(emptyIngredient.id);
      return;
    }

    const newIngredientId = onAddIngredient();

    if (newIngredientId) {
      setCustomIngredientId(newIngredientId);
    }
  }

  function handleRemoveIngredient(ingredientId) {
    onRemoveIngredient(ingredientId);

    if (customIngredientId === ingredientId) {
      setCustomIngredientId(null);
    }
  }

  return (
    <div className="space-y-4">
      {completedIngredients.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
            Attached
          </p>

          <div className="space-y-2">
            {linkedStepIngredients.map((ingredient) => {
              const displayIngredient = getDisplayIngredient(ingredient);

              return (
                <div
                  key={ingredient.id}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="wrap-break-word text-sm font-bold text-stone-900">
                      {formatIngredient(displayIngredient)}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-stone-500">
                      From the main recipe list
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(ingredient.id)}
                    className="shrink-0 text-sm font-medium text-stone-500 transition hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              );
            })}

            {customStepIngredients.map((ingredient) => {
              const isEditing = customIngredientId === ingredient.id;

              return (
                <div
                  key={ingredient.id}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50/80"
                >
                  <div className="flex items-start justify-between gap-3 px-4 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        setCustomIngredientId(isEditing ? null : ingredient.id)
                      }
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="wrap-break-word text-sm font-bold text-stone-900">
                        {createCustomIngredientLabel(ingredient)}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-stone-500">
                        Custom to this step
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(ingredient.id)}
                      className="shrink-0 text-sm font-medium text-stone-500 transition hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3 border-t border-stone-200 bg-white p-4">
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
                        placeholder="Eggs"
                      />

                      <Button
                        type="button"
                        onClick={() => setCustomIngredientId(null)}
                      >
                        Done
                      </Button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50/80 px-4 py-5 text-center">
          <p className="text-sm font-semibold text-stone-800">
            No ingredients attached to this step yet.
          </p>

          <p className="mt-1 text-xs leading-5 text-stone-500">
            Attach from the recipe list or add something custom only for this
            step.
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-stone-200 bg-white p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
          Add from recipe
        </p>

        {availableRecipeIngredients.length > 0 ? (
          <div className="mt-3 space-y-3">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-stone-700">
                Recipe ingredient
              </span>

              <select
                value={selectedRecipeIngredientId}
                onChange={(event) =>
                  setSelectedRecipeIngredientId(event.target.value)
                }
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 outline-none transition hover:border-stone-400 focus:border-rv-plum focus:ring-2 focus:ring-rv-plum/10 sm:text-sm"
              >
                <option value="">Choose an ingredient</option>

                {availableRecipeIngredients.map((ingredient) => (
                  <option key={ingredient.id} value={ingredient.id}>
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
          <p className="mt-2 text-sm leading-6 text-stone-500">
            All recipe ingredients are already attached to this step.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleAddCustomIngredient}
        className="flex w-full items-center justify-center rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-rv-plum transition hover:bg-stone-50"
      >
        + Add Custom Ingredient
      </button>

      {activeCustomIngredient &&
      !customStepIngredients.some(
        (ingredient) => ingredient.id === activeCustomIngredient.id
      ) ? (
        <div className="overflow-hidden rounded-2xl border border-rv-plum/20 bg-white shadow-sm shadow-stone-900/5">
          <div className="flex items-start justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-stone-900">
                Custom ingredient
              </p>

              <p className="mt-1 text-xs leading-5 text-stone-500">
                Only used during this step
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleRemoveIngredient(activeCustomIngredient.id)}
              className="shrink-0 text-sm font-medium text-stone-500 transition hover:text-red-600"
            >
              Remove
            </button>
          </div>

          <div className="space-y-3 border-t border-stone-200 bg-white p-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Quantity"
                name="quantity"
                value={activeCustomIngredient.quantity}
                onChange={(event) =>
                  onIngredientChange(
                    activeCustomIngredient.id,
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
                  value={activeCustomIngredient.unit}
                  onChange={(event) =>
                    onIngredientChange(
                      activeCustomIngredient.id,
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
              value={activeCustomIngredient.ingredient}
              onChange={(event) =>
                onIngredientChange(
                  activeCustomIngredient.id,
                  "ingredient",
                  event.target.value
                )
              }
              placeholder="Eggs"
            />

            <Button type="button" onClick={() => setCustomIngredientId(null)}>
              Done
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}