import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import RecipeBasicsFields from "./RecipeBasicsFields";
import IngredientsEditor from "./IngredientsEditor";
import StepsEditor from "./StepsEditor";
import NotesEditor from "./NotesEditor";
import { normalizeIngredientUnit } from "../../utils/ingredientUnits";

function createId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (character) => {
      const randomValue = Math.floor(Math.random() * 16);
      const value =
        character === "x"
          ? randomValue
          : (randomValue & 0x3) | 0x8;

      return value.toString(16);
    },
  );
}

function toFormValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function createEmptyIngredient() {
  return {
    id: createId(),
    quantity: "",
    unit: "",
    ingredient: "",
  };
}

function createEmptyStepIngredient() {
  return {
    id: createId(),
    ingredientId: null,
    quantity: "",
    unit: "",
    ingredient: "",
  };
}

function createEmptyStep() {
  return {
    id: createId(),
    instruction: "",
    prepNote: "",
    timerMinutes: "",
    ingredients: [createEmptyStepIngredient()],
  };
}

function normalizeInitialData(initialData) {
  if (!initialData) {
    return {
      formData: {
        title: "",
        description: "",
        servings: "",
        prepTime: "",
        cookTime: "",
        notes: "",
        folderId: "",
      },
      ingredients: [createEmptyIngredient()],
      steps: [createEmptyStep()],
    };
  }

  return {
    formData: {
      title: toFormValue(initialData.title),
      description: toFormValue(initialData.description),
      servings: toFormValue(initialData.servings),
      prepTime: toFormValue(initialData.prepTime),
      cookTime: toFormValue(initialData.cookTime),
      notes: toFormValue(initialData.notes),
      folderId: toFormValue(initialData.folderId),
    },

    ingredients:
      initialData.ingredients?.length > 0
        ? initialData.ingredients.map((ingredient) => ({
            id: ingredient.id || createId(),
            quantity: toFormValue(ingredient.quantity),
            unit:
              normalizeIngredientUnit(
                toFormValue(ingredient.unit),
              ) || "",
            ingredient: toFormValue(
              ingredient.name || ingredient.ingredient,
            ),
          }))
        : [createEmptyIngredient()],

    steps:
      initialData.steps?.length > 0
        ? initialData.steps.map((step) => ({
            id: step.id || createId(),
            instruction: toFormValue(step.instruction),
            prepNote: toFormValue(step.prepNote),
            timerMinutes: toFormValue(step.timerMinutes),

            ingredients:
              step.ingredients?.length > 0
                ? step.ingredients.map((ingredient) => ({
                    id: ingredient.id || createId(),
                    ingredientId:
                      ingredient.ingredientId || null,
                    quantity: toFormValue(ingredient.quantity),
                    unit:
                      normalizeIngredientUnit(
                        toFormValue(ingredient.unit),
                      ) || "",
                    ingredient: toFormValue(
                      ingredient.ingredient?.name ||
                        ingredient.name ||
                        (typeof ingredient.ingredient === "string"
                          ? ingredient.ingredient
                          : ""),
                    ),
                  }))
                : [createEmptyStepIngredient()],
          }))
        : [createEmptyStep()],
  };
}

