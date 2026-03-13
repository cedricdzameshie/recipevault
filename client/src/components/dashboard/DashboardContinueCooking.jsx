import { Link } from "react-router-dom";
import Card from "../common/Card";
import Button from "../common/Button";

export default function DashboardContinueCooking({ recipe, onDismiss }) {
  if (!recipe) return null;

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-green-700">
              Continue Cooking
            </p>
            <h2 className="mt-1 text-xl font-semibold text-stone-900">
              {recipe.title}
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Pick up where you left off at step {recipe.stepNumber}.
            </p>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            className="rounded-full px-2 py-1 text-sm text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
            aria-label="Dismiss continue cooking"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to={`/recipes/${recipe.id}/cook?step=${recipe.stepNumber}`}>
            <Button>Resume</Button>
          </Link>

          <Link
            to={`/recipes/${recipe.id}`}
            className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
          >
            View Recipe
          </Link>
        </div>
      </div>
    </Card>
  );
}