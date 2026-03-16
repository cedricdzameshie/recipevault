import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../common/Card";
import Button from "../common/Button";
import DashboardSection from "./DashboardSection";
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
    <DashboardSection
      title="Folders"
      action={
        <Link to="/folders">
          <Button variant="secondary">View All</Button>
        </Link>
      }
    >
      {isLoading ? (
        <Card>
          <p className="text-sm text-stone-600">Loading folders...</p>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      ) : folders.length === 0 ? (
        <Card>
          <p className="text-sm text-stone-600">No folders yet.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {folders.map((folder) => (
            <Card key={folder.id}>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-stone-900">{folder.name}</h3>
                <p className="text-sm text-stone-600">
                  {folder.recipes?.length || 0} recipe
                  {(folder.recipes?.length || 0) === 1 ? "" : "s"}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardSection>
  );
}