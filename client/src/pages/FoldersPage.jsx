import { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Input from "../components/common/Input";

function createId() {
  return crypto.randomUUID();
}

export default function FoldersPage() {
  const [folders, setFolders] = useState([
    { id: createId(), name: "Breads" },
    { id: createId(), name: "Cookies" },
    { id: createId(), name: "Cakes" },
    { id: createId(), name: "Bakery Test" },
    { id: createId(), name: "Family Recipes" },
  ]);

  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingName, setEditingName] = useState("");

  function handleAddFolder(e) {
    e.preventDefault();

    const trimmed = newFolderName.trim();
    if (!trimmed) return;

    setFolders((prev) => [...prev, { id: createId(), name: trimmed }]);
    setNewFolderName("");
  }

  function handleStartEdit(folder) {
    setEditingFolderId(folder.id);
    setEditingName(folder.name);
  }

  function handleSaveEdit(folderId) {
    const trimmed = editingName.trim();
    if (!trimmed) return;

    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId ? { ...folder, name: trimmed } : folder
      )
    );

    setEditingFolderId(null);
    setEditingName("");
  }

  function handleCancelEdit() {
    setEditingFolderId(null);
    setEditingName("");
  }

  function handleDeleteFolder(folderId) {
    setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
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
            <Button type="submit">Add Folder</Button>
          </div>
        </form>
      </Card>

      <div className="space-y-4">
        {folders.map((folder) => {
          const isEditing = editingFolderId === folder.id;

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
                  <div>
                    <h2 className="text-lg font-semibold text-stone-900">
                      {folder.name}
                    </h2>
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
    </section>
  );
}