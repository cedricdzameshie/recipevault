import { Link } from "react-router-dom";
import Card from "../common/Card";
import { getCookingProgress } from "../../utils/cookingProgress";

function createDescriptionPreview(description) {
  const trimmedDescription = description?.trim();

  if (!trimmedDescription) {
    return "No description yet.";
  }

  if (trimmedDescription.length <= 110) {
    return trimmedDescription;
  }

  return `${trimmedDescription.slice(0, 107)}...`;
}

function formatTime(minutes) {
  if (!minutes) {
    return "—";
  }

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${remainingMinutes} min`;
  }

  return `${minutes} min`;
}

export default function RecipeCard({ recipe }) {
  const cookingProgress = getCookingProgress(recipe.id);
  const hasCookingProgress = Boolean(cookingProgress);

  return (
    <Link to={`/recipes/${recipe.id}`} className="group block h-full">
      <Card className="h-full border-stone-300/70 bg-white/95 transition group-hover:border-rv-teal/40 group-hover:shadow-md group-hover:shadow-stone-900/5">
        <div className="flex h-full flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="wrap-break-word text-lg font-bold tracking-tight text-rv-plum">
                {recipe.title}
              </h3>

              <div className="mt-2 flex flex-wrap gap-2">
                {recipe.folder?.name ? (
                  <span className="rounded-full border border-stone-200 bg-rv-cream/60 px-3 py-1 text-xs font-semibold text-rv-plum">
                    {recipe.folder.name}
                  </span>
                ) : (
                  <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-500">
                    No folder
                  </span>
                )}

                {recipe.isFavorite ? (
                  <span className="rounded-full border border-rv-teal/30 bg-rv-teal/20 px-3 py-1 text-xs font-semibold text-rv-plum">
                    Favorite
                  </span>
                ) : null}
              </div>
            </div>

            <span
              aria-hidden="true"
              className={`shrink-0 text-lg ${
                recipe.isFavorite ? "text-rv-plum" : "text-stone-300"
              }`}
            >
              ♥
            </span>
          </div>

          <p className="text-sm leading-6 text-stone-600">
            {createDescriptionPreview(recipe.description)}
          </p>

          <div className="mt-auto grid grid-cols-3 gap-2 rounded-2xl border border-stone-200 bg-rv-cream/45 p-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rv-plum/60">
                Serves
              </p>

              <p className="mt-1 text-sm font-bold text-stone-800">
                {recipe.servings ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rv-plum/60">
                Prep
              </p>

              <p className="mt-1 text-sm font-bold text-stone-800">
                {formatTime(recipe.prepTime)}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rv-plum/60">
                Cook
              </p>

              <p className="mt-1 text-sm font-bold text-stone-800">
                {formatTime(recipe.cookTime)}
              </p>
            </div>
          </div>

          {hasCookingProgress ? (
            <div className="rounded-2xl border border-rv-plum/15 bg-rv-plum/10 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rv-plum/70">
                Continue Cooking
              </p>

              <p className="mt-1 text-sm font-bold text-rv-plum">
                Resume at Step {cookingProgress.stepNumber}
              </p>
            </div>
          ) : (
            <p className="text-sm font-semibold text-rv-plum transition group-hover:text-rv-plum/75">
              View Recipe →
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}