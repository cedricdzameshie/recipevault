import Input from "../common/Input";
import Textarea from "../common/Textarea";
import Card from "../common/Card";

export default function RecipeBasicsFields({
  formData,
  onChange,
  folders = [],
}) {
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

        <div className="space-y-2">
          <label
            htmlFor="folderId"
            className="text-sm font-medium text-stone-700"
          >
            Folder
          </label>

          <select
            id="folderId"
            name="folderId"
            value={formData.folderId}
            onChange={onChange}
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-400"
          >
            <option value="">No Folder</option>

            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
}