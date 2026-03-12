import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import RecipeBasicsFields from "./RecipeBasicsFields";
import IngredientsEditor from "./IngredientsEditor";
import StepsEditor from "./StepsEditor";
import NotesEditor from "./NotesEditor";

function createId() {
  return crypto.randomUUID();
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
      },
      ingredients: [createEmptyIngredient()],
      steps: [createEmptyStep()],
    };
  }

  return {
    formData: {
      title: initialData.title || "",
      description: initialData.description || "",
      servings: initialData.servings || "",
      prepTime: initialData.prepTime || "",
      cookTime: initialData.cookTime || "",
      notes: initialData.notes || "",
    },
    ingredients:
      initialData.ingredients?.length > 0
        ? initialData.ingredients
        : [createEmptyIngredient()],
    steps:
      initialData.steps?.length > 0
        ? initialData.steps
        : [createEmptyStep()],
  };
}

export default function RecipeForm({
  initialData = null,
  submitLabel = "Save Recipe",
  cancelTo = "/recipes",
  onSubmitRecipe,
}) {
  const normalized = normalizeInitialData(initialData);

  const [formData, setFormData] = useState(normalized.formData);
  const [ingredients, setIngredients] = useState(normalized.ingredients);
  const [steps, setSteps] = useState(normalized.steps);

  function handleBasicsChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleIngredientChange(id, field, value) {
    setIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  function handleAddIngredient() {
    setIngredients((prev) => [...prev, createEmptyIngredient()]);
  }

  function handleRemoveIngredient(id) {
    setIngredients((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((item) => item.id !== id);
    });
  }

  function handleStepChange(id, field, value) {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, [field]: value } : step))
    );
  }

  function handleAddStep() {
    setSteps((prev) => [...prev, createEmptyStep()]);
  }

  function handleRemoveStep(id) {
    setSteps((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((step) => step.id !== id);
    });
  }

  function handleStepIngredientChange(stepId, ingredientId, field, value) {
    setSteps((prev) =>
      prev.map((step) => {
        if (step.id !== stepId) return step;

        return {
          ...step,
          ingredients: step.ingredients.map((ingredient) =>
            ingredient.id === ingredientId
              ? { ...ingredient, [field]: value }
              : ingredient
          ),
        };
      })
    );
  }

  function handleAddStepIngredient(stepId) {
    setSteps((prev) =>
      prev.map((step) => {
        if (step.id !== stepId) return step;

        return {
          ...step,
          ingredients: [...step.ingredients, createEmptyStepIngredient()],
        };
      })
    );
  }

  function handleRemoveStepIngredient(stepId, ingredientId) {
    setSteps((prev) =>
      prev.map((step) => {
        if (step.id !== stepId) return step;

        if (step.ingredients.length === 1) return step;

        return {
          ...step,
          ingredients: step.ingredients.filter(
            (ingredient) => ingredient.id !== ingredientId
          ),
        };
      })
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <RecipeBasicsFields
        formData={formData}
        onChange={handleBasicsChange}
      />

      <IngredientsEditor
        ingredients={ingredients}
        onIngredientChange={handleIngredientChange}
        onAddIngredient={handleAddIngredient}
        onRemoveIngredient={handleRemoveIngredient}
      />

      <StepsEditor
        steps={steps}
        onStepChange={handleStepChange}
        onAddStep={handleAddStep}
        onRemoveStep={handleRemoveStep}
        onStepIngredientChange={handleStepIngredientChange}
        onAddStepIngredient={handleAddStepIngredient}
        onRemoveStepIngredient={handleRemoveStepIngredient}
      />

      <NotesEditor value={formData.notes} onChange={handleBasicsChange} />

      <div className="flex items-center justify-end gap-3">
        <Link
          to={cancelTo}
          className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
        >
          Cancel
        </Link>

        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}