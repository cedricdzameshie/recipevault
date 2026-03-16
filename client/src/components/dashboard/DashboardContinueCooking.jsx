import { Link } from "react-router-dom";
import Card from "../common/Card";
import Button from "../common/Button";
import DashboardSection from "./DashboardSection";

export default function DashboardContinueCooking({
  recipe = null,
  isLoading = false,
}) {
  return (
    <DashboardSection title="Continue Cooking">
      <Card>
        {isLoading ? (
          <p className="text-sm text-stone-600">Loading cooking session...</p>
        ) : recipe ? (
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-medium text-stone-900">{recipe.title}</h3>
              <p className="text-sm text-stone-600">
                Jump back into your most recent recipe.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to={`/recipes/${recipe.id}`}>
                <Button variant="secondary">View Recipe</Button>
              </Link>

              <Link to={`/recipes/${recipe.id}/cook?step=1`}>
                <Button>Continue Cooking</Button>
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