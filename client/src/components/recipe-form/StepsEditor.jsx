import { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import StepIngredientsEditor from "./StepIngredientsEditor";

function hasIngredientContent(ingredient) {
  return Boolean(
    ingredient.quantity?.trim() ||
      ingredient.unit?.trim() ||
      ingredient.ingredient?.trim() ||
      ingredient.name?.trim(),
  );
}

function hasStepContent(step) {
  return Boolean(
    step.instruction?.trim() ||
      step.prepNote?.trim() ||
      step.timerMinutes ||
      (step.ingredients || []).some(hasIngredientContent),
  );
}

function createInstructionPreview(instruction) {
  const trimmedInstruction = instruction?.trim();

  if (!trimmedInstruction) {
    return "New step — add instructions";
  }

  if (trimmedInstruction.length <= 120) {
    return trimmedInstruction;
  }

  return `${trimmedInstruction.slice(0, 117)}...`;
}

export default function StepsEditor({
  steps,
  onStepChange,
  onAddStep,
  onRemoveStep,
  onStepIngredientChange,
  onAddStepIngredient,
  onRemoveStepIngredient,
}) {
  const hasCompletedSteps = steps.some(hasStepContent);

  const [isSectionExpanded, setIsSectionExpanded] = useState(
    !hasCompletedSteps,
  );

  const [expandedStepId, setExpandedStepId] = useState(
    hasCompletedSteps ? null : steps[0]?.id || null,
  );

  const activeExpandedStepId = steps.some(
    (step) => step.id === expandedStepId,
  )
    ? expandedStepId
    : null;

  const completedStepCount = steps.filter(hasStepContent).length;
  const visibleStepPreviews = steps.filter(hasStepContent).slice(0, 3);
  const remainingStepCount =
    completedStepCount - visibleStepPreviews.length;

  function handleOpenSection() {
    setIsSectionExpanded(true);
  }

  function handleCloseSection() {
    setExpandedStepId(null);
    setIsSectionExpanded(false);
  }

  function handleAddStep() {
    const newStepId = onAddStep();

    setIsSectionExpanded(true);

    if (newStepId) {
      setExpandedStepId(newStepId);
    }
  }

  function handleRemoveStep(stepId) {
    const removedStepIndex = steps.findIndex(
      (step) => step.id === stepId,
    );

    const wasExpanded = activeExpandedStepId === stepId;

    onRemoveStep(stepId);

    if (!wasExpanded) {
      return;
    }

    const remainingSteps = steps.filter(
      (step) => step.id !== stepId,
    );

    const nextStep =
      remainingSteps[removedStepIndex] ||
      remainingSteps[removedStepIndex - 1] ||
      remainingSteps[0];

    setExpandedStepId(nextStep?.id || null);
  }

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold">Steps</h2>

            {!isSectionExpanded && (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-stone-500">
                  {completedStepCount === 1
                    ? "1 step added"
                    : `${completedStepCount} steps added`}
                </p>

                {visibleStepPreviews.length > 0 ? (
                  <div className="space-y-2">
                    {visibleStepPreviews.map((step) => (
                      <div
                        key={step.id}
                        className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-purple-700">
                          Step {steps.indexOf(step) + 1}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-stone-700">
                          {createInstructionPreview(step.instruction)}
                        </p>
                      </div>
                    ))}

                    {remainingStepCount > 0 && (
                      <p className="text-sm font-medium text-purple-700">
                        +{remainingStepCount} more{" "}
                        {remainingStepCount === 1 ? "step" : "steps"}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-stone-500">
                    No steps added yet.
                  </p>
                )}
              </div>
            )}
          </div>

          {!isSectionExpanded && (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddStep}
              >
                Add Step
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={handleOpenSection}
                aria-expanded={isSectionExpanded}
              >
                Edit Steps
              </Button>
            </div>
          )}
        </div>

        {isSectionExpanded && (
          <div className="space-y-4 border-t border-stone-200 pt-4">
            <div className="flex justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddStep}
              >
                Add Step
              </Button>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => {
                const isExpanded =
                  activeExpandedStepId === step.id;

                const ingredientCount = (
                  step.ingredients || []
                ).filter(hasIngredientContent).length;

                const instructionPreview =
                  createInstructionPreview(step.instruction);

                return (
                  <div
                    key={step.id}
                    className={`rounded-2xl border transition ${
                      isExpanded
                        ? "border-purple-200 bg-white shadow-sm"
                        : "border-stone-200 bg-stone-50"
                    }`}
                  >
                    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
                          Step {index + 1}
                        </p>

                        {!isExpanded && (
                          <>
                            <p className="mt-2 text-sm leading-6 text-stone-800">
                              {instructionPreview}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600">
                                {ingredientCount === 1
                                  ? "1 ingredient"
                                  : `${ingredientCount} ingredients`}
                              </span>

                              {step.timerMinutes ? (
                                <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600">
                                  {step.timerMinutes} min timer
                                </span>
                              ) : (
                                <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-400">
                                  No timer
                                </span>
                              )}

                              {step.prepNote?.trim() && (
                                <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600">
                                  Prep note added
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {!isExpanded && (
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() =>
                              setExpandedStepId(step.id)
                            }
                            aria-expanded={isExpanded}
                          >
                            Edit Step
                          </Button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveStep(step.id)
                          }
                          className="text-sm text-stone-500 transition hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="space-y-4 border-t border-stone-200 p-4">
                        <Textarea
                          label="Instruction"
                          name="instruction"
                          value={step.instruction}
                          onChange={(event) =>
                            onStepChange(
                              step.id,
                              "instruction",
                              event.target.value,
                            )
                          }
                          placeholder="Describe what to do in this step"
                          rows={3}
                        />

                        <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
                          <Input
                            label="Prep Note (optional)"
                            name="prepNote"
                            value={step.prepNote}
                            onChange={(event) =>
                              onStepChange(
                                step.id,
                                "prepNote",
                                event.target.value,
                              )
                            }
                            placeholder="Ex: Have the oven preheated before this step"
                          />

                          <Input
                            label="Timer (minutes, optional)"
                            name="timerMinutes"
                            type="number"
                            value={step.timerMinutes}
                            onChange={(event) =>
                              onStepChange(
                                step.id,
                                "timerMinutes",
                                event.target.value,
                              )
                            }
                            placeholder="10"
                          />
                        </div>

                        <StepIngredientsEditor
                          ingredients={step.ingredients}
                          onIngredientChange={(
                            ingredientId,
                            field,
                            value,
                          ) =>
                            onStepIngredientChange(
                              step.id,
                              ingredientId,
                              field,
                              value,
                            )
                          }
                          onAddIngredient={() =>
                            onAddStepIngredient(step.id)
                          }
                          onRemoveIngredient={(ingredientId) =>
                            onRemoveStepIngredient(
                              step.id,
                              ingredientId,
                            )
                          }
                        />

                        <div className="flex justify-end border-t border-stone-200 pb-4 pt-4">
                          <Button
                            type="button"
                            onClick={() =>
                              setExpandedStepId(null)
                            }
                          >
                            Done Editing Step
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 border-t border-stone-200 pb-4 pt-4 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddStep}
              >
                + Add Another Step
              </Button>

              <Button
                type="button"
                onClick={handleCloseSection}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}