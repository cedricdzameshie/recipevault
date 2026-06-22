import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import PageHeader from "../components/common/PageHeader";
import {
  fetchRecipeById,
  deleteRecipeById,
  toggleFavoriteById,
  updateRecipeFolder,
} from "../api/recipes";
import { fetchFolders } from "../api/folders";
import {
  clearCookingProgress,
  getCookingProgress,
} from "../utils/cookingProgress";


export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [isUpdatingFolder, setIsUpdatingFolder] = useState(false);
  const [error, setError] = useState("");
  const [cookingProgress, setCookingProgress] = useState(null);
  useEffect(() => {
    let isMounted = true;

    async function loadRecipePage() {
      try {
        setIsLoading(true);
        setError("");

        const [recipeData, foldersData] = await Promise.all([
          fetchRecipeById(id),
          fetchFolders(),
        ]);

        if (isMounted) {
          setRecipe(recipeData);
          setFolders(foldersData);
          setSelectedFolderId(recipeData.folderId || "");
          setCookingProgress(getCookingProgress(recipeData.id));
        }
      } catch (err) {
        console.error("Failed to load recipe:", err);

        if (isMounted) {
          setError(err.message || "Failed to load recipe");
          setRecipe(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRecipePage();

    return () => {
      isMounted = false;
    };
  }, [id]);

  function handleStartOver() {
  if (!recipe) return;

  const confirmed = window.confirm(
    `Start "${recipe.title}" over from Step 1? Your saved cooking progress will be cleared.`
  );

  if (!confirmed) return;

  clearCookingProgress(recipe.id);
  setCookingProgress(null);

  navigate(`/recipes/${recipe.id}/cook?step=1`);
}

  async function handleDeleteRecipe() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${recipe.title}"?`
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteRecipeById(recipe.id);
      navigate("/recipes");await deleteRecipeById(recipe.id);
      clearCookingProgress(recipe.id);
      navigate("/recipes");
      
    } catch (err) {
      console.error("Failed to delete recipe:", err);
      alert(err.message || "Failed to delete recipe");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleToggleFavorite() {
    try {
      setIsTogglingFavorite(true);
      const updatedRecipe = await toggleFavoriteById(recipe.id);
      setRecipe(updatedRecipe);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      alert(err.message || "Failed to update favorite");
    } finally {
      setIsTogglingFavorite(false);
    }
  }

  async function handleUpdateFolder() {
    try {
      setIsUpdatingFolder(true);

      const updatedRecipe = await updateRecipeFolder(
        recipe.id,
        selectedFolderId || null
      );

      setRecipe(updatedRecipe);
      setSelectedFolderId(updatedRecipe.folderId || "");
    } catch (err) {
      console.error("Failed to update folder:", err);
      alert(err.message || "Failed to update folder");
    } finally {
      setIsUpdatingFolder(false);
    }
  }

  if (isLoading) {
    return (
      <section>
        <PageHeader
          title="Loading Recipe..."
          backTo="/recipes"
          backLabel="Back to Recipes"
        />
      </section>
    );
  }

  if (error || !recipe) {
    return (
      <section className="space-y-6">
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
        title={recipe.title}
        description={recipe.description || "A saved recipe from your RecipeVault."}
        backTo="/recipes"
        backLabel="Back to Recipes"
        action={
          <div className="flex flex-wrap gap-3">
            {cookingProgress ? (
  <>
    <Link to={`/recipes/${recipe.id}/cook`}>
      <Button>
        Resume Cooking — Step {cookingProgress.stepNumber}
      </Button>
    </Link>

    <Button
      type="button"
      variant="secondary"
      onClick={handleStartOver}
    >
      Start Over
    </Button>
  </>
) : (
  <Link to={`/recipes/${recipe.id}/cook?step=1`}>
    <Button>Start Cooking</Button>
  </Link>
)}

            <Link to={`/recipes/${recipe.id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>

            <Button
              type="button"
              variant={recipe.isFavorite ? "accent" : "secondary"}
              onClick={handleToggleFavorite}
              disabled={isTogglingFavorite}
            >
              {isTogglingFavorite
                ? "Saving..."
                : recipe.isFavorite
                ? "Unfavorite"
                : "Favorite"}
            </Button>

            <Button
              type="button"
              variant="danger"
              onClick={handleDeleteRecipe}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        }
      />

      <Card className="border-stone-300/70 bg-white/95">
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-rv-teal/25 bg-rv-teal/12 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/65">
                Current Folder
              </p>
              <p className="mt-2 text-lg font-semibold text-rv-plum">
                {recipe.folder?.name || "No Folder"}
              </p>
            </div>

            <div className="rounded-2xl border border-rv-teal/25 bg-rv-teal/12 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/65">
                Favorite Status
              </p>
              <p className="mt-2 text-lg font-semibold text-rv-plum">
                {recipe.isFavorite ? "Favorite" : "Not Favorite"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <label
                htmlFor="folderId"
                className="text-sm font-medium text-stone-700"
              >
                Add to Folder
              </label>

              <select
                id="folderId"
                value={selectedFolderId}
                onChange={(e) => setSelectedFolderId(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-rv-plum outline-none transition focus:border-rv-teal/60"
              >
                <option value="">No Folder</option>

                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={handleUpdateFolder}
              disabled={isUpdatingFolder}
            >
              {isUpdatingFolder ? "Saving..." : "Save Folder"}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="border-stone-300/70 bg-white/95">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/60">
              Servings
            </p>
            <p className="mt-2 text-2xl font-semibold text-rv-plum">
              {recipe.servings ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/60">
              Prep Time
            </p>
            <p className="mt-2 text-2xl font-semibold text-rv-plum">
              {recipe.prepTime ? `${recipe.prepTime} min` : "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/60">
              Cook Time
            </p>
            <p className="mt-2 text-2xl font-semibold text-rv-plum">
              {recipe.cookTime ? `${recipe.cookTime} min` : "—"}
            </p>
          </div>
        </div>
      </Card>

      <Card className="border-stone-300/70 bg-white/95">
        <h2 className="text-2xl font-semibold tracking-tight text-rv-plum">
          Recipe Ingredients
        </h2>

        {recipe.ingredients?.length > 0 ? (
          <ul className="mt-5 space-y-3">
            {recipe.ingredients.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-stone-200 bg-rv-cream/45 px-4 py-3 text-sm text-stone-700"
              >
                <span className="font-semibold text-rv-plum">
                  {[item.quantity, item.unit].filter(Boolean).join(" ")}
                </span>
                {item.quantity || item.unit ? " " : ""}
                {item.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-stone-600">No ingredients yet.</p>
        )}
      </Card>

      <Card className="border-stone-300/70 bg-white/95">
        <h2 className="text-2xl font-semibold tracking-tight text-rv-plum">
          Steps
        </h2>

        {recipe.steps?.length > 0 ? (
          <ol className="mt-5 space-y-4">
            {recipe.steps.map((step, index) => (
              <li
                key={step.id}
                className="rounded-2xl border border-stone-200 bg-rv-cream/45 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/60">
                  Step {index + 1}
                </p>

                <p className="mt-3 text-sm leading-6 text-stone-800">
                  {step.instruction}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-4 text-sm text-stone-600">No steps yet.</p>
        )}
      </Card>

      <Card className="border-stone-300/70 bg-white/95">
        <h2 className="text-2xl font-semibold tracking-tight text-rv-plum">
          Notes
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-700">
          {recipe.notes || "No notes yet."}
        </p>
      </Card>
    </section>
  );
}