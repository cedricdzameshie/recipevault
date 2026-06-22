const COOKING_PROGRESS_KEY = "continueCooking";
const COOKING_PROGRESS_VERSION = 1;
const VALID_SCALES = [1, 2, 4, 8];

function normalizeStepNumber(value) {
  const stepNumber = Number(value);

  if (!Number.isFinite(stepNumber) || stepNumber < 1) {
    return 1;
  }

  return Math.floor(stepNumber);
}

function normalizeScale(value) {
  const scale = Number(value);

  return VALID_SCALES.includes(scale) ? scale : 1;
}

function normalizeProgress(progress) {
  if (!progress || typeof progress !== "object") {
    return null;
  }

  if (progress.recipeId === undefined || progress.recipeId === null) {
    return null;
  }

  return {
    version: COOKING_PROGRESS_VERSION,
    recipeId: progress.recipeId,

    // `step` supports the older RecipeVault saved format.
    stepNumber: normalizeStepNumber(progress.stepNumber ?? progress.step ?? 1),

    // Stable step ID will protect resume behavior after step reordering.
    stepId: progress.stepId ?? null,

    scale: normalizeScale(progress.scale),

    checkedIngredientIds: Array.isArray(progress.checkedIngredientIds)
      ? progress.checkedIngredientIds
      : [],

    timers: Array.isArray(progress.timers) ? progress.timers : [],

    updatedAt:
      typeof progress.updatedAt === "string" ? progress.updatedAt : null,
  };
}

export function getCookingProgress(recipeId = null) {
  try {
    const storedProgress = localStorage.getItem(COOKING_PROGRESS_KEY);

    if (!storedProgress) {
      return null;
    }

    const parsedProgress = JSON.parse(storedProgress);
    const normalizedProgress = normalizeProgress(parsedProgress);

    if (!normalizedProgress) {
      return null;
    }

    if (
      recipeId !== null &&
      String(normalizedProgress.recipeId) !== String(recipeId)
    ) {
      return null;
    }

    return normalizedProgress;
  } catch (error) {
    console.error("Failed to read cooking progress:", error);
    return null;
  }
}

export function saveCookingProgress(progress) {
  try {
    const normalizedProgress = normalizeProgress({
      ...progress,
      updatedAt: new Date().toISOString(),
    });

    if (!normalizedProgress) {
      throw new Error("Invalid cooking progress");
    }

    localStorage.setItem(
      COOKING_PROGRESS_KEY,
      JSON.stringify(normalizedProgress),
    );

    return normalizedProgress;
  } catch (error) {
    console.error("Failed to save cooking progress:", error);
    return null;
  }
}

export function updateCookingProgress(recipeId, updates = {}) {
  const existingProgress = getCookingProgress(recipeId);

  return saveCookingProgress({
    version: COOKING_PROGRESS_VERSION,
    recipeId,
    stepId: null,
    stepNumber: 1,
    scale: 1,
    checkedIngredientIds: [],
    timers: [],
    ...existingProgress,
    ...updates,
  });
}

export function clearCookingProgress(recipeId = null) {
  try {
    if (recipeId !== null) {
      const existingProgress = getCookingProgress();

      if (
        !existingProgress ||
        String(existingProgress.recipeId) !== String(recipeId)
      ) {
        return false;
      }
    }

    localStorage.removeItem(COOKING_PROGRESS_KEY);
    return true;
  } catch (error) {
    console.error("Failed to clear cooking progress:", error);
    return false;
  }
}
