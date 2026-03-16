import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import {
  fetchFolders,
  createFolder,
  updateFolder,
  deleteFolderById,
} from "../api/folders";

export default function FoldersPage() {
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadFolders() {
      try {
        setIsLoading(true);
        setError("");

        const data = await fetchFolders();

        if (isMounted) {
          setFolders(data);
        }
      } catch (err) {
        console.error("Failed to load folders:", err);

        if (isMounted) {
          setError(err.message || "Failed to load folders");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFolders();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleAddFolder(e) {
    e.preventDefault();

    const trimmed = newFolderName.trim();
    if (!trimmed) return;

    try {
      setIsCreating(true);
      setError("");

      const createdFolder = await createFolder({ name: trimmed });

      setFolders((prev) => [createdFolder, ...prev]);
      setNewFolderName("");
    } catch (err) {
      console.error("Failed to create folder:", err);
      setError(err.message || "Failed to create folder");
    } finally {
      setIsCreating(false);
    }
  }

  function handleStartEdit(folder) {
    setEditingFolderId(folder.id);
    setEditingName(folder.name);
  }

  async function handleSaveEdit(folderId) {
    const trimmed = editingName.trim();
    if (!trimmed) return;

    try {
      setError("");

      const updated = await updateFolder(folderId, { name: trimmed });

      setFolders((prev) =>
        prev.map((folder) => (folder.id === folderId ? updated : folder))
      );

      setEditingFolderId(null);
      setEditingName("");
    } catch (err) {
      console.error("Failed to update folder:", err);
      setError(err.message || "Failed to update folder");
    }
  }

  function handleCancelEdit() {
    setEditingFolderId(null);
    setEditingName("");
  }

  async function handleDeleteFolder(folderId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this folder?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await deleteFolderById(folderId);

      setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
    } catch (err) {
      console.error("Failed to delete folder:", err);
      setError(err.message || "Failed to delete folder");
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Folders"
        description="Create, rename, and organize recipe folders."
        backTo="/dashboard"
        backLabel="Back to Dashboard"
      />

      <Card>
        <form onSubmit={handleAddFolder} className="space-y-4">
          <Input
            label="New Folder Name"
            name="folderName"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Ex: Holiday Bakes"
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Adding..." : "Add Folder"}
            </Button>
          </div>
        </form>
      </Card>

      {error ? (
        <Card>
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      ) : null}

      {isLoading ? (
        <Card>
          <p className="text-sm text-stone-600">Loading folders...</p>
        </Card>
      ) : folders.length === 0 ? (
        <Card>
          <p className="text-sm text-stone-600">
            No folders yet. Create one to start organizing recipes.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {folders.map((folder) => {
            const isEditing = editingFolderId === folder.id;
            const recipeCount = folder.recipes?.length || 0;

            return (
              <Card key={folder.id}>
                <div className="space-y-4">
                  {isEditing ? (
                    <Input
                      label="Edit Folder Name"
                      name="editFolderName"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      placeholder="Folder name"
                    />
                  ) : (
                    <div className="space-y-2">
                      <h2 className="text-lg font-semibold text-stone-900">
                        {folder.name}
                      </h2>

                      <p className="text-sm text-stone-600">
                        {recipeCount} recipe{recipeCount === 1 ? "" : "s"}
                      </p>

                      {recipeCount > 0 ? (
                        <ul className="space-y-1">
                          {folder.recipes.slice(0, 4).map((recipe) => (
                            <li key={recipe.id}>
                              <Link
                                to={`/recipes/${recipe.id}`}
                                className="text-sm text-stone-700 underline-offset-2 hover:text-stone-900 hover:underline"
                              >
                                {recipe.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-stone-500">
                          No recipes in this folder yet.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {isEditing ? (
                      <>
                        <Button onClick={() => handleSaveEdit(folder.id)}>
                          Save
                        </Button>
                        <Button variant="secondary" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="secondary"
                        onClick={() => handleStartEdit(folder)}
                      >
                        Rename
                      </Button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteFolder(folder.id)}
                      className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}