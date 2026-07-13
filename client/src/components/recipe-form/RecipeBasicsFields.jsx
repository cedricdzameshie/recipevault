import { useState } from "react";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import Card from "../common/Card";
import Button from "../common/Button";

function createDescriptionPreview(description) {
  const trimmedDescription = description?.trim();

  if (!trimmedDescription) {
    return "No description added yet.";
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
  const [isExpanded, setIsExpanded] = useState(!formData.title?.trim());

  const selectedFolder = folders.find(
    (folder) => folder.id === formData.folderId
  );

  const folderLabel = selectedFolder?.name || "No folder selected";

  const detailItems = [
    formData.servings ? `${formData.servings} servings` : "No servings",
    formData.prepTime ? `${formData.prepTime} min prep` : "No prep time",
    formData.cookTime ? `${formData.cookTime} min cook` : "No cook time",
    folderLabel,
  ];

  return (
    <Card className="overflow-hidden">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/60">
              Step 1
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-stone-950">
              Recipe Basics
            </h2>

            <p className="mt-1 text-sm leading-6 text-stone-500">
              Start with the name, timing, servings, and where this recipe
              should live.
            </p>
          </div>

          {!isExpanded ? (
            <div className="w-full sm:w-auto">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsExpanded(true)}
                aria-expanded={isExpanded}
              >
                Edit Basics
              </Button>
            </div>
          ) : null}
        </div>

        {!isExpanded ? (
          <div className="rounded-2xl border border-stone-200/80 bg-stone-50/80 p-4">
            <p className="text-lg font-bold leading-tight text-stone-950">
              {formData.title?.trim() || "Untitled Recipe"}
            </p>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              {createDescriptionPreview(formData.description)}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {detailItems.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {isExpanded ? (
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
              placeholder="A short note about what makes this recipe useful."
              rows={3}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <Input
                label="Servings"
                name="servings"
                type="number"
                value={formData.servings}
                onChange={onChange}
                placeholder="4"
              />

              <Input
                label="Prep Time"
                name="prepTime"
                type="number"
                value={formData.prepTime}
                onChange={onChange}
                placeholder="30 min"
              />

              <Input
                label="Cook Time"
                name="cookTime"
                type="number"
                value={formData.cookTime}
                onChange={onChange}
                placeholder="45 min"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="folderId"
                className="text-sm font-semibold text-stone-700"
              >
                Folder
              </label>

              <select
                id="folderId"
                name="folderId"
                value={formData.folderId}
                onChange={onChange}
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 outline-none transition hover:border-stone-400 focus:border-rv-plum focus:ring-2 focus:ring-rv-plum/10 sm:text-sm"
              >
                <option value="">No Folder</option>

                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>

              <p className="text-xs leading-5 text-stone-500">
                You can leave this empty and organize it later.
              </p>
            </div>

            <div className="flex justify-end border-t border-stone-200 pt-4">
              <div className="w-full sm:w-auto">
                <Button type="button" onClick={() => setIsExpanded(false)}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}