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
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/65">
              Reminders
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-rv-plum">
              Stay on top of things
            </h2>
          </div>

          <Link to="/reminders">
            <Button variant="secondary">Manage</Button>
          </Link>
        </div>

        {isLoading ? (
          <p className="text-sm text-stone-600">Loading reminders...</p>
        ) : error ? (
          <p className="text-sm text-rv-coral">{error}</p>
        ) : previewReminders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-rv-cream/50 px-4 py-4">
            <p className="text-sm text-stone-600">No reminders right now.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {previewReminders.map((reminder) => (
              <li
                key={reminder.id}
                className="rounded-2xl border border-stone-200 bg-rv-cream/45 px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        reminder.complete
                          ? "text-stone-500 line-through"
                          : "text-rv-plum"
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
                    <span className="rounded-full border border-rv-teal/30 bg-rv-teal/20 px-3 py-1 text-xs font-medium text-rv-plum">
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