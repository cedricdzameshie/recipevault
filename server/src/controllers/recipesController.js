import prisma from "../prisma/prismaClient.js";

export async function getRecipes(req, res) {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        folder: true,
        ingredients: {
          orderBy: { position: "asc" },
        },
        steps: {
          orderBy: { position: "asc" },
        },
        reminders: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
}

export async function getRecipeById(req, res) {
  try {
    const { id } = req.params;

    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        folder: true,
        ingredients: {
          orderBy: { position: "asc" },
        },
        steps: {
          orderBy: { position: "asc" },
        },
        reminders: true,
      },
    });

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
}

export async function createRecipe(req, res) {
  try {
    const {
      title,
      description,
      servings,
      prepTime,
      cookTime,
      notes,
      folderId,
      ingredients = [],
      steps = [],
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const newRecipe = await prisma.recipe.create({
      data: {
        title: title.trim(),
        description,
        servings,
        prepTime,
        cookTime,
        notes,
        folderId: folderId || null,
        ingredients: {
          create: ingredients.map((ingredient, index) => ({
            name: ingredient.name,
            quantity: ingredient.quantity || null,
            unit: ingredient.unit || null,
            position: ingredient.position ?? index + 1,
          })),
        },
        steps: {
          create: steps.map((step, index) => ({
            instruction: step.instruction,
            position: step.position ?? index + 1,
          })),
        },
      },
      include: {
        folder: true,
        ingredients: {
          orderBy: { position: "asc" },
        },
        steps: {
          orderBy: { position: "asc" },
        },
        reminders: true,
      },
    });

    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ error: "Failed to create recipe" });
  }
}
