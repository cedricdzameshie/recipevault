import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import RecipeGrid from "../components/recipes/RecipeGrid";
import { fetchRecipes } from "../api/recipes";
import { fetchFolders } from "../api/folders";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPageData() {
      try {
        setIsLoading(true);
        setError("");

        const [recipesData, foldersData] = await Promise.all([
          fetchRecipes(),
          fetchFolders(),
        ]);

        if (isMounted) {
          setRecipes(recipesData);
          setFolders(foldersData);
        }
      } catch (err) {
        console.error("Failed to load recipes page data:", err);

        if (isMounted) {
          setError(err.message || "Failed to load recipes");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPageData();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedFolder = folders.find(
    (folder) => folder.id === selectedFolderId
  );

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedFolderId || favoritesOnly
  );

  const filteredRecipes = useMemo(() => {
    let nextRecipes = [...recipes];

    if (searchQuery.trim()) {
      const normalizedQuery = searchQuery.trim().toLowerCase();

      nextRecipes = nextRecipes.filter((recipe) => {
        const folderName =
          recipe.folder?.name ||
          folders.find((folder) => folder.id === recipe.folderId)?.name ||
          "";

        const titleMatch = recipe.title
          ?.toLowerCase()
          .includes(normalizedQuery);

        const descriptionMatch = recipe.description
          ?.toLowerCase()
          .includes(normalizedQuery);

        const folderMatch = folderName.toLowerCase().includes(normalizedQuery);

        return titleMatch || descriptionMatch || folderMatch;
      });
    }

    if (favoritesOnly) {
      nextRecipes = nextRecipes.filter((recipe) => recipe.isFavorite);
    }

    if (selectedFolderId) {
      nextRecipes = nextRecipes.filter(
        (recipe) => recipe.folderId === selectedFolderId
      );
    }

    return nextRecipes.sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt)
    );
  }, [recipes, folders, searchQuery, favoritesOnly, selectedFolderId]);

  function clearFilters() {
    setSearchQuery("");
    setSelectedFolderId("");
    setFavoritesOnly(false);
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-5 pb-8 sm:space-y-6">
      <PageHeader
        title="Browse Recipes"
        description="Search, filter, and open your saved recipes."
        backTo="/dashboard"
        backLabel="Back to Dashboard"
      />

      <Card className="border-stone-300/70 bg-white/95">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/60">
              Quick Actions
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-stone-950">
              Build your recipe vault
            </h2>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              Add a recipe manually or import one from text or a URL.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link to="/recipes/new" className="w-full">
              <Button type="button">Add Recipe</Button>
            </Link>

            <Link to="/recipes/import" className="w-full">
              <Button type="button" variant="secondary">
                Import Recipe
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <Card className="border-stone-300/70 bg-white/95">
        <div className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/60">
                Find Recipes
              </p>

              <h2 className="mt-1 text-xl font-bold tracking-tight text-stone-950">
                Search and filter
              </h2>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                Search by title, description, or folder.
              </p>
            </div>

            <div className="rounded-full border border-stone-200 bg-rv-cream/60 px-3 py-1 text-sm font-semibold text-stone-600">
              {filteredRecipes.length}{" "}
              {filteredRecipes.length === 1 ? "recipe" : "recipes"}
            </div>
          </div>

          <Input
            label="Search Recipes"
            name="searchRecipes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, description, or folder"
          />

          <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
            <div className="space-y-2">
              <label
                htmlFor="folderFilter"
                className="text-sm font-semibold text-stone-700"
              >
                Folder
              </label>

              <select
                id="folderFilter"
                value={selectedFolderId}
                onChange={(e) => setSelectedFolderId(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 outline-none transition hover:border-stone-400 focus:border-rv-plum focus:ring-2 focus:ring-rv-plum/10 sm:text-sm"
              >
                <option value="">All Folders</option>

                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                variant={favoritesOnly ? "primary" : "secondary"}
                onClick={() => setFavoritesOnly((prev) => !prev)}
              >
                {favoritesOnly ? "Favorites On" : "Favorites Only"}
              </Button>
            </div>
          </div>

          {hasActiveFilters ? (
            <div className="rounded-2xl border border-stone-200 bg-rv-cream/45 p-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  {searchQuery.trim() ? (
                    <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600">
                      Search: {searchQuery.trim()}
                    </span>
                  ) : null}

                  {selectedFolder ? (
                    <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600">
                      Folder: {selectedFolder.name}
                    </span>
                  ) : null}

                  {favoritesOnly ? (
                    <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600">
                      Favorites
                    </span>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-semibold text-rv-plum transition hover:text-rv-plum/75"
                >
                  Clear filters
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </Card>

      {isLoading ? (
        <Card className="border-stone-300/70 bg-white/95">
          <p className="text-sm text-stone-600">Loading recipes...</p>
        </Card>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm"
        >
          {error}
        </div>
      ) : recipes.length === 0 ? (
        <Card className="border-stone-300/70 bg-white/95">
          <div className="space-y-4 text-center">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-stone-950">
                No recipes yet
              </h2>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                Add your first recipe manually or import one with AI.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link to="/recipes/new" className="w-full">
                <Button type="button">Add Recipe</Button>
              </Link>

              <Link to="/recipes/import" className="w-full">
                <Button type="button" variant="secondary">
                  Import Recipe
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : filteredRecipes.length === 0 ? (
        <Card className="border-stone-300/70 bg-white/95">
          <div className="space-y-3 text-center">
            <h2 className="text-xl font-bold tracking-tight text-stone-950">
              No recipes found
            </h2>

            <p className="text-sm leading-6 text-stone-500">
              Try changing your search, folder filter, or favorites filter.
            </p>

            <Button type="button" variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </Card>
      ) : (
        <RecipeGrid recipes={filteredRecipes} />
      )}
    </section>
  );
}