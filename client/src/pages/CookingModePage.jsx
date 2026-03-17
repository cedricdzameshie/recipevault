import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import CookingHeader from "../components/cooking/CookingHeader";
import CookingStepCard from "../components/cooking/CookingStepCard";
import CookingControls from "../components/cooking/CookingControls";
import { fetchRecipeById } from "../api/recipes";

export default function CookingModePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasStartedNavigating, setHasStartedNavigating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadRecipe() {
      try {
        setIsLoading(true);
        setError("");

        const data = await fetchRecipeById(id);

        if (!isMounted) return;

        setRecipe(data);

        const totalSteps = data?.steps?.length ?? 0;
        const requestedStep = Number(searchParams.get("step") || "1");

        const safeInitialStepIndex =
          totalSteps > 0
            ? Math.min(Math.max(requestedStep - 1, 0), totalSteps - 1)
            : 0;

        setCurrentStepIndex(safeInitialStepIndex);
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
  }, [id, searchParams]);

  const totalSteps = recipe?.steps?.length ?? 0;

  const activeStepIndex = hasStartedNavigating
    ? currentStepIndex
    : currentStepIndex;

  const currentStep = useMemo(() => {
    if (!recipe || !recipe.steps?.length) return null;
    return recipe.steps[activeStepIndex];
  }, [recipe, activeStepIndex]);

  const currentStepNumber = activeStepIndex + 1;

  useEffect(() => {
    if (!recipe || !currentStep || isFinished) return;

    localStorage.setItem(
      "continueCooking",
      JSON.stringify({
        recipeId: recipe.id,
        step: currentStepNumber,
      })
    );
  }, [recipe, currentStep, currentStepNumber, isFinished]);

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
      localStorage.removeItem("continueCooking");
    }
  }

  function handleStartAgain() {
    setHasStartedNavigating(true);
    setCurrentStepIndex(0);
    setIsFinished(false);

    if (recipe) {
      localStorage.setItem(
        "continueCooking",
        JSON.stringify({
          recipeId: recipe.id,
          step: 1,
        })
      );
    }
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
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <CookingHeader
          title={recipe.title}
          currentStepNumber={currentStepNumber}
          totalSteps={totalSteps}
        />

        <div className="hidden gap-3 md:flex">
          <Link
            to={editUrl}
            className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
          >
            Edit Recipe
          </Link>

          <Link
            to={`/recipes/${recipe.id}`}
            className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
          >
            Exit
          </Link>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-stone-200">
        <div
          className="h-full rounded-full bg-stone-900 transition-all"
          style={{
            width: `${(currentStepNumber / totalSteps) * 100}%`,
          }}
        />
      </div>

      <CookingStepCard
        step={currentStep}
        stepNumber={currentStepNumber}
      />

      <CookingControls
        onPrevious={handlePrevious}
        onNext={handleNext}
        canGoPrevious={activeStepIndex > 0}
        canGoNext={activeStepIndex < totalSteps - 1}
      />

      <div className="flex flex-wrap gap-3 md:hidden">
        <Link
          to={editUrl}
          className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
        >
          Edit Recipe
        </Link>

        <Link
          to={`/recipes/${recipe.id}`}
          className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
        >
          Exit Cooking Mode
        </Link>
      </div>
    </section>
  );
}