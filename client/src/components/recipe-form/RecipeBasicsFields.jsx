import { useState } from "react";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import Card from "../common/Card";
import Button from "../common/Button";

function createDescriptionPreview(description) {
  const trimmedDescription = description?.trim();

  if (!trimmedDescription) {
    return "No description added";
  }

  if (trimmedDescription.length <= 120) {
    return trimmedDescription;
  }

  return `${trimmedDescription.slice(0, 117)}...`;
}

export default function RecipeBasicsFields({
  formData,
  onChange,
  folders = [],
}) {
  const [isExpanded, setIsExpanded] = useState(
    !formData.title?.trim(),
  );

  const selectedFolder = folders.find(
    (folder) => folder.id === formData.folderId,
  );

  const folderLabel = selectedFolder?.name || "No folder";

  const detailItems = [
    formData.servings
      ? `${formData.servings} servings`
      : "No servings",
    formData.prepTime
      ? `${formData.prepTime} min prep`
      : "No prep time",
    formData.cookTime
      ? `${formData.cookTime} min cook`
      : "No cook time",
  ];

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold">Recipe Basics</h2>

            {!isExpanded && (
              <div className="mt-3">
                <p className="text-lg font-semibold text-stone-900">
                  {formData.title?.trim() || "Untitled Recipe"}
                </p>

                <p className="mt-1 text-sm leading-6 text-stone-500">
                  {createDescriptionPreview(formData.description)}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {detailItems.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-600"
                    >
                      {item}
                    </span>
                  ))}

                  <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-600">
                    {folderLabel}
                  </span>
                </div>
              </div>
            )}
          </div>

          {!isExpanded && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsExpanded(true)}
              aria-expanded={isExpanded}
            >
              Edit Basics
            </Button>
          )}
        </div>

        {isExpanded && (
          <div className="space-y-4 border-t border-stone-200 pt-4">
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
  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 outline-none transition hover:border-stone-400 focus:border-purple-700 focus:ring-2 focus:ring-purple-100 sm:text-sm"
>
  <option value="">No Folder</option>

  {folders.map((folder) => (
    <option key={folder.id} value={folder.id}>
      {folder.name}
    </option>
  ))}
</select>
            </div>

            <div className="flex justify-end border-t border-stone-200 pt-4">
              <Button
                type="button"
                onClick={() => setIsExpanded(false)}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}