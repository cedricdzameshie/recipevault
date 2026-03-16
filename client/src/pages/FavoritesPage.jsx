import { useEffect, useState } from "react";
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

  if (isLoading) {
    return (
      <section>
        <PageHeader title="Favorites" description="Loading favorites..." />
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <PageHeader title="Favorites" description={error} />
      </section>
    );
  }

  return (
    <section className="space-y-6">
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