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
            name: { type: "string" },
            quantity: { type: ["string", "null"] },
            unit: { type: ["string", "null"] },
          },
          required: ["name", "quantity", "unit"],
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

async function extractTextFromUrl(recipeUrl) {
  const response = await fetch(recipeUrl, {
    headers: {
      "User-Agent": "RecipeVaultBot/1.0",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch recipe URL");
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
    .replace(/\s+/g, " ")
    .trim();

  return cleaned;
}

export async function importRecipeFromText(req, res) {
  try {
    const { recipeText, recipeUrl } = req.body;

    if (
      (!recipeText || !recipeText.trim()) &&
      (!recipeUrl || !recipeUrl.trim())
    ) {
      return res
        .status(400)
        .json({ error: "Recipe text or recipe URL is required" });
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
                "Ignore ads, popups, local offers, newsletter prompts, and unrelated site text.",
                "Return only the structured fields requested.",
                "If the recipe title is not explicit, infer a reasonable title from the ingredients and steps.",
                "If a field is missing, use null for numbers and empty string for text.",
                "Ingredients must be normalized into name, quantity, and unit.",
                "Steps must be returned as a clean ordered list.",
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
    return res.json(parsed);
  } catch (error) {
    console.error("Error importing recipe:", error);

    return res.status(500).json({
      error: error?.message || "Failed to import recipe",
    });
  }
}
