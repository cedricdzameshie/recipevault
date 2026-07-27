import Card from "../common/Card";
import { scaleIngredientQuantity } from "../../utils/ingredientQuantity";

function resolveStepIngredient(ingredient, batchScale) {
  const linkedIngredient =
    ingredient.ingredientId && typeof ingredient.ingredient === "object"
      ? ingredient.ingredient
      : null;

  const quantity = ingredient.quantity || linkedIngredient?.quantity || "";
  const unit = ingredient.unit || linkedIngredient?.unit || "";
  const name =
    linkedIngredient?.name ||
    ingredient.name ||
    (typeof ingredient.ingredient === "string" ? ingredient.ingredient : "");

  const scaledQuantity = scaleIngredientQuantity(quantity, batchScale);
  const fullText = [scaledQuantity, unit, name].filter(Boolean).join(" ");

  return {
    name,
    fullText,
  };
}

export default function CookingStepCard({
  step,
  stepNumber,
  checkedIngredientIds = [],
  onIngredientToggle,
  batchScale = 1,
}) {
  const hasStepIngredients = step.ingredients?.length > 0;
  const hasPrepNote = Boolean(step.prepNote);
  const hasTimer = Boolean(step.timerMinutes);
  const hasExtraDetails = hasStepIngredients || hasPrepNote || hasTimer;

  return (
    <Card className="overflow-hidden p-0">
      <div className="bg-white px-5 py-6 sm:px-7 sm:py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/70">
          Step {stepNumber}
        </p>

        <p className="mt-3 text-xl font-semibold leading-9 text-stone-950 sm:text-2xl sm:leading-10">
          {step.instruction}
        </p>
      </div>

      {hasExtraDetails ? (
        <div className="space-y-4 border-t border-stone-200 bg-rv-cream/30 p-4 sm:p-5">
          {hasTimer ? (
            <div className="rounded-2xl border border-rv-plum/15 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rv-plum/65">
                Suggested Timer
              </p>

              <p className="mt-1 text-lg font-bold text-stone-950">
                {step.timerMinutes} minutes
              </p>
            </div>
          ) : null}

          {hasPrepNote ? (
            <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rv-plum/65">
                Prep Note
              </p>

              <p className="mt-2 text-sm leading-6 text-stone-700">
                {step.prepNote}
              </p>
            </div>
          ) : null}

          {hasStepIngredients ? (
            <div className="rounded-2xl border border-stone-200 bg-white px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rv-plum/65">
                    Ingredients
                  </p>

                  <p className="mt-1 text-sm text-stone-500">
                    Check off what you use in this step.
                  </p>
                </div>

                <span className="rounded-full border border-stone-200 bg-rv-cream/60 px-3 py-1 text-xs font-semibold text-stone-600">
                  {step.ingredients.length}
                </span>
              </div>

              <ul className="mt-4 space-y-2.5">
                {step.ingredients.map((ingredient) => {
                  const resolvedIngredient = resolveStepIngredient(
                    ingredient,
                    batchScale
                  );

                  const isChecked = checkedIngredientIds.some(
                    (id) => String(id) === String(ingredient.id)
                  );

                  return (
                    <li key={ingredient.id}>
                      <label
                        className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 transition ${
                          isChecked
                            ? "border-rv-plum/20 bg-rv-plum/10"
                            : "border-stone-200 bg-white hover:bg-rv-cream/40"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onIngredientToggle?.(ingredient.id)}
                          className="mt-1 h-5 w-5 shrink-0 accent-rv-plum"
                        />

                        <span
                          className={`min-w-0 flex-1 text-sm leading-6 transition ${
                            isChecked
                              ? "text-stone-500 line-through"
                              : "text-stone-700"
                          }`}
                        >
                          {resolvedIngredient.fullText || "Ingredient"}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}