import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const recipeImportSchema = {
  name: "recipe_import",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      title: { type: "string" },
      description: { type: "string" },
      servings: { type: ["integer", "null"] },
      prepTime: { type: ["integer", "null"] },
      cookTime: { type: ["integer", "null"] },
      notes: { type: "string" },

      ingredients: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            originalLine: { type: "string" },
            name: { type: "string" },
            quantity: { type: ["string", "null"] },
            unit: { type: ["string", "null"] },
            warnings: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["originalLine", "name", "quantity", "unit", "warnings"],
        },
      },

      steps: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            instruction: { type: "string" },
          },
          required: ["instruction"],
        },
      },
    },
    required: [
      "title",
      "description",
      "servings",
      "prepTime",
      "cookTime",
      "notes",
      "ingredients",
      "steps",
    ],
  },
  strict: true,
};

function cleanRecipeText(text) {
  return text
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/Local Offers[\s\S]*?Directions/i, "Directions")
    .replace(/Oops![\s\S]*?Directions/i, "Directions")
    .trim();
}

function normalizeUrl(recipeUrl) {
  const trimmed = recipeUrl.trim();

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

async function extractTextFromUrl(recipeUrl) {
  const normalizedUrl = normalizeUrl(recipeUrl);

  const response = await fetch(normalizedUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) RecipeVaultBot/1.0",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch recipe URL: ${response.status} ${response.statusText}`,
    );
  }

  const html = await response.text();

  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned || cleaned.length < 100) {
    throw new Error(
      "Could not extract enough recipe text from this URL. Try paste-text import instead.",
    );
  }

  return cleaned.slice(0, 30000);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasComplexMeasurement(value) {
  if (!value) {
    return false;
  }

  return value.includes("+") || /\([^)]*\d[^)]*\)/.test(value);
}

function repairImportedIngredient(ingredient) {
  const originalLine = ingredient.originalLine?.trim() || "";

  const name = ingredient.name?.trim() || "";

  let quantity = ingredient.quantity?.trim() || null;

  const unit = ingredient.unit?.trim() || null;

  const warnings = Array.isArray(ingredient.warnings)
    ? [...ingredient.warnings]
    : [];

  /*
   * If the AI kept the original line but dropped the measurement,
   * try to recover the text that appears before the ingredient name.
   */
  if (!quantity && originalLine && name) {
    const nameAtEndPattern = new RegExp(`\\s*${escapeRegExp(name)}\\s*$`, "i");

    const possibleMeasurement = originalLine
      .replace(nameAtEndPattern, "")
      .replace(/[,\s]+$/g, "")
      .trim();

    if (possibleMeasurement && /\d/.test(possibleMeasurement)) {
      quantity = possibleMeasurement;

      warnings.push("Measurement recovered from the original ingredient text.");
    }
  }

  if (
    hasComplexMeasurement(quantity) &&
    !warnings.includes("Complex measurement preserved for review.")
  ) {
    warnings.push("Complex measurement preserved for review.");
  }

  return {
    ...ingredient,
    originalLine,
    name,
    quantity,
    unit,
    warnings: [...new Set(warnings)],
  };
}

export async function importRecipeFromText(req, res) {
  try {
    const { recipeText, recipeUrl } = req.body;

    if (
      (!recipeText || !recipeText.trim()) &&
      (!recipeUrl || !recipeUrl.trim())
    ) {
      return res.status(400).json({
        error: "Recipe text or recipe URL is required",
      });
    }

    let sourceText = "";

    if (recipeUrl?.trim()) {
      sourceText = await extractTextFromUrl(recipeUrl.trim());
    } else {
      sourceText = cleanRecipeText(recipeText.trim());
    }

    const response = await client.responses.create({
      model: "gpt-5",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: [
                "You extract recipe information from messy pasted recipe text or recipe webpage text.",
                "Ignore ads, popups, local offers, newsletter prompts, comments, reviews, navigation, and unrelated site text.",
                "Return only the structured fields requested.",
                "If the recipe title is not explicit, infer a reasonable title from the ingredients and steps.",
                "Never drop quantities, package sizes, parenthetical measurements, or alternate measurements that appear in the source text.",
                "Preserve the full original ingredient text in originalLine.",
                "Ingredients must be normalized into originalLine, name, quantity, unit, and warnings.",
                "When an ingredient line begins with a measurement, quantity must never be null or empty.",
                "For simple ingredients, split the quantity, unit, and ingredient name as clearly as possible.",
                "For complex measurements such as '1 cup + 1 tablespoon (135 g)', preserve the entire measurement portion in quantity and use null for unit.",
                "For '1 cup + 1 tablespoon (135 g) all-purpose flour', return quantity as '1 cup + 1 tablespoon (135 g)', unit as null, and name as 'all-purpose flour'.",
                "Do not discard parenthetical metric measurements.",
                "If an ingredient has package sizing like '1 (32 ounce) bag', preserve that detail in originalLine and use the clearest possible quantity, unit, and name split.",
                "If quantity and unit cannot be confidently separated, preserve the full measurement text in quantity, use null for unit, and keep the clearest ingredient name in name.",
                "Add 'Complex measurement preserved for review.' to warnings when an ingredient contains multiple measurements or equivalent measurements.",
                "Use an empty warnings array when no review is needed.",
                "Never use quantity 0 for a normal ingredient unless the source explicitly says zero.",
                "Steps must be returned as a clean ordered list.",
                "If a field is missing, use null for numbers and empty string for text.",
              ].join(" "),
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: sourceText,
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: recipeImportSchema.name,
          schema: recipeImportSchema.schema,
          strict: recipeImportSchema.strict,
        },
      },
    });

    const parsed = JSON.parse(response.output_text);

    const repairedRecipe = {
      ...parsed,
      ingredients: (parsed.ingredients || []).map(repairImportedIngredient),
    };

    return res.json(repairedRecipe);
  } catch (error) {
    console.error("Error importing recipe:", error);

    if (error?.code === "insufficient_quota") {
      return res.status(429).json({
        error:
          "AI import is unavailable because the OpenAI API quota is exhausted. Check billing or API credits.",
      });
    }

    if (error?.code === "invalid_api_key") {
      return res.status(401).json({
        error:
          "AI import could not authenticate with the OpenAI API. Check the server API key.",
      });
    }

    return res.status(500).json({
      error: error?.message || "Failed to import recipe",
    });
  }
}
