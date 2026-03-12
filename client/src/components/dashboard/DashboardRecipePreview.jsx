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
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-stone-900">
                {recipe.title}
              </h3>
              <p className="text-sm text-stone-600">
                {recipe.description}
              </p>
              <p className="text-xs text-stone-500">
                {recipe.servings} servings
              </p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}