export default function RecipeForm({
  initialData = null,
  submitLabel = "Save Recipe",
  cancelTo = "/recipes",
  onSubmitRecipe,
  folders = [],
  isSubmitting = false,
}) {
  const [normalized] = useState(() =>
    normalizeInitialData(initialData),
  );

  const [formData, setFormData] = useState(normalized.formData);
  const [ingredients, setIngredients] = useState(
    normalized.ingredients,
  );
  const [steps, setSteps] = useState(normalized.steps);

  function handleBasicsChange(event) {
    const { name, value } = event.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
  }

  function handleIngredientChange(id, field, value) {
    setIngredients((previousIngredients) =>
      previousIngredients.map((ingredient) =>
        ingredient.id === id
          ? {
              ...ingredient,
              [field]: value,
            }
          : ingredient,
      ),
    );
  }

  function handleAddIngredient() {
    const newIngredient = createEmptyIngredient();

    setIngredients((previousIngredients) => [
      ...previousIngredients,
      newIngredient,
    ]);

    return newIngredient.id;
  }

  function handleRemoveIngredient(id) {
    if (ingredients.length === 1) {
      return;
    }

    setIngredients((previousIngredients) =>
      previousIngredients.filter(
        (ingredient) => ingredient.id !== id,
      ),
    );

    setSteps((previousSteps) =>
      previousSteps.map((step) => {
        const hasLinkedIngredient = step.ingredients.some(
          (ingredient) => ingredient.ingredientId === id,
        );

        if (!hasLinkedIngredient) {
          return step;
        }

        const remainingIngredients = step.ingredients.filter(
          (ingredient) => ingredient.ingredientId !== id,
        );

        return {
          ...step,
          ingredients:
            remainingIngredients.length > 0
              ? remainingIngredients
              : [createEmptyStepIngredient()],
        };
      }),
    );
  }

  function handleStepChange(stepId, field, value) {
    setSteps((previousSteps) =>
      previousSteps.map((step) =>
        step.id === stepId
          ? {
              ...step,
              [field]: value,
            }
          : step,
      ),
    );
  }

  function handleAddStep() {
    const newStep = createEmptyStep();

    setSteps((previousSteps) => [...previousSteps, newStep]);

    return newStep.id;
  }

  function handleRemoveStep(stepId) {
    if (steps.length === 1) {
      return;
    }

    setSteps((previousSteps) =>
      previousSteps.filter((step) => step.id !== stepId),
    );
  }

  function handleStepIngredientChange(
    stepId,
    ingredientId,
    field,
    value,
  ) {
    setSteps((previousSteps) =>
      previousSteps.map((step) => {
        if (step.id !== stepId) {
          return step;
        }

        return {
          ...step,
          ingredients: step.ingredients.map((ingredient) =>
            ingredient.id === ingredientId
              ? {
                  ...ingredient,
                  [field]: value,
                }
              : ingredient,
          ),
        };
      }),
    );
  }

  function handleAddStepIngredient(stepId) {
    const newIngredient = createEmptyStepIngredient();

    setSteps((previousSteps) =>
      previousSteps.map((step) => {
        if (step.id !== stepId) {
          return step;
        }

        return {
          ...step,
          ingredients: [...step.ingredients, newIngredient],
        };
      }),
    );

    return newIngredient.id;
  }

  function handleAddLinkedStepIngredient(
    stepId,
    recipeIngredient,
  ) {
    setSteps((previousSteps) =>
      previousSteps.map((step) => {
        if (step.id !== stepId) {
          return step;
        }

        const isAlreadyLinked = step.ingredients.some(
          (stepIngredient) =>
            stepIngredient.ingredientId === recipeIngredient.id,
        );

        if (isAlreadyLinked) {
          return step;
        }

        const linkedIngredient = {
          id: createId(),
          ingredientId: recipeIngredient.id,
          quantity: "",
          unit: "",
          ingredient: recipeIngredient.ingredient,
        };

        const hasEmptyIngredientRow = step.ingredients.some(
          (stepIngredient) =>
            !stepIngredient.ingredientId &&
            !stepIngredient.quantity?.trim() &&
            !stepIngredient.unit?.trim() &&
            !stepIngredient.ingredient?.trim(),
        );

        if (hasEmptyIngredientRow) {
          let replacedEmptyRow = false;

          return {
            ...step,
            ingredients: step.ingredients.map(
              (stepIngredient) => {
                const isEmptyRow =
                  !stepIngredient.ingredientId &&
                  !stepIngredient.quantity?.trim() &&
                  !stepIngredient.unit?.trim() &&
                  !stepIngredient.ingredient?.trim();

                if (isEmptyRow && !replacedEmptyRow) {
                  replacedEmptyRow = true;
                  return linkedIngredient;
                }

                return stepIngredient;
              },
            ),
          };
        }

        return {
          ...step,
          ingredients: [
            ...step.ingredients,
            linkedIngredient,
          ],
        };
      }),
    );
  }

  function handleRemoveStepIngredient(stepId, ingredientId) {
    setSteps((previousSteps) =>
      previousSteps.map((step) => {
        if (step.id !== stepId) {
          return step;
        }

        const remainingIngredients = step.ingredients.filter(
          (ingredient) => ingredient.id !== ingredientId,
        );

        return {
          ...step,
          ingredients:
            remainingIngredients.length > 0
              ? remainingIngredients
              : [createEmptyStepIngredient()],
        };
      }),
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const payload = {
      ...formData,
      ingredients,
      steps,
    };

    if (onSubmitRecipe) {
      onSubmitRecipe(payload);
      return;
    }

    console.log("Recipe form submit:", payload);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 sm:space-y-6"
      aria-busy={isSubmitting}
    >
      <RecipeBasicsFields
        formData={formData}
        onChange={handleBasicsChange}
        folders={folders}
      />

      <IngredientsEditor
        ingredients={ingredients}
        onIngredientChange={handleIngredientChange}
        onAddIngredient={handleAddIngredient}
        onRemoveIngredient={handleRemoveIngredient}
      />

      <StepsEditor
        recipeIngredients={ingredients}
        steps={steps}
        onStepChange={handleStepChange}
        onAddStep={handleAddStep}
        onRemoveStep={handleRemoveStep}
        onStepIngredientChange={handleStepIngredientChange}
        onAddStepIngredient={handleAddStepIngredient}
        onAddLinkedStepIngredient={handleAddLinkedStepIngredient}
        onRemoveStepIngredient={handleRemoveStepIngredient}
      />

      <NotesEditor
        value={formData.notes}
        onChange={handleBasicsChange}
      />

      <div className="sticky bottom-3 z-20 -mx-1 flex flex-col gap-2 rounded-2xl border border-stone-200/80 bg-white/95 p-2 shadow-lg shadow-stone-900/10 backdrop-blur sm:static sm:mx-0 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-0 *:w-full sm:*:w-auto">
        <Link
          to={cancelTo}
          onClick={(event) => {
            if (isSubmitting) {
              event.preventDefault();
            }
          }}
          aria-disabled={isSubmitting}
          tabIndex={isSubmitting ? -1 : undefined}
          className={`inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition ${
            isSubmitting
              ? "cursor-not-allowed opacity-60"
              : "hover:bg-stone-100"
          }`}
        >
          Cancel
        </Link>

        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}