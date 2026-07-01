import { useEffect, useMemo, useState } from "react";
import DashboardWelcome from "../components/dashboard/DashboardWelcome";
import DashboardRecipePreview from "../components/dashboard/DashboardRecipePreview";
import DashboardContinueCooking from "../components/dashboard/DashboardContinueCooking";
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
  const [continueCookingSession, setContinueCookingSession] =
    useState(null);

  useEffect(() => {
    const storedSession = localStorage.getItem("continueCooking");

    if (!storedSession) {
      return;
    }

    try {
      const parsedSession = JSON.parse(storedSession);
      setContinueCookingSession(parsedSession);
    } catch (error) {
      console.error(
        "Failed to parse continue cooking session:",
        error,
      );

      localStorage.removeItem("continueCooking");
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadRecipes() {
      try {
        setIsLoadingRecipes(true);
        setRecipesError("");

        const data = await fetchRecipes();

        if (isMounted) {
          setRecipes(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error(
          "Failed to load dashboard recipes:",
          error,
        );

        if (isMounted) {
          setRecipes([]);
          setRecipesError(
            error.message || "Failed to load recipes",
          );
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
          setReminders(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error(
          "Failed to load dashboard reminders:",
          error,
        );

        if (isMounted) {
          setReminders([]);
          setRemindersError(
            error.message || "Failed to load reminders",
          );
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
          new Date(b.updatedAt || b.createdAt || 0) -
          new Date(a.updatedAt || a.createdAt || 0),
      )
      .slice(0, 3);
  }, [recipes]);

  const activeReminders = useMemo(() => {
    return reminders.filter(
      (reminder) => !reminder.complete,
    );
  }, [reminders]);

  const continueCookingRecipe = useMemo(() => {
    if (!continueCookingSession || recipes.length === 0) {
      return null;
    }

    return (
      recipes.find(
        (recipe) =>
          recipe.id === continueCookingSession.recipeId,
      ) || null
    );
  }, [continueCookingSession, recipes]);

  function handleDismissContinueCooking() {
    localStorage.removeItem("continueCooking");
    setContinueCookingSession(null);
  }

  return (
    <section className="space-y-6">
      <DashboardWelcome />

      {continueCookingRecipe ? (
        <DashboardContinueCooking
          recipe={continueCookingRecipe}
          currentStep={continueCookingSession?.step || 1}
          isLoading={isLoadingRecipes}
          onDismiss={handleDismissContinueCooking}
        />
      ) : null}

      <DashboardReminders
        reminders={activeReminders}
        isLoading={isLoadingReminders}
        error={remindersError}
      />

      <DashboardRecipePreview
        recipes={recentRecipes}
        isLoading={isLoadingRecipes}
        error={recipesError}
      />
    </section>
  );
}