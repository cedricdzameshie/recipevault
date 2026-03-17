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
    <Card className="border-stone-300/70 bg-white/95">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/65">
              Folders
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-rv-plum">
              Keep recipes organized
            </h2>
          </div>

          <Link to="/folders">
            <Button variant="secondary">Manage</Button>
          </Link>
        </div>

        {isLoading ? (
          <p className="text-sm text-stone-600">Loading folders...</p>
        ) : error ? (
          <p className="text-sm text-rv-coral">{error}</p>
        ) : folders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-rv-cream/50 px-4 py-4">
            <p className="text-sm text-stone-600">
              No folders yet. Create one to start organizing recipes.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {folders.map((folder) => {
              const recipeCount = folder.recipes?.length || 0;

              return (
                <Link
                  key={folder.id}
                  to={`/folders/${folder.id}`}
                  className="block"
                >
                  <div className="rounded-2xl border border-stone-200 bg-rv-cream/55 px-4 py-4 transition hover:-translate-y-0.5 hover:border-rv-teal/50 hover:bg-rv-teal/10">
                    <p className="text-base font-semibold text-rv-plum">
                      {folder.name}
                    </p>
                    <p className="mt-2 text-sm text-stone-600">
                      {recipeCount} recipe{recipeCount === 1 ? "" : "s"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}