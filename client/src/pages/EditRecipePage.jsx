import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import RecipeForm from "../components/recipe-form/RecipeForm";
import { fetchRecipeById, updateRecipe } from "../api/recipes";
import { fetchFolders } from "../api/folders";
import { normalizeIngredientUnit } from "../utils/ingredientUnits";

function trimValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function toNullableNumber(value) {
  const trimmedValue = trimValue(value);

  if (!trimmedValue) {
    return null;
  }

  const parsed = Number(trimmedValue);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildRecipePayload(formValues) {
  return {
    title: trimValue(formValues.title),
    description: trimValue(formValues.description),
    servings: toNullableNumber(formValues.servings),
    prepTime: toNullableNumber(formValues.prepTime),
    cookTime: toNullableNumber(formValues.cookTime),
    notes: trimValue(formValues.notes),
    folderId: formValues.folderId || null,

    ingredients: (formValues.ingredients || [])
      .filter(
        (ingredient) =>
          trimValue(ingredient.ingredient) ||
          trimValue(ingredient.quantity) ||
          trimValue(ingredient.unit),
      )
      .map((ingredient) => ({
        id: ingredient.id || null,
        name: trimValue(ingredient.ingredient),
        quantity: trimValue(ingredient.quantity) || null,
        unit:
          normalizeIngredientUnit(trimValue(ingredient.unit)) || null,
      }))
      .filter((ingredient) => ingredient.name),

    steps: (formValues.steps || [])
      .filter((step) => trimValue(step.instruction))
      .map((step) => ({
        instruction: trimValue(step.instruction),
        prepNote: trimValue(step.prepNote),
        timerMinutes: toNullableNumber(step.timerMinutes),

        ingredients: (step.ingredients || [])
          .filter(
            (ingredient) =>
              ingredient.ingredientId ||
              trimValue(ingredient.ingredient) ||
              trimValue(ingredient.quantity) ||
              trimValue(ingredient.unit),
          )
          .map((ingredient) => ({
            ingredientId: ingredient.ingredientId || null,
            name: trimValue(ingredient.ingredient),
            quantity: trimValue(ingredient.quantity) || null,
            unit:
              normalizeIngredientUnit(trimValue(ingredient.unit)) ||
              null,
          }))
          .filter(
            (ingredient) =>
              ingredient.ingredientId || ingredient.name,
          ),
      })),
  };
}

export default function EditRecipePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");

  const returnTo = searchParams.get("returnTo");
  const step = searchParams.get("step");
  const isReturningToCooking = returnTo === "cook";

  const cookingReturnTo = step
    ? `/recipes/${id}/cook?step=${encodeURIComponent(step)}`
    : `/recipes/${id}/cook`;

  const cancelTo = isReturningToCooking
    ? cookingReturnTo
    : `/recipes/${id}`;

  useEffect(() => {
    let isActive = true;

    async function loadPageData() {
      try {
        setLoading(true);
        setLoadError("");
        setSaveError("");
        setRecipe(null);

        const [recipeData, foldersData] = await Promise.all([
          fetchRecipeById(id),
          fetchFolders(),
        ]);

        if (!isActive) {
          return;
        }

        setRecipe(recipeData);
        setFolders(foldersData);
      } catch (err) {
        console.error("Failed to load edit page data:", err);

        if (isActive) {
          setLoadError(err.message || "Failed to load recipe");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadPageData();

    return () => {
      isActive = false;
    };
  }, [id]);

  async function handleSubmitRecipe(formValues) {
    try {
      setIsSaving(true);
      setSaveError("");

      const normalizedPayload = buildRecipePayload(formValues);
      await updateRecipe(id, normalizedPayload);

      navigate(cancelTo, { replace: true });
    } catch (err) {
      console.error("Failed to update recipe:", err);
      setSaveError(err.message || "Failed to save changes");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="space-y-6">
        <PageHeader
          title="Edit Recipe"
          backTo={cancelTo}
          backLabel={
            isReturningToCooking
              ? "Back to Cooking"
              : "Back to Recipe"
          }
        />

        <div
          className="rounded-2xl border border-stone-200 bg-white px-5 py-8 text-center shadow-sm"
          aria-live="polite"
        >
          <p className="text-sm font-medium text-stone-600">
            Loading recipe...
          </p>
        </div>
      </section>
    );
  }

  if (!recipe) {
    return (
      <section className="space-y-6">
        <PageHeader
          title={loadError ? "Unable to Load Recipe" : "Recipe Not Found"}
          description={
            loadError || "We couldn't find the recipe you requested."
          }
          backTo="/recipes"
          backLabel="Back to Recipes"
        />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Edit Recipe"
        description={
          isReturningToCooking
            ? `Update ${recipe.title}, then return to cooking.`
            : `Update the details for ${recipe.title}.`
        }
        backTo={cancelTo}
        backLabel={
          isReturningToCooking
            ? "Back to Cooking"
            : "Back to Recipe"
        }
      />

      {saveError ? (
        <div
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {saveError}
        </div>
      ) : null}

      <RecipeForm
        initialData={recipe}
        submitLabel={
          isSaving ? "Saving Changes..." : "Save Changes"
        }
        cancelTo={cancelTo}
        onSubmitRecipe={handleSubmitRecipe}
        folders={folders}
      />
    </section>
  );
}