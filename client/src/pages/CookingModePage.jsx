import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import CookingHeader from "../components/cooking/CookingHeader";
import CookingStepCard from "../components/cooking/CookingStepCard";
import CookingControls from "../components/cooking/CookingControls";
import { fetchRecipeById } from "../api/recipes";
import {
  clearCookingProgress,
  getCookingProgress,
  updateCookingProgress,
} from "../utils/cookingProgress";

export default function CookingModePage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedStepParam = searchParams.get("step");
  const isFocusMode = searchParams.get("focus") === "1";

  const BATCH_SCALES = [1, 2, 4, 8];
  const [batchScale, setBatchScale] = useState(1);
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasStartedNavigating, setHasStartedNavigating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [checkedIngredientIds, setCheckedIngredientIds] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadRecipe() {
      try {
        setIsLoading(true);
        setError("");

        const data = await fetchRecipeById(id);

        if (!isMounted) return;

        setRecipe(data);

        const steps = data?.steps ?? [];
const totalSteps = steps.length;
const savedProgress = getCookingProgress(data.id);

let initialStepIndex = 0;

if (totalSteps > 0) {
  if (savedProgress) {
    const savedStepIndex =
      savedProgress.stepId !== null
        ? steps.findIndex(
            (step) =>
              String(step.id) === String(savedProgress.stepId)
          )
        : -1;

    if (savedStepIndex >= 0) {
      initialStepIndex = savedStepIndex;
    } else {
      initialStepIndex = Math.min(
        Math.max(savedProgress.stepNumber - 1, 0),
        totalSteps - 1
      );
    }
  } else {
    const parsedRequestedStep = Number(requestedStepParam);

    const requestedStep = Number.isFinite(parsedRequestedStep)
      ? parsedRequestedStep
      : 1;

    initialStepIndex = Math.min(
      Math.max(requestedStep - 1, 0),
      totalSteps - 1
    );
  }
}
setCheckedIngredientIds(
  savedProgress?.checkedIngredientIds ?? []
);
setBatchScale(savedProgress?.scale ?? 1);

setCurrentStepIndex(initialStepIndex);

      } catch (err) {
        console.error("Failed to load cooking recipe:", err);

        if (isMounted) {
          setError(err.message || "Failed to load recipe");
          setRecipe(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRecipe();

    return () => {
      isMounted = false;
    };
}, [id, requestedStepParam]);

  const totalSteps = recipe?.steps?.length ?? 0;

  const activeStepIndex = hasStartedNavigating
    ? currentStepIndex
    : currentStepIndex;

  const currentStep = useMemo(() => {
    if (!recipe || !recipe.steps?.length) return null;
    return recipe.steps[activeStepIndex];
  }, [recipe, activeStepIndex]);

  const currentStepNumber = activeStepIndex + 1;
  
  const progressPercentage =
  totalSteps > 0
    ? Math.round((currentStepNumber / totalSteps) * 100)
    : 0;

  useEffect(() => {
  if (!recipe || !currentStep || isFinished) {
    return;
  }

  updateCookingProgress(recipe.id, {
    stepId: currentStep.id ?? null,
    stepNumber: currentStepNumber,
  });
}, [recipe, currentStep, currentStepNumber, isFinished]);


function handleIngredientToggle(ingredientId) {
  if (!recipe) return;

  setCheckedIngredientIds((previousIds) => {
    const ingredientKey = String(ingredientId);

    const isAlreadyChecked = previousIds.some(
      (id) => String(id) === ingredientKey
    );

    const nextIds = isAlreadyChecked
      ? previousIds.filter(
          (id) => String(id) !== ingredientKey
        )
      : [...previousIds, ingredientId];

    updateCookingProgress(recipe.id, {
      checkedIngredientIds: nextIds,
    });

    return nextIds;
  });
}

function handleBatchScaleChange(nextScale) {
  if (!recipe) return;

  setBatchScale(nextScale);

  updateCookingProgress(recipe.id, {
    scale: nextScale,
  });
}

  function handleFocusModeToggle() {
  const nextSearchParams = new URLSearchParams(searchParams);

  if (isFocusMode) {
    nextSearchParams.delete("focus");
  } else {
    nextSearchParams.set("focus", "1");
  }

  setSearchParams(nextSearchParams);
}

  function handlePrevious() {
    setHasStartedNavigating(true);
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
    setIsFinished(false);
  }

  function handleNext() {
    if (!recipe) return;

    setHasStartedNavigating(true);

    if (activeStepIndex < recipe.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
  setIsFinished(true);
  clearCookingProgress(recipe.id);
}
  }

  function handleStartAgain() {
  setHasStartedNavigating(true);
  setCurrentStepIndex(0);
  setIsFinished(false);

  if (!recipe) return;

  clearCookingProgress(recipe.id);

  updateCookingProgress(recipe.id, {
    stepId: recipe.steps?.[0]?.id ?? null,
    stepNumber: 1,
    scale: 1,
    checkedIngredientIds: [],
    timers: [],
  });
}

  if (isLoading) {
    return (
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold">Loading Recipe...</h1>
        <Link to="/recipes" className="text-sm text-stone-600 underline">
          Back to Recipes
        </Link>
      </section>
    );
  }

  if (error || !recipe) {
    return (
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold">Recipe Not Found</h1>
        <p className="text-sm text-stone-600">
          {error || "We couldn't find that recipe."}
        </p>
        <Link to="/recipes" className="text-sm text-stone-600 underline">
          Back to Recipes
        </Link>
      </section>
    );
  }

  if (!currentStep) {
    return (
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold">No steps available</h1>
        <Link
          to={`/recipes/${recipe.id}`}
          className="text-sm text-stone-600 underline"
        >
          Back to Recipe
        </Link>
      </section>
    );
  }

  if (isFinished) {
    return (
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wide text-stone-500">
            Finished
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-stone-900">
            You finished {recipe.title}
          </h1>
          <p className="mt-3 text-stone-600">
            Nice work. Choose where you want to go next.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={`/recipes/${recipe.id}`}
              className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
            >
              Back to Recipe
            </Link>

            <Link
              to="/recipes"
              className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
            >
              Back to Recipes
            </Link>

            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
            >
              Dashboard
            </Link>

            <button
              type="button"
              onClick={handleStartAgain}
              className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              Start Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  const editUrl = `/recipes/${recipe.id}/edit?returnTo=cook&step=${currentStepNumber}`;


  return (
  <section className="mx-auto w-full max-w-3xl space-y-4 pb-8 sm:space-y-6">
    <div className="rounded-3xl border border-stone-200 bg-white/95 p-4 shadow-sm shadow-stone-900/5 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <CookingHeader
            title={recipe.title}
            currentStepNumber={currentStepNumber}
            totalSteps={totalSteps}
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleFocusModeToggle}
            aria-pressed={isFocusMode}
            className={`inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-rv-plum focus:ring-offset-2 ${
              isFocusMode
                ? "bg-rv-plum text-white hover:bg-rv-plum/90"
                : "border border-stone-200 bg-white text-rv-plum hover:bg-stone-50"
            }`}
          >
            {isFocusMode ? "Exit Focus" : "Focus Mode"}
          </button>

          {!isFocusMode ? (
            <Link
              to={editUrl}
              className="hidden h-11 items-center justify-center whitespace-nowrap rounded-xl border border-stone-200 bg-white px-4 text-sm font-semibold text-rv-plum transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-rv-plum focus:ring-offset-2 md:inline-flex"
            >
              Edit
            </Link>
          ) : null}

          <Link
            to={`/recipes/${recipe.id}`}
            className="hidden h-11 items-center justify-center whitespace-nowrap rounded-xl border border-stone-200 bg-white px-4 text-sm font-semibold text-rv-plum transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-rv-plum focus:ring-offset-2 md:inline-flex"
          >
            Exit
          </Link>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-stone-600">
            Cooking progress
          </p>

          <p className="text-sm font-bold text-rv-plum">
            {progressPercentage}%
          </p>
        </div>

        <div
          role="progressbar"
          aria-label="Cooking progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercentage}
          aria-valuetext={`Step ${currentStepNumber} of ${totalSteps}`}
          className="h-2.5 overflow-hidden rounded-full bg-stone-200"
        >
          <div
            className="h-full rounded-full bg-rv-plum transition-all duration-300 ease-out"
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>
      </div>
    </div>

    {!isFocusMode ? (
      <div className="rounded-2xl border border-stone-200 bg-white/90 p-4 shadow-sm shadow-stone-900/5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-stone-900">Batch size</p>

            <p className="mt-1 text-xs leading-5 text-stone-500">
              Ingredient quantities update automatically.
            </p>
          </div>

          <div
            className="grid grid-cols-4 rounded-xl border border-stone-200 bg-white p-1 sm:inline-grid"
            aria-label="Batch size"
          >
            {BATCH_SCALES.map((scale) => {
              const isActive = batchScale === scale;

              return (
                <button
                  key={scale}
                  type="button"
                  onClick={() => handleBatchScaleChange(scale)}
                  aria-pressed={isActive}
                  className={`min-h-10 rounded-lg px-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-rv-plum focus:ring-offset-2 ${
                    isActive
                      ? "bg-rv-plum text-white"
                      : "text-rv-plum hover:bg-stone-50"
                  }`}
                >
                  {scale}×
                </button>
              );
            })}
          </div>
        </div>
      </div>
    ) : null}

    <CookingStepCard
      step={currentStep}
      stepNumber={currentStepNumber}
      checkedIngredientIds={checkedIngredientIds}
      onIngredientToggle={handleIngredientToggle}
      batchScale={batchScale}
    />

    <CookingControls
      onPrevious={handlePrevious}
      onNext={handleNext}
      canGoPrevious={activeStepIndex > 0}
      canGoNext={activeStepIndex < totalSteps - 1}
    />

    <div className="flex flex-wrap items-center justify-center gap-2 pt-1 md:hidden">
      {!isFocusMode ? (
        <>
          <Link
            to={editUrl}
            className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-medium text-stone-600 transition hover:bg-white/70 hover:text-rv-plum focus:outline-none focus:ring-2 focus:ring-rv-plum focus:ring-offset-2"
          >
            Edit Recipe
          </Link>

          <span aria-hidden="true" className="h-5 w-px bg-stone-300" />
        </>
      ) : null}

      <Link
        to={`/recipes/${recipe.id}`}
        className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-medium text-stone-600 transition hover:bg-white/70 hover:text-rv-plum focus:outline-none focus:ring-2 focus:ring-rv-plum focus:ring-offset-2"
      >
        Exit Cooking Mode
      </Link>
    </div>
  </section>
);
}