import { Link, useParams } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

const recipeData = {
  1: {
    id: 1,
    title: "Sourdough Bread",
    description: "Classic fermented sourdough loaf",
    servings: 4,
    prepTime: 30,
    cookTime: 45,
    ingredients: [
      { id: "a", quantity: "500", unit: "g", ingredient: "bread flour" },
      { id: "b", quantity: "350", unit: "ml", ingredient: "water" },
      { id: "c", quantity: "10", unit: "g", ingredient: "salt" },
    ],
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
        prepNote: "",
        timerMinutes: "",
        ingredients: [
          { id: "si3", quantity: "10", unit: "g", ingredient: "salt" },
        ],
      },
    ],
    notes: "Best results when proofed overnight in the fridge.",
  },
  2: {
    id: 2,
    title: "Focaccia",
    description: "Olive oil bread with herbs",
    servings: 6,
    prepTime: 20,
    cookTime: 30,
    ingredients: [
      { id: "d", quantity: "4", unit: "cup", ingredient: "flour" },
      { id: "e", quantity: "2", unit: "tbsp", ingredient: "olive oil" },
    ],
    steps: [
      {
        id: "s3",
        instruction: "Mix dough ingredients and let rise.",
        prepNote: "Oil the pan before shaping.",
        timerMinutes: "60",
        ingredients: [
          { id: "si4", quantity: "4", unit: "cup", ingredient: "flour" },
          { id: "si5", quantity: "2", unit: "tbsp", ingredient: "olive oil" },
        ],
      },
    ],
    notes: "Top with flaky salt before baking.",
  },
  3: {
    id: 3,
    title: "Cinnamon Rolls",
    description: "Sweet bakery rolls",
    servings: 8,
    prepTime: 40,
    cookTime: 25,
    ingredients: [
      { id: "f", quantity: "3", unit: "cup", ingredient: "flour" },
      { id: "g", quantity: "1", unit: "cup", ingredient: "milk" },
    ],
    steps: [
      {
        id: "s4",
        instruction: "Make dough and allow it to rise.",
        prepNote: "",
        timerMinutes: "60",
        ingredients: [
          { id: "si6", quantity: "3", unit: "cup", ingredient: "flour" },
          { id: "si7", quantity: "1", unit: "cup", ingredient: "milk" },
        ],
      },
    ],
    notes: "Add extra cinnamon sugar for a richer filling.",
  },
};

export default function RecipeDetailPage() {
  const { id } = useParams();
  const recipe = recipeData[id];

  if (!recipe) {
    return (
      <section>
        <h1 className="text-3xl font-semibold">Recipe Not Found</h1>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{recipe.title}</h1>
          <p className="mt-2 text-stone-600">{recipe.description}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to={`/recipes/${recipe.id}/cook?step=1`}>
            <Button>Start Cooking</Button>
          </Link>

          <Link to={`/recipes/${recipe.id}/edit`}>
            <Button variant="secondary">Edit</Button>
          </Link>
        </div>
      </div>

      <Card>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Servings
            </p>
            <p className="mt-1 text-lg font-semibold">{recipe.servings}</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Prep Time
            </p>
            <p className="mt-1 text-lg font-semibold">{recipe.prepTime} min</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Cook Time
            </p>
            <p className="mt-1 text-lg font-semibold">{recipe.cookTime} min</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">Recipe Ingredients</h2>
        <ul className="mt-4 space-y-3">
          {recipe.ingredients.map((item) => (
            <li key={item.id} className="text-sm text-stone-700">
              <span className="font-medium">
                {item.quantity} {item.unit}
              </span>{" "}
              {item.ingredient}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">Steps</h2>
        <ol className="mt-4 space-y-4">
          {recipe.steps.map((step, index) => (
            <li
              key={step.id}
              className="rounded-2xl border border-stone-200 p-4"
            >
              <p className="text-sm font-medium text-stone-500">
                Step {index + 1}
              </p>

              <p className="mt-2 text-sm text-stone-800">
                {step.instruction}
              </p>

              {step.ingredients?.length > 0 && (
                <div className="mt-4 rounded-2xl bg-stone-50 p-4">
                  <p className="text-sm font-medium text-stone-700">
                    Ingredients Used In This Step
                  </p>

                  <ul className="mt-3 space-y-2">
                    {step.ingredients.map((ingredient) => (
                      <li
                        key={ingredient.id}
                        className="text-sm text-stone-700"
                      >
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
                <p className="mt-3 text-sm text-stone-600">
                  Prep note: {step.prepNote}
                </p>
              )}

              {step.timerMinutes && (
                <p className="mt-2 text-sm text-stone-600">
                  Timer: {step.timerMinutes} min
                </p>
              )}
            </li>
          ))}
        </ol>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">Notes</h2>
        <p className="mt-4 text-sm text-stone-700">
          {recipe.notes || "No notes yet."}
        </p>
      </Card>
    </section>
  );
}