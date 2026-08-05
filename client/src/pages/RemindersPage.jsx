import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Textarea from "../components/common/Textarea";
import {
  fetchReminders,
  createReminder,
  updateReminder,
  deleteReminderById,
} from "../api/reminders";

function getReminderDetailLines(detail) {
  return detail
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
}

function ReminderDetail({ detail, isComplete }) {
  const trimmedDetail = detail?.trim();

  if (!trimmedDetail) {
    return <p className="mt-2 text-sm text-stone-400">No details added.</p>;
  }

  const detailLines = getReminderDetailLines(trimmedDetail);
  const shouldShowList = detailLines.length > 1;

  if (shouldShowList) {
    return (
      <ul
        className={`mt-3 space-y-2 rounded-2xl border border-stone-200 bg-rv-cream/45 p-3 ${
          isComplete ? "text-stone-400" : "text-stone-700"
        }`}
      >
        {detailLines.map((line, index) => (
          <li key={`${line}-${index}`} className="flex gap-2 text-sm leading-6">
            <span aria-hidden="true" className="mt-0.5 text-rv-plum">
              •
            </span>

            <span className={isComplete ? "line-through" : ""}>{line}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p
      className={`mt-2 whitespace-pre-line text-sm leading-6 ${
        isComplete ? "text-stone-400" : "text-stone-600"
      }`}
    >
      {trimmedDetail}
    </p>
  );
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [updatingReminderId, setUpdatingReminderId] = useState(null);
  const [deletingReminderId, setDeletingReminderId] = useState(null);
  const [error, setError] = useState("");

  const [newReminder, setNewReminder] = useState({
    title: "",
    detail: "",
  });

  const [editingReminderId, setEditingReminderId] = useState(null);
  const [editingReminder, setEditingReminder] = useState({
    title: "",
    detail: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadReminders() {
      try {
        setIsLoading(true);
        setError("");

        const data = await fetchReminders();

        if (isMounted) {
          setReminders(data);
        }
      } catch (err) {
        console.error("Failed to load reminders:", err);

        if (isMounted) {
          setError(err.message || "Failed to load reminders");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadReminders();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedReminders = useMemo(() => {
    return [...reminders].sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime() || 0;
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime() || 0;

      return dateB - dateA;
    });
  }, [reminders]);

  const activeReminders = sortedReminders.filter(
    (reminder) => !reminder.complete
  );

  const completedReminders = sortedReminders.filter(
    (reminder) => reminder.complete
  );

  function handleNewReminderChange(e) {
    const { name, value } = e.target;

    setNewReminder((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleAddReminder(e) {
    e.preventDefault();

    const title = newReminder.title.trim();
    const detail = newReminder.detail.trim();

    if (!title) return;

    try {
      setIsCreating(true);
      setError("");

      const createdReminder = await createReminder({
        title,
        detail,
      });

      setReminders((prev) => [createdReminder, ...prev]);

      setNewReminder({
        title: "",
        detail: "",
      });
    } catch (err) {
      console.error("Failed to create reminder:", err);
      setError(err.message || "Failed to create reminder");
    } finally {
      setIsCreating(false);
    }
  }

  function handleStartEdit(reminder) {
    setEditingReminderId(reminder.id);
    setEditingReminder({
      title: reminder.title || "",
      detail: reminder.detail || "",
    });
  }

  function handleEditingChange(e) {
    const { name, value } = e.target;

    setEditingReminder((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSaveEdit(reminderId) {
    const title = editingReminder.title.trim();
    const detail = editingReminder.detail.trim();

    if (!title) return;

    try {
      setUpdatingReminderId(reminderId);
      setError("");

      const updated = await updateReminder(reminderId, {
        title,
        detail,
      });

      setReminders((prev) =>
        prev.map((reminder) =>
          reminder.id === reminderId ? updated : reminder
        )
      );

      setEditingReminderId(null);
      setEditingReminder({
        title: "",
        detail: "",
      });
    } catch (err) {
      console.error("Failed to update reminder:", err);
      setError(err.message || "Failed to update reminder");
    } finally {
      setUpdatingReminderId(null);
    }
  }

  function handleCancelEdit() {
    setEditingReminderId(null);
    setEditingReminder({
      title: "",
      detail: "",
    });
  }

  async function handleDeleteReminder(reminder) {
    const confirmed = window.confirm(
      `Delete "${reminder.title}" from reminders?`
    );

    if (!confirmed) return;

    try {
      setDeletingReminderId(reminder.id);
      setError("");

      await deleteReminderById(reminder.id);

      setReminders((prev) =>
        prev.filter((currentReminder) => currentReminder.id !== reminder.id)
      );

      if (editingReminderId === reminder.id) {
        handleCancelEdit();
      }
    } catch (err) {
      console.error("Failed to delete reminder:", err);
      setError(err.message || "Failed to delete reminder");
    } finally {
      setDeletingReminderId(null);
    }
  }

  async function handleToggleComplete(reminder) {
    try {
      setUpdatingReminderId(reminder.id);
      setError("");

      const updated = await updateReminder(reminder.id, {
        complete: !reminder.complete,
      });

      setReminders((prev) =>
        prev.map((item) => (item.id === reminder.id ? updated : item))
      );
    } catch (err) {
      console.error("Failed to toggle reminder:", err);
      setError(err.message || "Failed to update reminder");
    } finally {
      setUpdatingReminderId(null);
    }
  }

  function renderReminderCard(reminder) {
    const isEditing = editingReminderId === reminder.id;
    const isUpdating = updatingReminderId === reminder.id;
    const isDeleting = deletingReminderId === reminder.id;

    return (
      <Card key={reminder.id} className="border-stone-300/70 bg-white/95">
        <div className="space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <Input
                label="Reminder Title"
                name="title"
                value={editingReminder.title}
                onChange={handleEditingChange}
                placeholder="Reminder title"
              />

              <div className="space-y-2">
                <Textarea
                  label="Details or List"
                  name="detail"
                  value={editingReminder.detail}
                  onChange={handleEditingChange}
                  placeholder={`Optional details or list items...\nFlour\nSugar\nButter`}
                  rows={4}
                />

                <p className="text-xs leading-5 text-stone-500">
                  Tip: each new line will display as a separate list item.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  onClick={() => handleSaveEdit(reminder.id)}
                  disabled={isUpdating || !editingReminder.title.trim()}
                >
                  {isUpdating ? "Saving..." : "Save"}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        reminder.complete
                          ? "border-stone-200 bg-stone-50 text-stone-500"
                          : "border-rv-teal/30 bg-rv-teal/15 text-rv-plum"
                      }`}
                    >
                      {reminder.complete ? "Complete" : "Open"}
                    </span>
                  </div>

                  <h2
                    className={`mt-3 wrap-break-word text-xl font-bold tracking-tight ${
                      reminder.complete
                        ? "text-stone-500 line-through"
                        : "text-rv-plum"
                    }`}
                  >
                    {reminder.title}
                  </h2>

                  <ReminderDetail
                    detail={reminder.detail}
                    isComplete={reminder.complete}
                  />
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                <Button
                  type="button"
                  variant={reminder.complete ? "secondary" : "primary"}
                  onClick={() => handleToggleComplete(reminder)}
                  disabled={isUpdating || isDeleting}
                >
                  {isUpdating
                    ? "Saving..."
                    : reminder.complete
                    ? "Reopen"
                    : "Mark Complete"}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleStartEdit(reminder)}
                  disabled={isUpdating || isDeleting}
                >
                  Edit
                </Button>

                <button
                  type="button"
                  onClick={() => handleDeleteReminder(reminder)}
                  disabled={isDeleting || isUpdating}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </>
          )}
        </div>
      </Card>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-5 pb-8 sm:space-y-6">
      <PageHeader
        title="Reminders"
        description="Track baking tasks, supplies, and recipe to-dos."
        backTo="/dashboard"
        backLabel="Back to Dashboard"
      />

      <Card className="border-stone-300/70 bg-white/95">
        <form onSubmit={handleAddReminder} className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/60">
              Create Reminder
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-stone-950">
              Add something to remember
            </h2>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              Use reminders for groceries, prep tasks, recipe ideas, or bakery
              to-dos.
            </p>
          </div>

          <Input
            label="Reminder Title"
            name="title"
            value={newReminder.title}
            onChange={handleNewReminderChange}
            placeholder="Ex: Groceries"
          />

          <div className="space-y-2">
            <Textarea
              label="Details or List"
              name="detail"
              value={newReminder.detail}
              onChange={handleNewReminderChange}
              placeholder={`Optional details or list items...\nFlour\nSugar\nButter`}
              rows={4}
            />

            <p className="text-xs leading-5 text-stone-500">
              Tip: put each item on its own line to display it as a clean list.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isCreating || !newReminder.title.trim()}
            className="w-full sm:w-auto"
          >
            {isCreating ? "Creating..." : "Create Reminder"}
          </Button>
        </form>
      </Card>

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm"
        >
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <Card className="border-stone-300/70 bg-white/95">
          <p className="text-sm text-stone-600">Loading reminders...</p>
        </Card>
      ) : reminders.length === 0 ? (
        <Card className="border-stone-300/70 bg-white/95">
          <div className="space-y-3 text-center">
            <h2 className="text-xl font-bold tracking-tight text-stone-950">
              No reminders yet
            </h2>

            <p className="text-sm leading-6 text-stone-500">
              Create reminders for groceries, baking prep, recipe ideas, or
              anything you do not want to forget.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/60">
                Reminder List
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-rv-plum">
                Open reminders
              </h2>
            </div>

            <div className="rounded-full border border-stone-200 bg-white/90 px-3 py-1 text-sm font-semibold text-stone-600">
              {activeReminders.length} open
            </div>
          </div>

          {activeReminders.length > 0 ? (
            <div className="space-y-3">
              {activeReminders.map((reminder) => renderReminderCard(reminder))}
            </div>
          ) : (
            <Card className="border-stone-300/70 bg-white/95">
              <div className="space-y-2 text-center">
                <h2 className="text-xl font-bold tracking-tight text-stone-950">
                  All caught up
                </h2>

                <p className="text-sm leading-6 text-stone-500">
                  You do not have any open reminders right now.
                </p>
              </div>
            </Card>
          )}

          {completedReminders.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold tracking-tight text-stone-800">
                  Completed
                </h2>

                <div className="rounded-full border border-stone-200 bg-white/90 px-3 py-1 text-sm font-semibold text-stone-600">
                  {completedReminders.length}
                </div>
              </div>

              <div className="space-y-3">
                {completedReminders.map((reminder) =>
                  renderReminderCard(reminder)
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}