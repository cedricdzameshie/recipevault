const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export async function fetchFolders() {
  const response = await fetch(`${API_BASE_URL}/folders`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch folders");
  }

  return data;
}

export async function createFolder(folderData) {
  const response = await fetch(`${API_BASE_URL}/folders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(folderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create folder");
  }

  return data;
}

export async function updateFolder(id, folderData) {
  const response = await fetch(`${API_BASE_URL}/folders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(folderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update folder");
  }

  return data;
}

export async function deleteFolderById(id) {
  const response = await fetch(`${API_BASE_URL}/folders/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to delete folder");
  }

  return data;
}
