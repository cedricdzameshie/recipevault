import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
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

        const favorites = data.filter(
          (recipe) => recipe.isFavorite,
        );

        if (isMounted) {
          setRecipes(favorites);
        }
      } catch (err) {
        console.error("Failed to load favorites:", err);

        if (isMounted) {
          setError(
            err.message || "Failed to load favorites",
          );
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

  const dashboardLink = (
    <Link
      to="/dashboard"
      className={[
        "inline-flex items-center gap-2",
        "text-sm font-semibold text-rv-plum",
        "transition hover:opacity-75",
        "focus:outline-none focus-visible:ring-2",
        "focus-visible:ring-rv-plum focus-visible:ring-offset-2",
        "rounded-lg",
      ].join(" ")}
    >
      <span aria-hidden="true">←</span>
      Back to Dashboard
    </Link>
  );

  if (isLoading) {
    return (
      <section className="space-y-4">
        {dashboardLink}

        <PageHeader
          title="Favorites"
          description="Loading favorites..."
        />
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4">
        {dashboardLink}

        <PageHeader
          title="Favorites"
          description={error}
        />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {dashboardLink}

      <PageHeader
        title="Favorites"
        description="Your saved favorite recipes."
      />

      {recipes.length > 0 ? (
        <RecipeGrid recipes={recipes} />
      ) : (
        <p className="text-sm text-stone-600">
          No favorite recipes yet. Mark a recipe as favorite to see it here.
        </p>
      )}
    </section>
  );
}