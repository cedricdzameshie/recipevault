import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import RecipeForm from "../components/recipe-form/RecipeForm";
import { createRecipe } from "../api/recipes";
import { fetchFolders } from "../api/folders";

function toNullableNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function buildRecipePayload(formValues) {
  return {
    title: formValues.title?.trim() || "",
    description: formValues.description?.trim() || "",
    servings: toNullableNumber(formValues.servings),
    prepTime: toNullableNumber(formValues.prepTime),
    cookTime: toNullableNumber(formValues.cookTime),
    notes: formValues.notes?.trim() || "",
    folderId: formValues.folderId || null,
    ingredients: (formValues.ingredients || [])
      .filter(
        (ingredient) =>
          ingredient.ingredient?.trim() ||
          ingredient.quantity?.trim() ||
          ingredient.unit?.trim()
      )
      .map((ingredient) => ({
        name: ingredient.ingredient?.trim() || "",
        quantity: ingredient.quantity?.trim() || null,
        unit: ingredient.unit?.trim() || null,
      }))
      .filter((ingredient) => ingredient.name),
    steps: (formValues.steps || [])
      .filter((step) => step.instruction?.trim())
      .map((step) => ({
        instruction: step.instruction.trim(),
      })),
  };
}

export default function NewRecipePage() {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadFolders() {
      try {
        const data = await fetchFolders();

        if (isMounted) {
          setFolders(data);
        }
      } catch (err) {
        console.error("Failed to load folders:", err);
      }
    }

    loadFolders();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmitRecipe(formValues) {
    try {
      setIsSaving(true);
      setError("");

      const payload = buildRecipePayload(formValues);
      const createdRecipe = await createRecipe(payload);

      navigate(`/recipes/${createdRecipe.id}`);
    } catch (err) {
      console.error("Failed to create recipe:", err);
      setError(err.message || "Failed to save recipe");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="New Recipe"
        description="Create and organize a new recipe."
        backTo="/recipes"
        backLabel="Back to Recipes"
      />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <RecipeForm
        submitLabel={isSaving ? "Saving..." : "Save Recipe"}
        onSubmitRecipe={handleSubmitRecipe}
        folders={folders}
      />
    </section>
  );
}