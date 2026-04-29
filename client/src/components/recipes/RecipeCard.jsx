import { Link } from "react-router-dom";
import Card from "../common/Card";

export default function RecipeCard({ recipe }) {
  return (
    <Link to={`/recipes/${recipe.id}`} className="block">
      <Card className="border-stone-300/70 bg-white/95 hover:border-rv-teal/40">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold tracking-tight text-rv-plum">
              {recipe.title}
            </h3>

            <div className="flex flex-wrap gap-2">
              {recipe.isFavorite ? (
                <span className="rounded-full border border-rv-teal/30 bg-rv-teal/20 px-3 py-1 text-xs font-medium text-rv-plum">
                  Favorite
                </span>
              ) : null}

              {recipe.folder?.name ? (
                <span className="rounded-full border border-stone-200 bg-rv-cream/60 px-3 py-1 text-xs font-medium text-rv-plum">
                  {recipe.folder.name}
                </span>
              ) : null}
            </div>
          </div>

          {recipe.description ? (
            <p className="text-sm leading-6 text-stone-600">
              {recipe.description}
            </p>
          ) : (
            <p className="text-sm text-stone-500">No description yet.</p>
          )}

          <div className="flex flex-wrap gap-3 text-xs font-medium text-stone-500">
            <span>Servings: {recipe.servings ?? "—"}</span>
            <span>Prep: {recipe.prepTime ? `${recipe.prepTime} min` : "—"}</span>
            <span>Cook: {recipe.cookTime ? `${recipe.cookTime} min` : "—"}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}