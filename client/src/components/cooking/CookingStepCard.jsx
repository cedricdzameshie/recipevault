import Card from "../common/Card";
import { scaleIngredientQuantity } from "../../utils/ingredientQuantity";


export default function CookingStepCard({
  step,
  stepNumber,
  checkedIngredientIds = [],
  onIngredientToggle,
  batchScale = 1,
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-stone-200 bg-stone-50/70 px-5 py-6 sm:px-7 sm:py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum">
          Step {stepNumber}
        </p>

        <p className="mt-3 text-lg font-medium leading-8 text-stone-900 sm:text-xl sm:leading-9">
          {step.instruction}
        </p>
      </div>

      {(step.ingredients?.length > 0 ||
        step.prepNote ||
        step.timerMinutes) && (
        <div className="space-y-4 p-5 sm:p-7">
          {step.ingredients?.length > 0 && (
            <div className="rounded-2xl bg-stone-50 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-rv-plum">
                Ingredients for this step
              </p>

              <ul className="mt-3 space-y-2.5">
                {step.ingredients.map((ingredient) => {
  const linkedIngredient =
    ingredient.ingredientId &&
    typeof ingredient.ingredient === "object"
      ? ingredient.ingredient
      : null;

  const resolvedQuantity =
    ingredient.quantity || linkedIngredient?.quantity || "";

  const resolvedUnit =
    ingredient.unit || linkedIngredient?.unit || "";

  const resolvedName =
    linkedIngredient?.name ||
    ingredient.name ||
    (typeof ingredient.ingredient === "string"
      ? ingredient.ingredient
      : "");

  const ingredientText = [
    scaleIngredientQuantity(resolvedQuantity, batchScale),
    resolvedUnit,
    resolvedName,
  ]
    .filter(Boolean)
    .join(" ");
                  const isChecked = checkedIngredientIds.some(
                    (id) => String(id) === String(ingredient.id)
                  );

                  return (
                    <li key={ingredient.id}>
                      <label
                        className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 transition ${
                          isChecked
                            ? "border-rv-plum/20 bg-rv-plum/10"
                            : "border-transparent hover:bg-white"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            onIngredientToggle?.(ingredient.id)
                          }
                          className="mt-1 h-5 w-5 shrink-0 accent-rv-plum"
                        />

                        <span
                          className={`text-sm leading-6 transition ${
                            isChecked
                              ? "text-stone-500 line-through"
                              : "text-stone-700"
                          }`}
                        >
                          {ingredientText}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {step.prepNote && (
            <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-rv-plum">
                Prep Note
              </p>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                {step.prepNote}
              </p>
            </div>
          )}

          {step.timerMinutes && (
            <div className="rounded-2xl border border-rv-plum/20 bg-rv-plum/10 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-rv-plum">
                Suggested Timer
              </p>

              <p className="mt-2 text-xl font-semibold text-stone-900">
                {step.timerMinutes} minutes
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}