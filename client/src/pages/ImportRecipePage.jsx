import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Textarea from "../components/common/Textarea";
import Input from "../components/common/Input";
import RecipeForm from "../components/recipe-form/RecipeForm";
import { importRecipe } from "../api/import";
import { createRecipe } from "../api/recipes";
import { normalizeIngredientUnit } from "../utils/ingredientUnits";

function toNullableNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function buildRecipePayload(formValues) {
  return {
    title: formValues.title?.trim() || "",
    description: formValues.description?.trim() || "",
    servings: toNullableNumber(formValues.servings),
    prepTime: toNullableNumber(formValues.prepTime),
    cookTime: toNullableNumber(formValues.cookTime),
    notes: formValues.notes?.trim() || "",
    folderId: formValues.folderId || null,
    ingredients: (formValues.ingredients || [])
      .filter(
        (ingredient) =>
          ingredient.ingredient?.trim() ||
          ingredient.quantity?.trim() ||
          ingredient.unit?.trim()
      )
      .map((ingredient) => ({
        name: ingredient.ingredient?.trim() || "",
        quantity: ingredient.quantity?.trim() || null,
        unit: normalizeIngredientUnit(ingredient.unit) || null,
      }))
      .filter((ingredient) => ingredient.name),
    steps: (formValues.steps || [])
      .filter((step) => step.instruction?.trim())
      .map((step) => ({
        instruction: step.instruction.trim(),
      })),
  };
}

export default function ImportRecipePage() {
  const navigate = useNavigate();

  const [recipeText, setRecipeText] = useState("");
  const [recipeUrl, setRecipeUrl] = useState("");
  const [mode, setMode] = useState("text");
  const [importedRecipe, setImportedRecipe] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleImport(e) {
    e.preventDefault();

    const payload =
      mode === "url"
        ? { recipeUrl: recipeUrl.trim() }
        : { recipeText: recipeText.trim() };

    if (
      (mode === "url" && !payload.recipeUrl) ||
      (mode === "text" && !payload.recipeText)
    ) {
      return;
    }

    try {
      setIsImporting(true);
      setError("");

      const parsed = await importRecipe(payload);
      setImportedRecipe(parsed);
    } catch (err) {
      console.error("Failed to import recipe:", err);
      setError(err.message || "Failed to import recipe");
    } finally {
      setIsImporting(false);
    }
  }

  async function handleSaveImportedRecipe(formValues) {
    try {
      setIsSaving(true);
      setError("");

      const payload = buildRecipePayload(formValues);
      const createdRecipe = await createRecipe(payload);

      navigate(`/recipes/${createdRecipe.id}`);
    } catch (err) {
      console.error("Failed to save imported recipe:", err);
      setError(err.message || "Failed to save imported recipe");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Import Recipe"
        description="Paste recipe text or a recipe URL and let AI structure it for you."
        backTo="/dashboard"
        backLabel="Back to Dashboard"
      />

      <Card className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant={mode === "text" ? "primary" : "secondary"}
            onClick={() => setMode("text")}
          >
            Paste Text
          </Button>

          <Button
            type="button"
            variant={mode === "url" ? "primary" : "secondary"}
            onClick={() => setMode("url")}
          >
            Paste URL
          </Button>
        </div>

        <form onSubmit={handleImport} className="space-y-4">
          {mode === "text" ? (
            <Textarea
              label="Paste Recipe Text"
              name="recipeText"
              value={recipeText}
              onChange={(e) => setRecipeText(e.target.value)}
              rows={12}
              placeholder="Paste a full recipe here..."
            />
          ) : (
            <Input
              label="Recipe URL"
              name="recipeUrl"
              value={recipeUrl}
              onChange={(e) => setRecipeUrl(e.target.value)}
              placeholder="https://example.com/recipe"
            />
          )}

          <div className="flex justify-end">
            <Button type="submit" variant="accent" disabled={isImporting}>
              {isImporting ? "Importing..." : "Import with AI"}
            </Button>
          </div>
        </form>
      </Card>

      {error ? (
        <Card>
          <p className="text-sm text-rv-coral">{error}</p>
        </Card>
      ) : null}

      {importedRecipe ? (
        <RecipeForm
          initialData={{
            ...importedRecipe,
            ingredients: importedRecipe.ingredients?.map((item) => ({
              id: crypto.randomUUID(),
              quantity: item.quantity || "",
              unit: normalizeIngredientUnit(item.unit) || "",
              ingredient: item.name || "",
            })),
            steps: importedRecipe.steps?.map((step) => ({
              id: crypto.randomUUID(),
              instruction: step.instruction || "",
              prepNote: "",
              timerMinutes: "",
              ingredients: [],
            })),
          }}
          submitLabel={isSaving ? "Saving..." : "Save Imported Recipe"}
          onSubmitRecipe={handleSaveImportedRecipe}
        />
      ) : null}
    </section>
  );
}