import { Link } from "react-router-dom";
import Card from "../common/Card";

export default function RecipeCard({ recipe }) {
  return (
    <Link to={`/recipes/${recipe.id}`} className="block">
      <Card>
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-medium text-stone-900">{recipe.title}</h3>

            {recipe.isFavorite ? (
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-800">
                Favorite
              </span>
            ) : null}
          </div>

          {recipe.description ? (
            <p className="text-sm text-stone-600">{recipe.description}</p>
          ) : (
            <p className="text-sm text-stone-500">No description yet.</p>
          )}

          <div className="flex flex-wrap gap-3 text-xs text-stone-500">
            <span>Servings: {recipe.servings ?? "—"}</span>
            <span>Folder: {recipe.folder?.name || "None"}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}