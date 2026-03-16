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
    <Card>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-green-700">
              Reminders
            </p>
            <h2 className="mt-1 text-xl font-semibold text-stone-900">
              Stay on top of things
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/reminders">
              <Button variant="secondary">Manage</Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-stone-600">Loading reminders...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : previewReminders.length === 0 ? (
          <p className="text-sm text-stone-600">No reminders right now.</p>
        ) : (
          <ul className="space-y-3">
            {previewReminders.map((reminder) => (
              <li
                key={reminder.id}
                className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        reminder.complete
                          ? "text-stone-500 line-through"
                          : "text-stone-900"
                      }`}
                    >
                      {reminder.title}
                    </p>

                    {reminder.detail ? (
                      <p className="mt-1 text-xs text-stone-600">
                        {reminder.detail}
                      </p>
                    ) : null}
                  </div>

                  {reminder.complete ? (
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-800">
                      Complete
                    </span>
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