import { useEffect, useState } from "react";
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

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
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
    }
  }

  function handleCancelEdit() {
    setEditingReminderId(null);
    setEditingReminder({
      title: "",
      detail: "",
    });
  }

  async function handleDeleteReminder(reminderId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this reminder?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await deleteReminderById(reminderId);

      setReminders((prev) =>
        prev.filter((reminder) => reminder.id !== reminderId)
      );
    } catch (err) {
      console.error("Failed to delete reminder:", err);
      setError(err.message || "Failed to delete reminder");
    }
  }

  async function handleToggleComplete(reminder) {
    try {
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
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Reminders"
        description="Keep track of baking tasks, supplies, and business to-dos."
        backTo="/dashboard"
        backLabel="Back to Dashboard"
      />

      <Card>
        <form onSubmit={handleAddReminder} className="space-y-4">
          <Input
            label="Reminder Title"
            name="title"
            value={newReminder.title}
            onChange={handleNewReminderChange}
            placeholder="Ex: Check flour and sugar"
          />

          <Textarea
            label="Details"
            name="detail"
            value={newReminder.detail}
            onChange={handleNewReminderChange}
            placeholder="Optional details or notes..."
            rows={3}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Adding..." : "Add Reminder"}
            </Button>
          </div>
        </form>
      </Card>

      {error ? (
        <Card>
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      ) : null}

      {isLoading ? (
        <Card>
          <p className="text-sm text-stone-600">Loading reminders...</p>
        </Card>
      ) : reminders.length === 0 ? (
        <Card>
          <p className="text-sm text-stone-600">No reminders yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reminders.map((reminder) => {
            const isEditing = editingReminderId === reminder.id;

            return (
              <Card key={reminder.id}>
                <div className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Input
                        label="Edit Reminder Title"
                        name="title"
                        value={editingReminder.title}
                        onChange={handleEditingChange}
                        placeholder="Reminder title"
                      />

                      <Textarea
                        label="Edit Details"
                        name="detail"
                        value={editingReminder.detail}
                        onChange={handleEditingChange}
                        placeholder="Reminder details"
                        rows={3}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2
                            className={`text-lg font-semibold ${
                              reminder.complete
                                ? "text-stone-500 line-through"
                                : "text-stone-900"
                            }`}
                          >
                            {reminder.title}
                          </h2>

                          {reminder.detail ? (
                            <p
                              className={`mt-1 text-sm ${
                                reminder.complete
                                  ? "text-stone-400"
                                  : "text-stone-600"
                              }`}
                            >
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
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {isEditing ? (
                      <>
                        <Button onClick={() => handleSaveEdit(reminder.id)}>
                          Save
                        </Button>
                        <Button variant="secondary" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="secondary"
                          onClick={() => handleStartEdit(reminder)}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="secondary"
                          onClick={() => handleToggleComplete(reminder)}
                        >
                          {reminder.complete
                            ? "Mark Incomplete"
                            : "Mark Complete"}
                        </Button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}