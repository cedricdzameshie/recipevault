import QuickActionCard from "./QuickActionCard";

export default function DashboardQuickActions({
  reminderCount = 0,
}) {
  const reminderBadge =
    reminderCount > 0 ? `${reminderCount} active` : undefined;

  const reminderDescription =
    reminderCount === 0
      ? "Nothing needs attention"
      : reminderCount === 1
        ? "1 active reminder"
        : `${reminderCount} active reminders`;

  return (
    <section
      aria-label="RecipeVault actions"
      className="grid grid-cols-2 gap-3 md:grid-cols-3"
    >
      <QuickActionCard
        title="Add Recipe"
        description="Create manually"
        to="/recipes/new"
        icon="+"
        variant="primary"
        size="compact"
      />

      <QuickActionCard
        title="Import Recipe"
        description="Paste text or URL"
        to="/recipes/import"
        icon="✦"
        variant="accent"
        size="compact"
      />

      <QuickActionCard
        title="Browse Recipes"
        description="View your collection"
        to="/recipes"
        icon="⌕"
        variant="secondary"
        size="compact"
      />

      <QuickActionCard
  title="Favorites"
  description="Saved recipes"
  to="/favorites"
  icon="♡"
  variant="softCoral"
  size="compact"
/>

<QuickActionCard
  title="Folders"
  description="Organize recipes"
  to="/folders"
  icon="▱"
  variant="softTeal"
  size="compact"
/>

<QuickActionCard
  title="Reminders"
  description={reminderDescription}
  to="/reminders"
  icon="◷"
  variant="softPlum"
  size="compact"
  badge={reminderBadge}
/>

<QuickActionCard
  title="What’s in the Fridge?"
  description="Ingredient-based ideas"
  icon="◇"
  variant="softBlue"
  size="compact"
  badge="Soon"
/>

<QuickActionCard
  title="Community"
  description="Recipes and photos"
  icon="◎"
  variant="softWarm"
  size="compact"
  badge="Soon"
/>
    </section>
  );
}