import RecipeCard from "./RecipeCard";

export default function RecipeGrid({ recipes }) {
  return (
    <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}