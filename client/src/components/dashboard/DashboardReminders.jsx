import QuickActionCard from "./QuickActionCard";

export default function DashboardReminders({
  reminders = [],
  isLoading = false,
  error = "",
}) {
  const reminderCount = reminders.length;

  let description = "Nothing needs your attention";
  let badge;

  if (isLoading) {
    description = "Checking your reminders...";
  } else if (error) {
    description = "Open reminders to try again";
    badge = "Error";
  } else if (reminderCount === 1) {
    description = "1 active reminder";
    badge = "1 active";
  } else if (reminderCount > 1) {
    description = `${reminderCount} active reminders`;
    badge = `${reminderCount} active`;
  }

  return (
    <QuickActionCard
      title="Reminders"
      description={description}
      to="/reminders"
      icon="◷"
      variant="softPlum"
      size="standard"
      badge={badge}
    />
  );
}