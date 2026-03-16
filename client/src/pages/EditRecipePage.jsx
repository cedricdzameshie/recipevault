import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import RecipeForm from "../components/recipe-form/RecipeForm";
import { fetchRecipeById, updateRecipe } from "../api/recipes";

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

export default function EditRecipePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const returnTo = searchParams.get("returnTo");
  const step = searchParams.get("step");

  const cancelTo =
    returnTo === "cook" && step
      ? `/recipes/${id}/cook?step=${step}`
      : `/recipes/${id}`;

  useEffect(() => {
    async function loadRecipe() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchRecipeById(id);
        setRecipe(data);
      } catch (err) {
        console.error("Failed to load recipe:", err);
        setError(err.message || "Failed to load recipe");
      } finally {
        setLoading(false);
      }
    }

    loadRecipe();
  }, [id]);

  async function handleSubmitRecipe(payload) {
    try {
      setIsSaving(true);
      setError("");

      const normalizedPayload = buildRecipePayload(payload);
      await updateRecipe(id, normalizedPayload);

      if (returnTo === "cook" && step) {
        navigate(`/recipes/${id}/cook?step=${step}`);
        return;
      }

      navigate(`/recipes/${id}`);
    } catch (err) {
      console.error("Failed to update recipe:", err);
      setError(err.message || "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <section>
        <p className="text-sm text-stone-500">Loading recipe...</p>
      </section>
    );
  }

  if (!recipe) {
    return (
      <section>
        <PageHeader
          title="Recipe Not Found"
          description={error || "We couldn't find that recipe."}
          backTo="/recipes"
          backLabel="Back to Recipes"
        />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title={`Edit ${recipe.title}`}
        description="Update recipe details and continue where you left off."
        backTo={cancelTo}
        backLabel={
          returnTo === "cook" && step ? "Back to Cooking" : "Back to Recipe"
        }
      />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <RecipeForm
        initialData={recipe}
        submitLabel={isSaving ? "Saving Changes..." : "Save Changes"}
        cancelTo={cancelTo}
        onSubmitRecipe={handleSubmitRecipe}
      />
    </section>
  );
}