import { useMemo, useState } from "react";
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
import { normalizeIngredientQuantity } from "../utils/ingredientQuantity";

function toNullableNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function getImportWarnings(recipe) {
  if (!recipe?.ingredients?.length) {
    return [];
  }

  return recipe.ingredients.flatMap((ingredient, index) =>
    (ingredient.warnings || []).map((warning) => ({
      id: `${index}-${warning}`,
      ingredientNumber: index + 1,
      ingredientName:
        ingredient.name?.trim() ||
        ingredient.originalLine?.trim() ||
        "Unnamed ingredient",
      originalLine: ingredient.originalLine?.trim() || "",
      message: warning,
    }))
  );
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
      .map((ingredient, index) => ({
        id: ingredient.id,
        name: ingredient.ingredient?.trim() || "",
        quantity: normalizeIngredientQuantity(ingredient.quantity) || null,
        unit: normalizeIngredientUnit(ingredient.unit) || null,
        position: index + 1,
      }))
      .filter((ingredient) => ingredient.name),
    steps: (formValues.steps || [])
      .filter((step) => step.instruction?.trim())
      .map((step, stepIndex) => ({
        id: step.id,
        instruction: step.instruction.trim(),
        prepNote: step.prepNote?.trim() || "",
        timerMinutes: toNullableNumber(step.timerMinutes),
        position: stepIndex + 1,
        ingredients: (step.ingredients || [])
          .filter(
            (ingredient) =>
              ingredient.ingredientId || ingredient.ingredient?.trim()
          )
          .map((ingredient, ingredientIndex) => ({
            id: ingredient.id,
            ingredientId: ingredient.ingredientId || null,
            name: ingredient.ingredient?.trim() || "",
            quantity: normalizeIngredientQuantity(ingredient.quantity) || null,
            unit: normalizeIngredientUnit(ingredient.unit) || null,
            position: ingredientIndex + 1,
          })),
      })),
  };
}

function buildImportedRecipeFormData(importedRecipe) {
  const ingredientIdMap = new Map();

  const ingredients = (importedRecipe.ingredients || []).map((item, index) => {
    const browserId = crypto.randomUUID();
    const sourceTempId = item.tempId || `ingredient-${index + 1}`;

    ingredientIdMap.set(sourceTempId, {
      id: browserId,
      name: item.name || "",
      quantity: normalizeIngredientQuantity(item.quantity),
      unit: normalizeIngredientUnit(item.unit) || "",
    });

    return {
      id: browserId,
      quantity: normalizeIngredientQuantity(item.quantity),
      unit: normalizeIngredientUnit(item.unit) || "",
      ingredient: item.name || "",
      originalLine: item.originalLine || "",
      warnings: item.warnings || [],
    };
  });

  const steps = (importedRecipe.steps || []).map((step) => {
    const linkedIngredients = (step.ingredientRefs || [])
      .map((reference) => {
        const matchedIngredient = ingredientIdMap.get(
          reference.ingredientTempId
        );

        if (!matchedIngredient) {
          return null;
        }

        return {
          id: crypto.randomUUID(),
          ingredientId: matchedIngredient.id,
          ingredient: matchedIngredient.name,
          quantity: matchedIngredient.quantity,
          unit: matchedIngredient.unit,
          confidence: reference.confidence,
        };
      })
      .filter(Boolean);

    return {
      id: crypto.randomUUID(),
      instruction: step.instruction || "",
      prepNote: "",
      timerMinutes: "",
      ingredients: linkedIngredients,
    };
  });

  return {
    ...importedRecipe,
    ingredients,
    steps,
  };
}

function getImportSourceLabel(mode, recipeUrl, recipeText) {
  if (mode === "url" && recipeUrl.trim()) {
    return recipeUrl.trim();
  }

  if (recipeText.trim()) {
    return "Pasted recipe text";
  }

  return "No source entered yet";
}

