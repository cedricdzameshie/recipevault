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
      ingredient.name?.trim()
  );
}

function hasStepContent(step) {
  return Boolean(
    step.instruction?.trim() ||
      step.prepNote?.trim() ||
      step.timerMinutes ||
      (step.ingredients || []).some(hasIngredientContent)
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
  recipeIngredients,
  steps,
  onStepChange,
  onAddStep,
  onRemoveStep,
  onStepIngredientChange,
  onAddStepIngredient,
  onAddLinkedStepIngredient,
  onRemoveStepIngredient,
}) {
  const hasCompletedSteps = steps.some(hasStepContent);

  const [isSectionExpanded, setIsSectionExpanded] = useState(
    !hasCompletedSteps
  );

  const [expandedStepId, setExpandedStepId] = useState(
    hasCompletedSteps ? null : steps[0]?.id || null
  );

  const [visibleStepDetails, setVisibleStepDetails] = useState({});

  const activeExpandedStepId = steps.some((step) => step.id === expandedStepId)
    ? expandedStepId
    : null;

  const completedStepCount = steps.filter(hasStepContent).length;
  const visibleStepPreviews = steps.filter(hasStepContent).slice(0, 3);
  const remainingStepCount = completedStepCount - visibleStepPreviews.length;

  function handleOpenSection() {
    setIsSectionExpanded(true);

    if (!activeExpandedStepId) {
      setExpandedStepId(steps[0]?.id || null);
    }
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
    const removedStepIndex = steps.findIndex((step) => step.id === stepId);
    const wasExpanded = activeExpandedStepId === stepId;

    onRemoveStep(stepId);

    if (!wasExpanded) {
      return;
    }

    const remainingSteps = steps.filter((step) => step.id !== stepId);

    const nextStep =
      remainingSteps[removedStepIndex] ||
      remainingSteps[removedStepIndex - 1] ||
      remainingSteps[0];

    setExpandedStepId(nextStep?.id || null);
  }

  function showStepDetail(stepId, detailName) {
    setVisibleStepDetails((prev) => ({
      ...prev,
      [stepId]: {
        ...(prev[stepId] || {}),
        [detailName]: true,
      },
    }));
  }

  function hideStepDetail(stepId, detailName) {
    setVisibleStepDetails((prev) => ({
      ...prev,
      [stepId]: {
        ...(prev[stepId] || {}),
        [detailName]: false,
      },
    }));
  }

  function handleRemovePrepNote(stepId) {
    onStepChange(stepId, "prepNote", "");
    hideStepDetail(stepId, "prepNote");
  }

  function handleRemoveTimer(stepId) {
    onStepChange(stepId, "timerMinutes", "");
    hideStepDetail(stepId, "timer");
  }

  function handleRemoveStepIngredients(step) {
    (step.ingredients || []).forEach((ingredient) => {
      onRemoveStepIngredient(step.id, ingredient.id);
    });

    hideStepDetail(step.id, "ingredients");
  }

  return (
    <Card className="overflow-hidden">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/60">
              Step 3
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-stone-950">
              Cooking Steps
            </h2>

            <p className="mt-1 text-sm leading-6 text-stone-500">
              Write the instructions first. Add timers, prep notes, or step
              ingredients only when needed.
            </p>

            {!isSectionExpanded ? (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium text-stone-600">
                  {completedStepCount === 1
                    ? "1 step added"
                    : `${completedStepCount} steps added`}
                </p>

                {visibleStepPreviews.length > 0 ? (
                  <div className="space-y-2">
                    {visibleStepPreviews.map((step) => (
                      <div
                        key={step.id}
                        className="rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-3"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rv-plum/75">
                          Step {steps.indexOf(step) + 1}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-stone-700">
                          {createInstructionPreview(step.instruction)}
                        </p>
                      </div>
                    ))}

                    {remainingStepCount > 0 ? (
                      <p className="text-sm font-semibold text-rv-plum">
                        +{remainingStepCount} more{" "}
                        {remainingStepCount === 1 ? "step" : "steps"}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-sm text-stone-500">
                    No steps added yet.
                  </p>
                )}
              </div>
            ) : null}
          </div>

          {!isSectionExpanded ? (
            <div className="w-full sm:w-auto">
              <Button
                type="button"
                variant="secondary"
                onClick={handleOpenSection}
                aria-expanded={isSectionExpanded}
              >
                Edit Steps
              </Button>
            </div>
          ) : null}
        </div>

        {isSectionExpanded ? (
          <div className="space-y-4 border-t border-stone-200 pt-4">
            <div className="space-y-3">
              {steps.map((step, index) => {
                const isExpanded = activeExpandedStepId === step.id;

                const ingredientCount = (step.ingredients || []).filter(
                  hasIngredientContent
                ).length;

                const instructionPreview = createInstructionPreview(
                  step.instruction
                );

                const showPrepNote =
                  Boolean(step.prepNote?.trim()) ||
                  visibleStepDetails[step.id]?.prepNote;

                const showTimer =
                  Boolean(step.timerMinutes) ||
                  visibleStepDetails[step.id]?.timer;

                const showIngredients =
                  ingredientCount > 0 ||
                  visibleStepDetails[step.id]?.ingredients;

                const hasHiddenOptionalDetails =
                  !showPrepNote || !showTimer || !showIngredients;

                return (
                  <div
                    key={step.id}
                    className={`overflow-hidden rounded-2xl border transition ${
                      isExpanded
                        ? "border-rv-plum/20 bg-white shadow-sm shadow-stone-900/5"
                        : "border-stone-200 bg-stone-50/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 p-4">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedStepId(isExpanded ? null : step.id)
                        }
                        className="min-w-0 flex-1 text-left"
                        aria-expanded={isExpanded}
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rv-plum/75">
                          Step {index + 1}
                        </p>

                        {!isExpanded ? (
                          <>
                            <p className="mt-2 wrap-break-word text-base font-semibold leading-6 text-stone-900">
                              {instructionPreview}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {ingredientCount > 0 ? (
                                <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600">
                                  {ingredientCount === 1
                                    ? "1 ingredient"
                                    : `${ingredientCount} ingredients`}
                                </span>
                              ) : null}

                              {step.timerMinutes ? (
                                <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600">
                                  {step.timerMinutes} min timer
                                </span>
                              ) : null}

                              {step.prepNote?.trim() ? (
                                <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600">
                                  Prep note
                                </span>
                              ) : null}
                            </div>
                          </>
                        ) : null}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveStep(step.id)}
                        className="shrink-0 text-sm font-medium text-stone-500 transition hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>

                    {isExpanded ? (
                      <div className="space-y-4 border-t border-stone-200 bg-white p-4">
                        <Textarea
                          label="Instruction"
                          name="instruction"
                          value={step.instruction}
                          onChange={(event) =>
                            onStepChange(
                              step.id,
                              "instruction",
                              event.target.value
                            )
                          }
                          placeholder="Describe what to do in this step"
                          rows={4}
                        />

                        {hasHiddenOptionalDetails ? (
                          <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                              Optional Details
                            </p>

                            <div className="mt-3 grid gap-2 sm:grid-cols-3">
                              {!showPrepNote ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    showStepDetail(step.id, "prepNote")
                                  }
                                  className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-bold text-rv-plum transition hover:bg-stone-50"
                                >
                                  + Prep Note
                                </button>
                              ) : null}

                              {!showTimer ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    showStepDetail(step.id, "timer")
                                  }
                                  className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-bold text-rv-plum transition hover:bg-stone-50"
                                >
                                  + Timer
                                </button>
                              ) : null}

                              {!showIngredients ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    showStepDetail(step.id, "ingredients")
                                  }
                                  className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-bold text-rv-plum transition hover:bg-stone-50"
                                >
                                  + Ingredients Used
                                </button>
                              ) : null}
                            </div>
                          </div>
                        ) : null}

                        {showPrepNote ? (
                          <div className="rounded-2xl border border-stone-200 bg-white p-3">
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <p className="text-sm font-bold text-stone-900">
                                Prep Note
                              </p>

                              <button
                                type="button"
                                onClick={() => handleRemovePrepNote(step.id)}
                                className="text-sm font-medium text-stone-500 transition hover:text-red-600"
                              >
                                Remove
                              </button>
                            </div>

                            <Input
                              label="Note"
                              name="prepNote"
                              value={step.prepNote}
                              onChange={(event) =>
                                onStepChange(
                                  step.id,
                                  "prepNote",
                                  event.target.value
                                )
                              }
                              placeholder="Ex: Have the oven preheated before this step"
                            />
                          </div>
                        ) : null}

                        {showTimer ? (
                          <div className="rounded-2xl border border-stone-200 bg-white p-3">
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <p className="text-sm font-bold text-stone-900">
                                Timer
                              </p>

                              <button
                                type="button"
                                onClick={() => handleRemoveTimer(step.id)}
                                className="text-sm font-medium text-stone-500 transition hover:text-red-600"
                              >
                                Remove
                              </button>
                            </div>

                            <Input
                              label="Minutes"
                              name="timerMinutes"
                              type="number"
                              value={step.timerMinutes}
                              onChange={(event) =>
                                onStepChange(
                                  step.id,
                                  "timerMinutes",
                                  event.target.value
                                )
                              }
                              placeholder="10"
                            />
                          </div>
                        ) : null}

                        {showIngredients ? (
                          <div className="rounded-2xl border border-stone-200 bg-white p-3">
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-bold text-stone-900">
                                  Ingredients Used
                                </p>

                                <p className="mt-1 text-xs leading-5 text-stone-500">
                                  Attach ingredients that are used during this
                                  step.
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveStepIngredients(step)}
                                className="shrink-0 text-sm font-medium text-stone-500 transition hover:text-red-600"
                              >
                                Remove
                              </button>
                            </div>

                            <StepIngredientsEditor
                              recipeIngredients={recipeIngredients}
                              ingredients={step.ingredients}
                              onIngredientChange={(
                                ingredientId,
                                field,
                                value
                              ) =>
                                onStepIngredientChange(
                                  step.id,
                                  ingredientId,
                                  field,
                                  value
                                )
                              }
                              onAddIngredient={() =>
                                onAddStepIngredient(step.id)
                              }
                              onAddLinkedIngredient={(recipeIngredient) =>
                                onAddLinkedStepIngredient(
                                  step.id,
                                  recipeIngredient
                                )
                              }
                              onRemoveIngredient={(ingredientId) =>
                                onRemoveStepIngredient(step.id, ingredientId)
                              }
                            />
                          </div>
                        ) : null}

                        <div className="flex justify-end border-t border-stone-200 pt-4">
                          <div className="w-full sm:w-auto">
                            <Button
                              type="button"
                              onClick={() => setExpandedStepId(null)}
                            >
                              Done
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 border-t border-stone-200 pt-4">
              <button
                type="button"
                onClick={handleAddStep}
                className="flex w-full items-center justify-center rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-rv-plum transition hover:bg-stone-50"
              >
                + Add Another Step
              </button>

              <Button type="button" onClick={handleCloseSection}>
                Done with Steps
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}