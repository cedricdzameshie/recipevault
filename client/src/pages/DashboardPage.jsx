import { useEffect, useMemo, useState } from "react";
import DashboardWelcome from "../components/dashboard/DashboardWelcome";
import DashboardContinueCooking from "../components/dashboard/DashboardContinueCooking";
import { fetchRecipes } from "../api/recipes";
import { fetchReminders } from "../api/reminders";

export default function DashboardPage() {
  const [recipes, setRecipes] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
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
        }
      } finally {
        if (isMounted) {
          setIsLoadingRecipes(false);
        }
      }
    }

    async function loadReminders() {
      try {
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
        }
      }
    }

    loadRecipes();
    loadReminders();

    return () => {
      isMounted = false;
    };
  }, []);

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
      <DashboardWelcome
        reminderCount={activeReminders.length}
      />

      {continueCookingRecipe ? (
        <DashboardContinueCooking
          recipe={continueCookingRecipe}
          currentStep={
            continueCookingSession?.currentStep ??
            continueCookingSession?.step ??
            1
          }
          isLoading={isLoadingRecipes}
          onDismiss={handleDismissContinueCooking}
        />
      ) : null}
    </section>
  );
}