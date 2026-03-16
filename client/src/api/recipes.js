const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export async function createRecipe(recipeData) {
  const response = await fetch(`${API_BASE_URL}/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipeData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create recipe");
  }

  return data;
}

export async function fetchRecipes() {
  const response = await fetch(`${API_BASE_URL}/recipes`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch recipes");
  }

  return data;
}

export async function fetchRecipeById(id) {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch recipe");
  }

  return data;
}

export async function updateRecipe(id, recipeData) {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipeData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update recipe");
  }

  return data;
}

export async function deleteRecipeById(id) {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to delete recipe");
  }

  return data;
}
