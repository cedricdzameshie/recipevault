import { Link } from "react-router-dom";
import Card from "../common/Card";
import DashboardSection from "./DashboardSection";

export default function DashboardRecipePreview({
  recipes = [],
  isLoading = false,
  error = "",
}) {
  return (
    <DashboardSection title="Recently Used">
      <div className="flex justify-end">
        <Link
          to="/recipes"
          className="text-sm font-semibold text-rv-plum transition hover:text-rv-plum/75"
        >
          Browse all recipes
        </Link>
      </div>

      {isLoading ? (
        <Card className="border-stone-300/70 bg-white/95">
          <p className="text-sm text-stone-600">
            Loading recently used recipes...
          </p>
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
                  <h3 className="text-lg font-semibold text-rv-plum">
                    {recipe.title}
                  </h3>

                  {recipe.description ? (
                    <p className="line-clamp-2 text-sm text-stone-600">
                      {recipe.description}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap gap-3 text-xs text-stone-500">
                    {recipe.servings ? (
                      <span>{recipe.servings} servings</span>
                    ) : null}

                    {recipe.prepTime ? (
                      <span>{recipe.prepTime} min prep</span>
                    ) : null}

                    {recipe.cookTime ? (
                      <span>{recipe.cookTime} min cook</span>
                    ) : null}
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