function ImportWarningsReview({ warnings }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (warnings.length === 0) {
    return null;
  }

  const warningCountLabel =
    warnings.length === 1
      ? "1 measurement may need review"
      : `${warnings.length} measurements may need review`;

  return (
    <Card className="border-amber-200 bg-amber-50/70">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              Review Needed
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-stone-950">
              Imported Measurements
            </h2>

            <p className="mt-2 text-sm leading-6 text-stone-700">
              {warningCountLabel}. RecipeVault preserved the original
              measurements so you can confirm or adjust them before saving.
            </p>

            <p className="mt-2 text-xs leading-5 text-stone-500">
              These notices do not prevent saving.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Hide Review" : "Show Review"}
          </Button>
        </div>

        {isExpanded ? (
          <div className="space-y-3 border-t border-amber-200 pt-4">
            {warnings.map((warning) => (
              <div
                key={warning.id}
                className="rounded-2xl border border-amber-200 bg-white px-4 py-3"
              >
                <p className="text-sm font-bold text-stone-900">
                  Ingredient {warning.ingredientNumber}:{" "}
                  {warning.ingredientName}
                </p>

                {warning.originalLine ? (
                  <p className="mt-2 break-words text-sm leading-6 text-stone-700">
                    {warning.originalLine}
                  </p>
                ) : null}

                <p className="mt-2 text-sm font-medium text-amber-800">
                  {warning.message}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export default function ImportRecipePage() {
  const navigate = useNavigate();

  const [recipeText, setRecipeText] = useState("");
  const [recipeUrl, setRecipeUrl] = useState("");
  const [mode, setMode] = useState("text");
  const [importedRecipe, setImportedRecipe] = useState(null);
  const [importVersion, setImportVersion] = useState(0);
  const [isImportPanelOpen, setIsImportPanelOpen] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const importWarnings = getImportWarnings(importedRecipe);

  const importedFormData = useMemo(() => {
    if (!importedRecipe) {
      return null;
    }

    return buildImportedRecipeFormData(importedRecipe);
  }, [importedRecipe]);

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
      setImportVersion((prev) => prev + 1);
      setIsImportPanelOpen(false);
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

  const importSourceLabel = getImportSourceLabel(mode, recipeUrl, recipeText);

  return (
    <section className="mx-auto w-full max-w-4xl space-y-5 pb-8 sm:space-y-6">
      <PageHeader
        title="Import Recipe"
        description="Paste recipe text or a recipe URL and let AI structure it for you."
        backTo="/dashboard"
        backLabel="Back to Dashboard"
      />

      {importedRecipe && !isImportPanelOpen ? (
        <Card className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/60">
                Import Source
              </p>

              <h2 className="mt-1 text-xl font-bold tracking-tight text-stone-950">
                Recipe Imported
              </h2>

              <p className="mt-2 break-words text-sm leading-6 text-stone-600">
                {importSourceLabel}
              </p>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsImportPanelOpen(true)}
            >
              Change Source
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/60">
              Import Source
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-stone-950">
              Choose Import Method
            </h2>

            <p className="mt-1 text-sm leading-6 text-stone-500">
              Paste a recipe URL or full recipe text. You can review everything
              before saving.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
                rows={10}
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

            <Button type="submit" variant="accent" disabled={isImporting}>
              {isImporting ? "Importing..." : "Import with AI"}
            </Button>
          </form>
        </Card>
      )}

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm"
        >
          {error}
        </div>
      ) : null}

      {importedRecipe && importedFormData ? (
        <div className="space-y-5 sm:space-y-6">
          <ImportWarningsReview warnings={importWarnings} />

          <RecipeForm
            key={importVersion}
            initialData={importedFormData}
            submitLabel={isSaving ? "Saving..." : "Save Imported Recipe"}
            onSubmitRecipe={handleSaveImportedRecipe}
            cancelTo="/dashboard"
          />
        </div>
      ) : null}
    </section>
  );
}