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
  const [updatingFolderId, setUpdatingFolderId] = useState(null);
  const [deletingFolderId, setDeletingFolderId] = useState(null);
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

      setFolders((prev) => [{ recipes: [], ...createdFolder }, ...prev]);
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
      setUpdatingFolderId(folderId);
      setError("");

      const updated = await updateFolder(folderId, { name: trimmed });

      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === folderId ? { ...folder, ...updated } : folder
        )
      );

      setEditingFolderId(null);
      setEditingName("");
    } catch (err) {
      console.error("Failed to update folder:", err);
      setError(err.message || "Failed to update folder");
    } finally {
      setUpdatingFolderId(null);
    }
  }

  function handleCancelEdit() {
    setEditingFolderId(null);
    setEditingName("");
  }

  async function handleDeleteFolder(folder) {
    const confirmed = window.confirm(
      `Delete "${folder.name}"? Recipes connected to this folder may no longer be organized under it.`
    );

    if (!confirmed) return;

    try {
      setDeletingFolderId(folder.id);
      setError("");

      await deleteFolderById(folder.id);

      setFolders((prev) =>
        prev.filter((currentFolder) => currentFolder.id !== folder.id)
      );

      if (editingFolderId === folder.id) {
        handleCancelEdit();
      }
    } catch (err) {
      console.error("Failed to delete folder:", err);
      setError(err.message || "Failed to delete folder");
    } finally {
      setDeletingFolderId(null);
    }
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-5 pb-8 sm:space-y-6">
      <PageHeader
        title="Folders"
        description="Group your recipes into collections that are easy to browse."
        backTo="/dashboard"
        backLabel="Back to Dashboard"
      />

      <Card className="border-stone-300/70 bg-white/95">
        <form onSubmit={handleAddFolder} className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/60">
              Create Folder
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-stone-950">
              Organize your recipe vault
            </h2>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              Create folders like Family Recipes, Desserts, Weeknight Meals, or
              Smoker Favorites.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <Input
              label="Folder Name"
              name="folderName"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Ex: Holiday Bakes"
            />

            <Button
              type="submit"
              disabled={isCreating || !newFolderName.trim()}
              className="min-h-11 w-full sm:w-auto"
            >
              {isCreating ? "Creating..." : "Create Folder"}
            </Button>
          </div>
        </form>
      </Card>

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm"
        >
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <Card className="border-stone-300/70 bg-white/95">
          <p className="text-sm text-stone-600">Loading folders...</p>
        </Card>
      ) : folders.length === 0 ? (
        <Card className="border-stone-300/70 bg-white/95">
          <div className="space-y-3 text-center">
            <h2 className="text-xl font-bold tracking-tight text-stone-950">
              No folders yet
            </h2>

            <p className="text-sm leading-6 text-stone-500">
              Create your first folder to start grouping recipes by family,
              meal type, baking style, or favorites.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/60">
                Your Folders
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-rv-plum">
                Recipe collections
              </h2>
            </div>

            <div className="rounded-full border border-stone-200 bg-white/90 px-3 py-1 text-sm font-semibold text-stone-600">
              {folders.length} {folders.length === 1 ? "folder" : "folders"}
            </div>
          </div>

          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            {folders.map((folder) => {
              const isEditing = editingFolderId === folder.id;
              const isUpdating = updatingFolderId === folder.id;
              const isDeleting = deletingFolderId === folder.id;
              const recipeCount = folder.recipes?.length || 0;
              const previewRecipes = folder.recipes?.slice(0, 3) || [];
              const extraRecipeCount = Math.max(recipeCount - 3, 0);

              return (
                <Card
                  key={folder.id}
                  className="border-stone-300/70 bg-white/95"
                >
                  <div className="flex h-full flex-col gap-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <Input
                          label="Folder Name"
                          name="editFolderName"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          placeholder="Folder name"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            onClick={() => handleSaveEdit(folder.id)}
                            disabled={isUpdating || !editingName.trim()}
                          >
                            {isUpdating ? "Saving..." : "Save"}
                          </Button>

                          <Button
                            type="button"
                            variant="secondary"
                            onClick={handleCancelEdit}
                            disabled={isUpdating}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
  <h3 className="break-words text-xl font-bold tracking-tight text-rv-plum">
    {folder.name}
  </h3>

  <p className="mt-2 text-sm font-medium text-stone-500">
    {recipeCount} {recipeCount === 1 ? "recipe" : "recipes"}
  </p>
</div>

                        {previewRecipes.length > 0 ? (
                          <div className="rounded-2xl border border-stone-200 bg-rv-cream/45 p-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rv-plum/60">
                              Inside
                            </p>

                            <ul className="mt-2 space-y-1.5">
                              {previewRecipes.map((recipe) => (
                                <li key={recipe.id}>
                                  <Link
                                    to={`/recipes/${recipe.id}`}
                                    className="block truncate text-sm font-medium text-stone-700 transition hover:text-rv-plum"
                                  >
                                    {recipe.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>

                            {extraRecipeCount > 0 ? (
                              <p className="mt-2 text-xs font-medium text-stone-500">
                                +{extraRecipeCount} more
                              </p>
                            ) : null}
                          </div>
                        ) : (
                          <div className="rounded-2xl border border-dashed border-stone-300 bg-rv-cream/45 px-4 py-4 text-center">
                            <p className="text-sm font-semibold text-stone-800">
                              Empty folder
                            </p>

                            <p className="mt-1 text-xs leading-5 text-stone-500">
                              Add recipes to this folder from a recipe detail
                              page.
                            </p>
                          </div>
                        )}

                        <div className="mt-auto space-y-3">
                          <Link to={`/folders/${folder.id}`} className="block">
                            <Button type="button" className="w-full">
                              View Recipes
                            </Button>
                          </Link>

                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => handleStartEdit(folder)}
                              disabled={isDeleting}
                            >
                              Rename
                            </Button>

                            <button
                              type="button"
                              onClick={() => handleDeleteFolder(folder)}
                              disabled={isDeleting}
                              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}