import { Link } from "react-router-dom";
import Card from "../common/Card";

export default function DashboardRecipePreview({ recipes = [] }) {
  if (!recipes.length) {
    return (
      <Card>
        <p className="text-sm text-stone-600">No recipes to show yet.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {recipes.map((recipe) => (
        <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="block">
          <Card>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-stone-900">
                  {recipe.title}
                </h3>

                {recipe.isFavorite ? (
                  <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-800">
                    Favorite
                  </span>
                ) : null}
              </div>

              <p className="text-sm text-stone-600">
                {recipe.description}
              </p>

              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>{recipe.servings} servings</span>
                {recipe.lastUsed ? <span>Last used: {recipe.lastUsed}</span> : null}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}