import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import RecipeGrid from "../components/recipes/RecipeGrid";
import { fetchRecipes } from "../api/recipes";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await fetchRecipes();
        setRecipes(data);
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
      } finally {
        setLoading(false);
      }
    }

    loadRecipes();
  }, []);

  return (
    <section className="space-y-6">
      <PageHeader
        title="Recipes"
        description="Browse and manage your saved recipes."
        backTo="/dashboard"
        backLabel="Back to Dashboard"
        action={
          <Link to="/recipes/new">
            <Button>Add Recipe</Button>
          </Link>
        }
      />

      {loading ? (
        <p className="text-sm text-stone-500">Loading recipes...</p>
      ) : recipes.length === 0 ? (
        <p className="text-sm text-stone-500">No recipes yet.</p>
      ) : (
        <RecipeGrid recipes={recipes} />
      )}
    </section>
  );
}