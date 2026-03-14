import { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Textarea from "../components/common/Textarea";

function createId() {
  return crypto.randomUUID();
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState([
    {
      id: createId(),
      title: "Check baking staples",
      detail: "Flour, sugar, butter, and eggs",
      isComplete: false,
    },
    {
      id: createId(),
      title: "Submit bakery receipts",
      detail: "Don’t forget this week’s business purchases",
      isComplete: false,
    },
  ]);

  const [newReminder, setNewReminder] = useState({
    title: "",
    detail: "",
  });

  const [editingReminderId, setEditingReminderId] = useState(null);
  const [editingReminder, setEditingReminder] = useState({
    title: "",
    detail: "",
  });

  function handleNewReminderChange(e) {
    const { name, value } = e.target;
    setNewReminder((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleAddReminder(e) {
    e.preventDefault();

    const title = newReminder.title.trim();
    const detail = newReminder.detail.trim();

    if (!title) return;

    setReminders((prev) => [
      ...prev,
      {
        id: createId(),
        title,
        detail,
        isComplete: false,
      },
    ]);

    setNewReminder({
      title: "",
      detail: "",
    });
  }

  function handleStartEdit(reminder) {
    setEditingReminderId(reminder.id);
    setEditingReminder({
      title: reminder.title,
      detail: reminder.detail,
    });
  }

  function handleEditingChange(e) {
    const { name, value } = e.target;
    setEditingReminder((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSaveEdit(reminderId) {
    const title = editingReminder.title.trim();
    const detail = editingReminder.detail.trim();

    if (!title) return;

    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === reminderId
          ? {
              ...reminder,
              title,
              detail,
            }
          : reminder
      )
    );

    setEditingReminderId(null);
    setEditingReminder({
      title: "",
      detail: "",
    });
  }

  function handleCancelEdit() {
    setEditingReminderId(null);
    setEditingReminder({
      title: "",
      detail: "",
    });
  }

  function handleDeleteReminder(reminderId) {
    setReminders((prev) => prev.filter((reminder) => reminder.id !== reminderId));
  }

  function handleToggleComplete(reminderId) {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === reminderId
          ? { ...reminder, isComplete: !reminder.isComplete }
          : reminder
      )
    );
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
            <Button type="submit">Add Reminder</Button>
          </div>
        </form>
      </Card>

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
                            reminder.isComplete
                              ? "text-stone-500 line-through"
                              : "text-stone-900"
                          }`}
                        >
                          {reminder.title}
                        </h2>

                        {reminder.detail ? (
                          <p
                            className={`mt-1 text-sm ${
                              reminder.isComplete
                                ? "text-stone-400"
                                : "text-stone-600"
                            }`}
                          >
                            {reminder.detail}
                          </p>
                        ) : null}
                      </div>

                      {reminder.isComplete ? (
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
                        onClick={() => handleToggleComplete(reminder.id)}
                      >
                        {reminder.isComplete ? "Mark Incomplete" : "Mark Complete"}
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
    </section>
  );
}