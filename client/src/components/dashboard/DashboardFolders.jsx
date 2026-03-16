import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../common/Card";
import Button from "../common/Button";
import { fetchFolders } from "../../api/folders";

export default function DashboardFolders() {
  const [folders, setFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadFolders() {
      try {
        setIsLoading(true);
        setError("");

        const data = await fetchFolders();

        if (isMounted) {
          setFolders(data.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load dashboard folders:", err);

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

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-green-700">
              Folders
            </p>
            <h2 className="mt-1 text-xl font-semibold text-stone-900">
              Keep recipes organized
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/folders">
              <Button variant="secondary">Manage</Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-stone-600">Loading folders...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : folders.length === 0 ? (
          <p className="text-sm text-stone-600">
            No folders yet. Create one to start organizing recipes.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {folders.map((folder) => {
              const recipeCount = folder.recipes?.length || 0;

              return (
                <div
                  key={folder.id}
                  className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3"
                >
                  <p className="text-sm font-semibold text-stone-900">
                    {folder.name}
                  </p>
                  <p className="mt-1 text-xs text-stone-600">
                    {recipeCount} recipe{recipeCount === 1 ? "" : "s"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}