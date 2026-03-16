import { Link } from "react-router-dom";
import Card from "../common/Card";
import Button from "../common/Button";
import DashboardSection from "./DashboardSection";

export default function DashboardRecipePreview({
  recipes = [],
  isLoading = false,
  error = "",
}) {
  return (
    <DashboardSection
      title="Recent Recipes"
      action={
        <Link to="/recipes">
          <Button variant="secondary">View All</Button>
        </Link>
      }
    >
      {isLoading ? (
        <Card>
          <p className="text-sm text-stone-600">Loading recent recipes...</p>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      ) : recipes.length === 0 ? (
        <Card>
          <p className="text-sm text-stone-600">
            No recipes yet. Add your first recipe to see it here.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe) => (
            <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="block">
              <Card>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-stone-900">
                    {recipe.title}
                  </h3>

                  {recipe.description ? (
                    <p className="text-sm text-stone-600 line-clamp-2">
                      {recipe.description}
                    </p>
                  ) : (
                    <p className="text-sm text-stone-500">No description yet.</p>
                  )}

                  <div className="flex flex-wrap gap-3 text-xs text-stone-500">
                    <span>Servings: {recipe.servings ?? "—"}</span>
                    <span>Prep: {recipe.prepTime ? `${recipe.prepTime} min` : "—"}</span>
                    <span>Cook: {recipe.cookTime ? `${recipe.cookTime} min` : "—"}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </DashboardSection>
  );
}