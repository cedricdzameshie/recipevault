import QuickActionCard from "./QuickActionCard";

export default function DashboardQuickActions() {
  return (
    <section className="grid gap-2 md:grid-cols-3">
      <QuickActionCard
  title="Add Recipe"
  description="Create manually"
  to="/recipes/new"
  icon="+"
  variant="primary"
/>

<QuickActionCard
  title="Import Recipe"
  description="Paste text or URL"
  to="/recipes/import"
  icon="✦"
  variant="accent"
/>

<QuickActionCard
  title="Browse Recipes"
  description="View your collection"
  to="/recipes"
  icon="⌕"
  variant="secondary"
/>
    </section>
  );
}