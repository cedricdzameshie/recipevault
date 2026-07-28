import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import RecipeGrid from "../components/recipes/RecipeGrid";
import { fetchFolders } from "../api/folders";

export default function FolderDetailPage() {
  const { id } = useParams();

  const [folder, setFolder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadFolder() {
      try {
        setIsLoading(true);
        setError("");

        const folders = await fetchFolders();
        const matchedFolder = folders.find((item) => item.id === id);

        if (isMounted) {
          setFolder(matchedFolder || null);
        }
      } catch (err) {
        console.error("Failed to load folder:", err);

        if (isMounted) {
          setError(err.message || "Failed to load folder");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFolder();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const recipes = useMemo(() => {
    const folderRecipes = folder?.recipes || [];

    return [...folderRecipes].sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt)
    );
  }, [folder]);

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-5xl space-y-5 pb-8 sm:space-y-6">
        <PageHeader
          title="Loading Folder..."
          backTo="/folders"
          backLabel="Back to Folders"
        />

        <Card className="border-stone-300/70 bg-white/95">
          <p className="text-sm text-stone-600">Loading recipes...</p>
        </Card>
      </section>
    );
  }

  if (error || !folder) {
    return (
      <section className="mx-auto w-full max-w-5xl space-y-5 pb-8 sm:space-y-6">
        <PageHeader
          title="Folder Not Found"
          description={error || "We couldn't find that folder."}
          backTo="/folders"
          backLabel="Back to Folders"
        />

        <Card className="border-stone-300/70 bg-white/95">
          <div className="space-y-4 text-center">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-stone-950">
                We could not open this folder
              </h2>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                It may have been deleted or moved.
              </p>
            </div>

            <Link to="/folders" className="block">
              <Button type="button" variant="secondary">
                Back to Folders
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-5 pb-8 sm:space-y-6">
      <PageHeader
        title={folder.name}
        description="Browse the recipes saved in this folder."
        backTo="/folders"
        backLabel="Back to Folders"
      />

      <Card className="border-stone-300/70 bg-white/95">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/60">
                Folder Collection
              </p>

              <h2 className="mt-1 text-xl font-bold tracking-tight text-stone-950">
                {folder.name}
              </h2>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}{" "}
                saved here.
              </p>
            </div>

            <div className="rounded-full border border-stone-200 bg-rv-cream/60 px-3 py-1 text-sm font-semibold text-stone-600">
              {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link to={`/recipes/new?folderId=${folder.id}`} className="w-full">
              <Button type="button">Add Recipe</Button>
            </Link>

            <Link to="/recipes" className="w-full">
              <Button type="button" variant="secondary">
                Browse All
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {recipes.length > 0 ? (
        <RecipeGrid recipes={recipes} />
      ) : (
        <Card className="border-stone-300/70 bg-white/95">
          <div className="space-y-4 text-center">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-stone-950">
                No recipes in this folder yet
              </h2>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                Add a new recipe to this folder or browse your saved recipes and
                organize them from the recipe detail page.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link to={`/recipes/new?folderId=${folder.id}`} className="w-full">
                <Button type="button">Add Recipe</Button>
              </Link>

              <Link to="/recipes" className="w-full">
                <Button type="button" variant="secondary">
                  Browse Recipes
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </section>
  );
}