import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import PageHeader from "../components/common/PageHeader";
import { fetchRecipeById } from "../api/recipes";

export default function RecipeDetailPage() {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadRecipe() {
      try {
        setIsLoading(true);
        setError("");

        const data = await fetchRecipeById(id);

        if (isMounted) {
          setRecipe(data);
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

    loadRecipe();

    return () => {
      isMounted = false;
    };
  }, [id]);

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
          </div>
        }
      />

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