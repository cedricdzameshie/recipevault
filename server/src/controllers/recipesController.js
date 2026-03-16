import prisma from "../prisma/prismaClient.js";

const recipeInclude = {
  folder: true,
  ingredients: {
    orderBy: { position: "asc" },
  },
  steps: {
    orderBy: { position: "asc" },
  },
  reminders: true,
};

export async function getRecipes(req, res) {
  try {
    const recipes = await prisma.recipe.findMany({
      include: recipeInclude,
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
      include: recipeInclude,
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
      include: recipeInclude,
    });

    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ error: "Failed to create recipe" });
  }
}

export async function updateRecipe(req, res) {
  try {
    const { id } = req.params;
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

    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!existingRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const updatedRecipe = await prisma.$transaction(async (tx) => {
      await tx.ingredient.deleteMany({
        where: { recipeId: id },
      });

      await tx.step.deleteMany({
        where: { recipeId: id },
      });

      await tx.recipe.update({
        where: { id },
        data: {
          title: title.trim(),
          description,
          servings,
          prepTime,
          cookTime,
          notes,
          folderId: folderId || null,
        },
      });

      await tx.ingredient.createMany({
        data: ingredients.map((ingredient, index) => ({
          recipeId: id,
          name: ingredient.name,
          quantity: ingredient.quantity || null,
          unit: ingredient.unit || null,
          position: ingredient.position ?? index + 1,
        })),
      });

      await tx.step.createMany({
        data: steps.map((step, index) => ({
          recipeId: id,
          instruction: step.instruction,
          position: step.position ?? index + 1,
        })),
      });

      return tx.recipe.findUnique({
        where: { id },
        include: recipeInclude,
      });
    });

    res.json(updatedRecipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ error: "Failed to update recipe" });
  }
}

export async function deleteRecipe(req, res) {
  try {
    const { id } = req.params;

    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!existingRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    await prisma.recipe.delete({
      where: { id },
    });

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ error: "Failed to delete recipe" });
  }
}

export async function toggleFavorite(req, res) {
  try {
    const { id } = req.params;

    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!existingRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const updatedRecipe = await prisma.recipe.update({
      where: { id },
      data: {
        isFavorite: !existingRecipe.isFavorite,
      },
      include: recipeInclude,
    });

    res.json(updatedRecipe);
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ error: "Failed to toggle favorite" });
  }
}
