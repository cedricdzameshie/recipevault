import PageHeader from "../components/common/PageHeader";
import RecipeForm from "../components/recipe-form/RecipeForm";

export default function NewRecipePage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="New Recipe"
        description="Create and organize a new recipe."
      />

      <RecipeForm />
    </section>
  );
}