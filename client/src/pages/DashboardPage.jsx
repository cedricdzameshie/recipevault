import { useEffect, useMemo, useState } from "react";
import DashboardWelcome from "../components/dashboard/DashboardWelcome";
import DashboardQuickActions from "../components/dashboard/DashboardQuickActions";
import DashboardRecipePreview from "../components/dashboard/DashboardRecipePreview";
import DashboardContinueCooking from "../components/dashboard/DashboardContinueCooking";
import DashboardFolders from "../components/dashboard/DashboardFolders";
import DashboardReminders from "../components/dashboard/DashboardReminders";
import { fetchRecipes } from "../api/recipes";

export default function DashboardPage() {
  const [recipes, setRecipes] = useState([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
  const [recipesError, setRecipesError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setIsLoadingRecipes(true);
        setRecipesError("");

        const data = await fetchRecipes();

        if (isMounted) {
          setRecipes(data);
        }
      } catch (err) {
        console.error("Failed to load dashboard recipes:", err);

        if (isMounted) {
          setRecipesError(err.message || "Failed to load recipes");
        }
      } finally {
        if (isMounted) {
          setIsLoadingRecipes(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const recentRecipes = useMemo(() => {
    return [...recipes]
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      )
      .slice(0, 3);
  }, [recipes]);

  const continueCookingRecipe = recentRecipes[0] || null;

  return (
    <section className="space-y-6">
      <DashboardWelcome />
      <DashboardQuickActions />

      <DashboardRecipePreview
        recipes={recentRecipes}
        isLoading={isLoadingRecipes}
        error={recipesError}
      />

      <DashboardContinueCooking
        recipe={continueCookingRecipe}
        isLoading={isLoadingRecipes}
      />

      <DashboardFolders />
      <DashboardReminders />
    </section>
  );
}