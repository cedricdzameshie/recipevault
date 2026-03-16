import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import RecipeForm from "../components/recipe-form/RecipeForm";
import { fetchRecipeById } from "../api/recipes";

export default function EditRecipePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const returnTo = searchParams.get("returnTo");
  const step = searchParams.get("step");

  const cancelTo =
    returnTo === "cook" && step
      ? `/recipes/${id}/cook?step=${step}`
      : `/recipes/${id}`;

  useEffect(() => {
    async function loadRecipe() {
      try {
        const data = await fetchRecipeById(id);
        setRecipe(data);
      } catch (err) {
        console.error("Failed to load recipe:", err);
      } finally {
        setLoading(false);
      }
    }

    loadRecipe();
  }, [id]);

  function handleSubmitRecipe(payload) {
    console.log("Updated recipe payload:", payload);

    if (returnTo === "cook" && step) {
      navigate(`/recipes/${id}/cook?step=${step}`);
      return;
    }

    navigate(`/recipes/${id}`);
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

      <RecipeForm
        initialData={recipe}
        submitLabel="Save Changes"
        cancelTo={cancelTo}
        onSubmitRecipe={handleSubmitRecipe}
      />
    </section>
  );
}