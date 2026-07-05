import { useEffect, useMemo, useState } from "react";
import DashboardWelcome from "../components/dashboard/DashboardWelcome";
import { fetchRecipes } from "../api/recipes";
import { fetchReminders } from "../api/reminders";

function getSavedCookingSession() {
  const storedSession = localStorage.getItem("continueCooking");

  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession);
  } catch (error) {
    console.error(
      "Failed to parse continue cooking session:",
      error,
    );

    localStorage.removeItem("continueCooking");
    return null;
  }
}

export default function DashboardPage() {
  const [recipes, setRecipes] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [continueCookingSession, setContinueCookingSession] =
    useState(getSavedCookingSession);

  useEffect(() => {
    let isMounted = true;

    async function loadRecipes() {
      try {
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

  const continueCookingStep =
    continueCookingSession?.currentStep ??
    continueCookingSession?.step ??
    1;

  function handleDismissContinueCooking() {
    localStorage.removeItem("continueCooking");
    setContinueCookingSession(null);
  }

  return (
    <section className="space-y-6">
      <DashboardWelcome
        reminderCount={activeReminders.length}
        continueCookingRecipe={continueCookingRecipe}
        continueCookingStep={continueCookingStep}
        onDismissContinueCooking={
          handleDismissContinueCooking
        }
      />
    </section>
  );
}