const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export async function fetchReminders() {
  const response = await fetch(`${API_BASE_URL}/reminders`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch reminders");
  }

  return data;
}

export async function createReminder(reminderData) {
  const response = await fetch(`${API_BASE_URL}/reminders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reminderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create reminder");
  }

  return data;
}

export async function updateReminder(id, reminderData) {
  const response = await fetch(`${API_BASE_URL}/reminders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reminderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update reminder");
  }

  return data;
}

export async function deleteReminderById(id) {
  const response = await fetch(`${API_BASE_URL}/reminders/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to delete reminder");
  }

  return data;
}
