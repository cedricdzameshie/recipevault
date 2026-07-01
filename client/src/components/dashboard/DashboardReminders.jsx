import { Link } from "react-router-dom";
import Card from "../common/Card";
import Button from "../common/Button";

export default function DashboardReminders({
  reminders = [],
  isLoading = false,
  error = "",
}) {
  const previewReminders = reminders.slice(0, 3);

  return (
    <Card className="border-stone-300/70 bg-white/95">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/65">
              Today
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-rv-plum">
              What needs your attention
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/reminders">
              <Button variant="primary" size="sm">
                Add Reminder
              </Button>
            </Link>

            <Link to="/reminders">
              <Button variant="secondary" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-stone-600">
            Loading reminders...
          </p>
        ) : error ? (
          <p className="text-sm text-rv-coral">
            {error}
          </p>
        ) : previewReminders.length === 0 ? (
          <p className="text-sm text-stone-600">
            Nothing needs your attention right now.
          </p>
        ) : (
          <ul className="divide-y divide-stone-200">
            {previewReminders.map((reminder) => (
              <li
                key={reminder.id}
                className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-rv-plum">
                    {reminder.title}
                  </p>

                  {reminder.detail ? (
                    <p className="mt-1 text-xs leading-5 text-stone-600">
                      {reminder.detail}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}