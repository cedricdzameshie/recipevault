import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import RecipeGrid from "../components/recipes/RecipeGrid";
import { fetchFolders } from "../api/folders";

export default function FolderDetailPage() {
  const { id } = useParams();

  const [folder, setFolder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadFolder() {
      try {
        setIsLoading(true);
        setError("");

        const folders = await fetchFolders();
        const matchedFolder = folders.find((item) => item.id === id);

        if (isMounted) {
          setFolder(matchedFolder || null);
        }
      } catch (err) {
        console.error("Failed to load folder:", err);

        if (isMounted) {
          setError(err.message || "Failed to load folder");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFolder();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <section>
        <PageHeader
          title="Loading Folder..."
          backTo="/folders"
          backLabel="Back to Folders"
        />
      </section>
    );
  }

  if (error || !folder) {
    return (
      <section>
        <PageHeader
          title="Folder Not Found"
          description={error || "We couldn't find that folder."}
          backTo="/folders"
          backLabel="Back to Folders"
        />
      </section>
    );
  }

  const recipes = folder.recipes || [];

  return (
    <section className="space-y-6">
      <PageHeader
        title={folder.name}
        description={`${recipes.length} recipe${recipes.length === 1 ? "" : "s"} in this folder`}
        backTo="/folders"
        backLabel="Back to Folders"
        action={
          <Link to={`/recipes/new?folderId=${folder.id}`}>
            <Button>Add Recipe</Button>
          </Link>
        }
      />

      {recipes.length > 0 ? (
        <RecipeGrid recipes={recipes} />
      ) : (
        <Card>
          <div className="space-y-3">
            <p className="text-sm text-stone-600">
              No recipes in this folder yet.
            </p>

            <div>
              <Link to="/recipes">
                <Button variant="secondary">Browse Recipes</Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </section>
  );
}