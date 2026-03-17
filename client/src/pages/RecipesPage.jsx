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

  const filteredRecipes = useMemo(() => {
    let nextRecipes = [...recipes];

    if (searchQuery.trim()) {
      const normalizedQuery = searchQuery.trim().toLowerCase();

      nextRecipes = nextRecipes.filter((recipe) => {
        const titleMatch = recipe.title?.toLowerCase().includes(normalizedQuery);
        const descriptionMatch = recipe.description
          ?.toLowerCase()
          .includes(normalizedQuery);

        return titleMatch || descriptionMatch;
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
  }, [recipes, searchQuery, favoritesOnly, selectedFolderId]);

  function clearFilters() {
    setSearchQuery("");
    setSelectedFolderId("");
    setFavoritesOnly(false);
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Recipes"
        description="Browse, search, and organize your saved recipes."
        backTo="/dashboard"
        backLabel="Back to Dashboard"
        action={
          <Link to="/recipes/new">
            <Button>Add Recipe</Button>
          </Link>
        }
      />

      <Card>
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr_auto]">
            <Input
              label="Search Recipes"
              name="searchRecipes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or description"
            />

            <div className="space-y-2">
              <label
                htmlFor="folderFilter"
                className="text-sm font-medium text-stone-700"
              >
                Filter by Folder
              </label>

              <select
                id="folderFilter"
                value={selectedFolderId}
                onChange={(e) => setSelectedFolderId(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-400"
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
                {favoritesOnly ? "Showing Favorites" : "Favorites Only"}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>

            <p className="self-center text-sm text-stone-600">
              {filteredRecipes.length} recipe
              {filteredRecipes.length === 1 ? "" : "s"} found
            </p>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <Card>
          <p className="text-sm text-stone-600">Loading recipes...</p>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      ) : filteredRecipes.length === 0 ? (
        <Card>
          <div className="space-y-2">
            <p className="text-sm font-medium text-stone-900">
              No recipes matched your filters.
            </p>
            <p className="text-sm text-stone-600">
              Try changing your search, folder filter, or favorites filter.
            </p>
          </div>
        </Card>
      ) : (
        <RecipeGrid recipes={filteredRecipes} />
      )}
    </section>
  );
}