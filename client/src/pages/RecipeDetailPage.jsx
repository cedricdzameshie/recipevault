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

  async function handleDeleteRecipe() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${recipe.title}"?`
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteRecipeById(recipe.id);
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
        description={recipe.description}
        backTo="/recipes"
        backLabel="Back to Recipes"
        action={
          <div className="flex flex-wrap gap-3">
            <Link to={`/recipes/${recipe.id}/cook?step=1`}>
              <Button>Start Cooking</Button>
            </Link>

            <Link to={`/recipes/${recipe.id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>

            <Button
              type="button"
              variant="secondary"
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
              variant="secondary"
              onClick={handleDeleteRecipe}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        }
      />

      <Card>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Current Folder
            </p>
            <p className="text-lg font-semibold text-stone-900">
              {recipe.folder?.name || "No Folder"}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Favorite Status
            </p>
            <p className="text-lg font-semibold text-stone-900">
              {recipe.isFavorite ? "Favorited" : "Not Favorited"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
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
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-400"
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
      </Card>

      <Card>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Servings
            </p>
            <p className="mt-1 text-lg font-semibold">
              {recipe.servings ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Prep Time
            </p>
            <p className="mt-1 text-lg font-semibold">
              {recipe.prepTime ? `${recipe.prepTime} min` : "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Cook Time
            </p>
            <p className="mt-1 text-lg font-semibold">
              {recipe.cookTime ? `${recipe.cookTime} min` : "—"}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">Recipe Ingredients</h2>

        {recipe.ingredients?.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {recipe.ingredients.map((item) => (
              <li key={item.id} className="text-sm text-stone-700">
                <span className="font-medium">
                  {[item.quantity, item.unit].filter(Boolean).join(" ")}
                </span>
                {item.quantity || item.unit ? " " : ""}
                {item.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-stone-700">No ingredients yet.</p>
        )}
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">Steps</h2>

        {recipe.steps?.length > 0 ? (
          <ol className="mt-4 space-y-4">
            {recipe.steps.map((step, index) => (
              <li
                key={step.id}
                className="rounded-2xl border border-stone-200 p-4"
              >
                <p className="text-sm font-medium text-stone-500">
                  Step {index + 1}
                </p>

                <p className="mt-2 text-sm text-stone-800">
                  {step.instruction}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-4 text-sm text-stone-700">No steps yet.</p>
        )}
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">Notes</h2>
        <p className="mt-4 text-sm text-stone-700">
          {recipe.notes || "No notes yet."}
        </p>
      </Card>
    </section>
  );
}