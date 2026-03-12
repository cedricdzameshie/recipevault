import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import RecipeForm from "../components/recipe-form/RecipeForm";

const recipeData = {
  1: {
    id: 1,
    title: "Sourdough Bread",
    description: "Classic fermented sourdough loaf",
    servings: 4,
    prepTime: 30,
    cookTime: 45,
    notes: "Best results when proofed overnight in the fridge.",
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
        prepNote: "Make sure salt is evenly distributed.",
        timerMinutes: "",
        ingredients: [
          { id: "si3", quantity: "10", unit: "g", ingredient: "salt" },
        ],
      },
    ],
  },
  2: {
    id: 2,
    title: "Focaccia",
    description: "Olive oil bread with herbs",
    servings: 6,
    prepTime: 20,
    cookTime: 30,
    notes: "Top with flaky salt before baking.",
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
  },
  3: {
    id: 3,
    title: "Cinnamon Rolls",
    description: "Sweet bakery rolls",
    servings: 8,
    prepTime: 40,
    cookTime: 25,
    notes: "Add extra cinnamon sugar for a richer filling.",
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
  },
};

export default function EditRecipePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const recipe = recipeData[id];

  const returnTo = searchParams.get("returnTo");
  const step = searchParams.get("step");

  const cancelTo =
    returnTo === "cook" && step
      ? `/recipes/${id}/cook?step=${step}`
      : `/recipes/${id}`;

  function handleSubmitRecipe(payload) {
    console.log("Updated recipe payload:", payload);

    if (returnTo === "cook" && step) {
      navigate(`/recipes/${id}/cook?step=${step}`);
      return;
    }

    navigate(`/recipes/${id}`);
  }

  if (!recipe) {
    return (
      <section>
        <h1 className="text-3xl font-semibold">Recipe Not Found</h1>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title={`Edit ${recipe.title}`}
        description="Update recipe details and continue where you left off."
      />

      <RecipeForm
        initialData={recipe}
        submitLabel="Save Changes"
        cancelTo={cancelTo}
        onSubmitRecipe={handleSubmitRecipe}
      />
    </section>
  );
}