const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function createFeedback(feedbackData) {
  const response = await fetch(`${API_BASE_URL}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(feedbackData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to submit feedback");
  }

  return data;
}
