import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import CookingHeader from "../components/cooking/CookingHeader";
import CookingStepCard from "../components/cooking/CookingStepCard";
import CookingControls from "../components/cooking/CookingControls";

const recipeData = {
  1: {
    id: 1,
    title: "Sourdough Bread",
    steps: [
      {
        id: "s1",
        instruction: "Mix flour and water together until shaggy.",
        prepNote: "Use a large mixing bowl.",
        timerMinutes: "30",
        ingredients: [
          { id: "si1", quantity: "500", unit: "g", ingredient: "bread flour" },
          { id: "si2", quantity: "350", unit: "ml", ingredient: "water" },
        ],
      },
      {
        id: "s2",
        instruction: "Add starter and salt, then mix thoroughly.",
        prepNote: "Make sure salt is evenly distributed.",
        timerMinutes: "",
        ingredients: [
          { id: "si3", quantity: "10", unit: "g", ingredient: "salt" },
        ],
      },
      {
        id: "s3",
        instruction: "Let dough rest and begin stretch-and-fold cycles.",
        prepNote: "Keep dough covered between folds.",
        timerMinutes: "30",
        ingredients: [],
      },
      {
        id: "s4",
        instruction: "Shape dough, proof, and bake until deep golden brown.",
        prepNote: "Preheat oven before loading dough.",
        timerMinutes: "45",
        ingredients: [],
      },
    ],
  },
  2: {
    id: 2,
    title: "Focaccia",
    steps: [
      {
        id: "s5",
        instruction: "Mix dough ingredients until fully combined.",
        prepNote: "Dough will be sticky.",
        timerMinutes: "10",
        ingredients: [
          { id: "si4", quantity: "4", unit: "cup", ingredient: "flour" },
          { id: "si5", quantity: "2", unit: "tbsp", ingredient: "olive oil" },
        ],
      },
      {
        id: "s6",
        instruction: "Let dough rise until puffy.",
        prepNote: "Lightly oil the bowl first.",
        timerMinutes: "60",
        ingredients: [],
      },
      {
        id: "s7",
        instruction: "Spread in pan, dimple, top, and bake.",
        prepNote: "Add olive oil before dimpling.",
        timerMinutes: "25",
        ingredients: [],
      },
    ],
  },
  3: {
    id: 3,
    title: "Cinnamon Rolls",
    steps: [
      {
        id: "s8",
        instruction: "Prepare dough and knead until smooth.",
        prepNote: "Warm milk helps the dough come together.",
        timerMinutes: "12",
        ingredients: [
          { id: "si6", quantity: "3", unit: "cup", ingredient: "flour" },
          { id: "si7", quantity: "1", unit: "cup", ingredient: "milk" },
        ],
      },
      {
        id: "s9",
        instruction: "Let dough rise until doubled.",
        prepNote: "",
        timerMinutes: "60",
        ingredients: [],
      },
      {
        id: "s10",
        instruction: "Roll out dough, add filling, roll, and cut.",
        prepNote: "Use softened butter for easy spreading.",
        timerMinutes: "15",
        ingredients: [],
      },
      {
        id: "s11",
        instruction: "Bake until lightly golden, then frost.",
        prepNote: "Let cool slightly before icing.",
        timerMinutes: "25",
        ingredients: [],
      },
    ],
  },
};

export default function CookingModePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const recipe = recipeData[id];

  const totalSteps = recipe?.steps.length ?? 0;

  const requestedStep = Number(searchParams.get("step") || "1");
  const safeInitialStepIndex =
    totalSteps > 0
      ? Math.min(Math.max(requestedStep - 1, 0), totalSteps - 1)
      : 0;

  const [currentStepIndex, setCurrentStepIndex] = useState(safeInitialStepIndex);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setCurrentStepIndex(safeInitialStepIndex);
    setIsFinished(false);
  }, [safeInitialStepIndex, id]);

  const currentStep = useMemo(() => {
    if (!recipe || !recipe.steps.length) return null;
    return recipe.steps[currentStepIndex];
  }, [recipe, currentStepIndex]);

  function handlePrevious() {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
    setIsFinished(false);
  }

  function handleNext() {
    if (!recipe) return;

    if (currentStepIndex < recipe.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  }

  if (!recipe) {
    return (
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold">Recipe Not Found</h1>
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
              onClick={() => {
                setCurrentStepIndex(0);
                setIsFinished(false);
              }}
              className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              Start Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  const currentStepNumber = currentStepIndex + 1;
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
            width: `${((currentStepNumber) / totalSteps) * 100}%`,
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
        canGoPrevious={currentStepIndex > 0}
        canGoNext={currentStepIndex < totalSteps - 1}
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