import Card from "../common/Card";

export default function DashboardReminders({ reminders = [] }) {
  if (!reminders.length) {
    return (
      <Card>
        <p className="text-sm text-stone-600">No reminders right now.</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-green-700">
            Reminders
          </p>
          <h2 className="mt-1 text-xl font-semibold text-stone-900">
            Stay on top of things
          </h2>
        </div>

        <ul className="space-y-3">
          {reminders.map((reminder) => (
            <li
              key={reminder.id}
              className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3"
            >
              <p className="text-sm font-medium text-stone-900">
                {reminder.title}
              </p>
              <p className="mt-1 text-xs text-stone-600">
                {reminder.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}