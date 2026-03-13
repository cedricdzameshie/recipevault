import { useState } from "react";
import DashboardWelcome from "../components/dashboard/DashboardWelcome";
import DashboardQuickActions from "../components/dashboard/DashboardQuickActions";
import DashboardSection from "../components/dashboard/DashboardSection";
import DashboardRecipePreview from "../components/dashboard/DashboardRecipePreview";
import DashboardFolders from "../components/dashboard/DashboardFolders";
import DashboardContinueCooking from "../components/dashboard/DashboardContinueCooking";
import DashboardReminders from "../components/dashboard/DashboardReminders";

export default function DashboardPage() {
  const [showContinueCooking, setShowContinueCooking] = useState(true);

  const continueCooking = {
    id: 1,
    title: "Sourdough Bread",
    stepNumber: 2,
  };

  const recentRecipes = [
    {
      id: 1,
      title: "Sourdough Bread",
      description: "Classic fermented sourdough loaf",
      servings: 4,
      lastUsed: "Today",
    },
    {
      id: 2,
      title: "Focaccia",
      description: "Olive oil bread with herbs",
      servings: 6,
      lastUsed: "Yesterday",
    },
  ];

  const favoriteRecipes = [
    {
      id: 3,
      title: "Cinnamon Rolls",
      description: "Sweet bakery rolls",
      servings: 8,
      isFavorite: true,
      lastUsed: "2 days ago",
    },
    {
      id: 2,
      title: "Focaccia",
      description: "Olive oil bread with herbs",
      servings: 6,
      isFavorite: true,
      lastUsed: "Yesterday",
    },
  ];

  const folders = [
    { id: 1, name: "Breads" },
    { id: 2, name: "Cookies" },
    { id: 3, name: "Cakes" },
    { id: 4, name: "Bakery Test" },
    { id: 5, name: "Family Recipes" },
  ];

  const reminders = [
    {
      id: 1,
      title: "Check baking staples",
      detail: "Flour, sugar, butter, and eggs",
    },
    {
      id: 2,
      title: "Submit bakery receipts",
      detail: "Don’t forget this week’s business purchases",
    },
  ];

  return (
    <section className="space-y-8">
      <DashboardWelcome />

      <DashboardQuickActions />

      {showContinueCooking ? (
        <DashboardContinueCooking
          recipe={continueCooking}
          onDismiss={() => setShowContinueCooking(false)}
        />
      ) : null}

      <DashboardSection
        title="Recent Recipes"
        actionText="View all"
        actionTo="/recipes"
      >
        <DashboardRecipePreview recipes={recentRecipes} />
      </DashboardSection>

      <DashboardSection
        title="Favorites"
        actionText="View all"
        actionTo="/favorites"
      >
        <DashboardRecipePreview recipes={favoriteRecipes} />
      </DashboardSection>

      <DashboardSection
  title="Folders"
  actionText="Manage"
  actionTo="/folders"
>
  <DashboardFolders folders={folders} />
</DashboardSection>

      <DashboardReminders reminders={reminders} />
    </section>
  );
}