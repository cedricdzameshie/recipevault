import Card from "../common/Card";

export default function CookingStepCard({ step, stepNumber }) {
  return (
    <Card>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-stone-500">
            Current Step
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-stone-900">
            Step {stepNumber}
          </h2>
        </div>

        <p className="text-base leading-7 text-stone-800">
          {step.instruction}
        </p>

        {step.ingredients?.length > 0 && (
          <div className="rounded-2xl bg-stone-50 p-4">
            <p className="text-sm font-medium text-stone-700">
              Ingredients Used In This Step
            </p>

            <ul className="mt-3 space-y-2">
              {step.ingredients.map((ingredient) => (
                <li key={ingredient.id} className="text-sm text-stone-700">
                  <span className="font-medium">
                    {ingredient.quantity} {ingredient.unit}
                  </span>{" "}
                  {ingredient.ingredient}
                </li>
              ))}
            </ul>
          </div>
        )}

        {step.prepNote && (
          <div className="rounded-2xl bg-stone-100 p-4">
            <p className="text-sm font-medium text-stone-700">Prep Note</p>
            <p className="mt-1 text-sm text-stone-600">{step.prepNote}</p>
          </div>
        )}

        {step.timerMinutes && (
          <div className="rounded-2xl border border-stone-200 p-4">
            <p className="text-sm font-medium text-stone-700">Suggested Timer</p>
            <p className="mt-1 text-lg font-semibold text-stone-900">
              {step.timerMinutes} min
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}