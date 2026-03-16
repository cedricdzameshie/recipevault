import { useEffect, useMemo, useState } from "react";
import DashboardWelcome from "../components/dashboard/DashboardWelcome";
import DashboardQuickActions from "../components/dashboard/DashboardQuickActions";
import DashboardRecipePreview from "../components/dashboard/DashboardRecipePreview";
import DashboardContinueCooking from "../components/dashboard/DashboardContinueCooking";
import DashboardFolders from "../components/dashboard/DashboardFolders";
import DashboardReminders from "../components/dashboard/DashboardReminders";
import { fetchRecipes } from "../api/recipes";
import { fetchReminders } from "../api/reminders";

export default function DashboardPage() {
  const [recipes, setRecipes] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
  const [isLoadingReminders, setIsLoadingReminders] = useState(true);
  const [recipesError, setRecipesError] = useState("");
  const [remindersError, setRemindersError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadRecipes() {
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

    async function loadReminders() {
      try {
        setIsLoadingReminders(true);
        setRemindersError("");

        const data = await fetchReminders();

        if (isMounted) {
          setReminders(data);
        }
      } catch (err) {
        console.error("Failed to load dashboard reminders:", err);

        if (isMounted) {
          setRemindersError(err.message || "Failed to load reminders");
        }
      } finally {
        if (isMounted) {
          setIsLoadingReminders(false);
        }
      }
    }

    loadRecipes();
    loadReminders();

    return () => {
      isMounted = false;
    };
  }, []);

  const recentRecipes = useMemo(() => {
    return [...recipes]
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) -
          new Date(a.updatedAt || a.createdAt)
      )
      .slice(0, 3);
  }, [recipes]);

  const continueCookingRecipe = recentRecipes[0] || null;
  const activeReminders = reminders.filter((reminder) => !reminder.complete);

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

      <DashboardReminders
        reminders={activeReminders}
        isLoading={isLoadingReminders}
        error={remindersError}
      />
    </section>
  );
}