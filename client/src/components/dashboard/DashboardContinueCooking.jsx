import { Link } from "react-router-dom";
import Card from "../common/Card";
import Button from "../common/Button";
import DashboardSection from "./DashboardSection";

export default function DashboardContinueCooking({
  recipe = null,
  currentStep = 1,
  isLoading = false,
  onDismiss,
}) {
  return (
    <DashboardSection title="Continue Cooking">
      <Card>
        {isLoading ? (
          <p className="text-sm text-stone-600">
            Loading cooking session...
          </p>
        ) : recipe ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium text-stone-900">
                  {recipe.title}
                </h3>

                <p className="mt-1 text-sm text-stone-600">
                  Resume from step {currentStep}.
                </p>
              </div>

              {onDismiss ? (
                <button
                  type="button"
                  onClick={onDismiss}
                  aria-label="Stop cooking and remove this session"
                  title="Stop cooking"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white text-xl text-rv-plum transition hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rv-plum focus-visible:ring-offset-2"
                >
                  ×
                </button>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to={`/recipes/${recipe.id}`}>
                <Button variant="secondary">
                  View Recipe
                </Button>
              </Link>

              <Link
                to={`/recipes/${recipe.id}/cook?step=${currentStep}`}
              >
                <Button>
                  Continue Cooking
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-sm text-stone-600">
            No recent recipe to continue yet.
          </p>
        )}
      </Card>
    </DashboardSection>
  );
}