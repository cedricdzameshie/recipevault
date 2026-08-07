import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import RecipeGrid from "../components/recipes/RecipeGrid";
import { fetchRecipes } from "../api/recipes";

export default function FavoritesPage() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadFavorites() {
      try {
        setIsLoading(true);
        setError("");

        const data = await fetchRecipes();

        const favorites = data.filter((recipe) => recipe.isFavorite);

        if (isMounted) {
          setRecipes(favorites);
        }
      } catch (err) {
        console.error("Failed to load favorites:", err);

        if (isMounted) {
          setError(err.message || "Failed to load favorites");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedFavorites = useMemo(() => {
    return [...recipes].sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt)
    );
  }, [recipes]);

  return (
    <section className="mx-auto w-full max-w-5xl space-y-5 pb-8 sm:space-y-6">
      <PageHeader
        title="Favorites"
        description="Quickly return to the recipes you love most."
        backTo="/dashboard"
        backLabel="Back to Dashboard"
      />

      <Card className="border-stone-300/70 bg-white/95">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/60">
                Favorite Recipes
              </p>

              <h2 className="mt-1 text-xl font-bold tracking-tight text-stone-950">
                Your saved favorites
              </h2>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                Recipes marked as favorites will appear here for faster access.
              </p>
            </div>

            <div className="rounded-full border border-stone-200 bg-rv-cream/60 px-3 py-1 text-sm font-semibold text-stone-600">
              {sortedFavorites.length}{" "}
              {sortedFavorites.length === 1 ? "favorite" : "favorites"}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
  <Link to="/recipes">
    <Button type="button" variant="secondary">
      Browse Recipes
    </Button>
  </Link>

  <Link to="/recipes/new">
    <Button type="button">Add Recipe</Button>
  </Link>
</div>
        </div>
      </Card>

      {isLoading ? (
        <Card className="border-stone-300/70 bg-white/95">
          <p className="text-sm text-stone-600">Loading favorites...</p>
        </Card>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm"
        >
          {error}
        </div>
      ) : sortedFavorites.length > 0 ? (
        <RecipeGrid recipes={sortedFavorites} />
      ) : (
        <Card className="border-stone-300/70 bg-white/95">
          <div className="space-y-4 text-center">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-stone-950">
                No favorite recipes yet
              </h2>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                Mark recipes as favorites from the recipe detail page, then they
                will show up here.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
  <Link to="/recipes">
    <Button type="button" variant="secondary">
      Browse Recipes
    </Button>
  </Link>

  <Link to="/recipes/new">
    <Button type="button">Add Recipe</Button>
  </Link>
</div>
          </div>
        </Card>
      )}
    </section>
  );
}