import DashboardWelcome from "../components/dashboard/DashboardWelcome";
import DashboardQuickActions from "../components/dashboard/DashboardQuickActions";
import DashboardSection from "../components/dashboard/DashboardSection";
import DashboardRecipePreview from "../components/dashboard/DashboardRecipePreview";
import DashboardFolders from "../components/dashboard/DashboardFolders";

export default function DashboardPage() {
  const recentRecipes = [
    {
      id: 1,
      title: "Sourdough Bread",
      description: "Classic fermented sourdough loaf",
      servings: 4,
    },
    {
      id: 2,
      title: "Focaccia",
      description: "Olive oil bread with herbs",
      servings: 6,
    },
  ];

  const favoriteRecipes = [
    {
      id: 3,
      title: "Cinnamon Rolls",
      description: "Sweet bakery rolls",
      servings: 8,
    },
    {
      id: 2,
      title: "Focaccia",
      description: "Olive oil bread with herbs",
      servings: 6,
    },
  ];

  const folders = [
    { id: 1, name: "Breads" },
    { id: 2, name: "Cookies" },
    { id: 3, name: "Cakes" },
    { id: 4, name: "Bakery Test" },
  ];

  return (
    <section className="space-y-8">
      <DashboardWelcome />

      <DashboardQuickActions />

      <DashboardSection title="Recent Recipes" actionText="View all">
        <DashboardRecipePreview recipes={recentRecipes} />
      </DashboardSection>

      <DashboardSection title="Favorites" actionText="View all">
        <DashboardRecipePreview recipes={favoriteRecipes} />
      </DashboardSection>

      <DashboardSection title="Folders">
        <DashboardFolders folders={folders} />
      </DashboardSection>
    </section>
  );
}