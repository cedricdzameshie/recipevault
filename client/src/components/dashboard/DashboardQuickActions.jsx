import QuickActionCard from "./QuickActionCard";

export default function DashboardQuickActions() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <QuickActionCard
        title="Add Recipe"
        description="Create a recipe manually."
        to="/recipes/new"
        icon="+"
        variant="primary"
      />

      <QuickActionCard
        title="Import Recipe"
        description="Paste recipe text or a recipe URL."
        to="/recipes/import"
        icon="✦"
        variant="accent"
      />

      <QuickActionCard
        title="Browse Recipes"
        description="View your saved recipe collection."
        to="/recipes"
        icon="⌕"
        variant="secondary"
      />
    </section>
  );
}