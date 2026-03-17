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
    <DashboardSection title="Recent Recipes">
      <div className="flex justify-end">
        <Link to="/recipes">
          <Button variant="secondary">View All</Button>
        </Link>
      </div>

      {isLoading ? (
        <Card className="border-stone-300/70 bg-white/95">
          <p className="text-sm text-stone-600">Loading recent recipes...</p>
        </Card>
      ) : error ? (
        <Card className="border-stone-300/70 bg-white/95">
          <p className="text-sm text-rv-coral">{error}</p>
        </Card>
      ) : recipes.length === 0 ? (
        <Card className="border-stone-300/70 bg-white/95">
          <p className="text-sm text-stone-600">
            No recipes yet. Add your first recipe to see it here.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipes/${recipe.id}`}
              className="block"
            >
              <Card className="border-stone-300/70 bg-white/95 hover:border-rv-teal/40">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-rv-plum">
                      {recipe.title}
                    </h3>

                    {recipe.isFavorite ? (
                      <span className="rounded-full border border-rv-teal/30 bg-rv-teal/20 px-3 py-1 text-xs font-medium text-rv-plum">
                        Favorite
                      </span>
                    ) : null}
                  </div>

                  {recipe.description ? (
                    <p className="text-sm text-stone-600 line-clamp-2">
                      {recipe.description}
                    </p>
                  ) : (
                    <p className="text-sm text-stone-500">
                      No description yet.
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 text-xs text-stone-500">
                    <span>Servings: {recipe.servings ?? "—"}</span>
                    <span>
                      Prep: {recipe.prepTime ? `${recipe.prepTime} min` : "—"}
                    </span>
                    <span>
                      Cook: {recipe.cookTime ? `${recipe.cookTime} min` : "—"}
                    </span>
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