import { Link } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import RecipeGrid from "../components/recipes/RecipeGrid";

export default function RecipesPage() {
  const recipes = [
    {
      id: 1,
      title: "Sourdough Bread",
      description: "Classic fermented sourdough loaf",
      servings: 4,
    },
    {
      id: 2,
      title: "Focaccia",
      description: "Olive oil bread with herbs",
      servings: 6,
    },
    {
      id: 3,
      title: "Cinnamon Rolls",
      description: "Sweet bakery rolls",
      servings: 8,
    },
  ];

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

      <RecipeGrid recipes={recipes} />
    </section>
  );
}