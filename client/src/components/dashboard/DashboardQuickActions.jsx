import QuickActionCard from "./QuickActionCard";

export default function DashboardQuickActions({ reminderCount = 0 }) {
  const reminderBadge =
    reminderCount > 0 ? `${reminderCount} active` : undefined;

  const mobileReminderBadge = reminderCount > 0 ? String(reminderCount) : undefined;

  return (
    <section
      aria-label="RecipeVault actions"
      className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3"
    >
      <QuickActionCard
        title="Add Recipe"
        to="/recipes/new"
        icon="+"
        variant="add"
        size="compact"
      />

      <QuickActionCard
        title="Import Recipe"
        to="/recipes/import"
        icon="✦"
        variant="import"
        size="compact"
      />

      <QuickActionCard
        title="Browse Recipes"
        to="/recipes"
        icon="⌕"
        variant="browse"
        size="compact"
      />

      <QuickActionCard
        title="Favorites"
        to="/favorites"
        icon="♡"
        variant="favorite"
        size="compact"
      />

      <QuickActionCard
        title="Folders"
        to="/folders"
        icon="▱"
        variant="folders"
        size="compact"
      />

      <QuickActionCard
        title="Reminders"
        to="/reminders"
        icon="◷"
        variant="reminders"
        size="compact"
        badge={reminderBadge}
        mobileBadge={mobileReminderBadge}
      />

      <QuickActionCard
        title="Fridge Ideas"
        icon="◇"
        variant="fridge"
        size="compact"
        badge="Soon"
        mobileBadge="!"
      />

      <QuickActionCard
        title="Community"
        icon="◎"
        variant="community"
        size="compact"
        badge="Soon"
        mobileBadge="!"
      />

      <QuickActionCard
        title="Feedback"
        icon="✎"
        variant="feedback"
        size="compact"
        badge="Soon"
        mobileBadge="!"
        className="col-span-2 md:col-span-1"
      />
    </section>
  );
}