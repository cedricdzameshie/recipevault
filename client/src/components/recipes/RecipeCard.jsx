import { Link } from "react-router-dom";
import Card from "../common/Card";

export default function RecipeCard({ recipe }) {
  return (
    <Link to={`/recipes/${recipe.id}`} className="block">
      <Card>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">{recipe.title}</h3>

          {recipe.description && (
            <p className="text-sm text-stone-600">{recipe.description}</p>
          )}

          <div className="text-xs text-stone-500">
            Servings: {recipe.servings}
          </div>
        </div>
      </Card>
    </Link>
  );
}