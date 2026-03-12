import Input from "../common/Input";
import Textarea from "../common/Textarea";
import Card from "../common/Card";

export default function RecipeBasicsFields({ formData, onChange }) {
  return (
    <Card>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recipe Basics</h2>

        <Input
          label="Recipe Title"
          name="title"
          value={formData.title}
          onChange={onChange}
          placeholder="Ex: Simple Sourdough Loaf"
        />

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Short description of the recipe"
          rows={3}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Servings"
            name="servings"
            type="number"
            value={formData.servings}
            onChange={onChange}
            placeholder="4"
          />

          <Input
            label="Prep Time (min)"
            name="prepTime"
            type="number"
            value={formData.prepTime}
            onChange={onChange}
            placeholder="30"
          />

          <Input
            label="Cook Time (min)"
            name="cookTime"
            type="number"
            value={formData.cookTime}
            onChange={onChange}
            placeholder="45"
          />
        </div>
      </div>
    </Card>
  );
}