import prisma from "../prisma/prismaClient.js";

export async function getReminders(req, res) {
  try {
    const reminders = await prisma.reminder.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(reminders);
  } catch (error) {
    console.error("Error fetching reminders:", error);
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
}

export async function createReminder(req, res) {
  try {
    const { title, detail, recipeId } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Reminder title is required" });
    }

    const reminder = await prisma.reminder.create({
      data: {
        title: title.trim(),
        detail: detail?.trim() || null,
        recipeId: recipeId || null,
      },
    });

    res.status(201).json(reminder);
  } catch (error) {
    console.error("Error creating reminder:", error);
    res.status(500).json({ error: "Failed to create reminder" });
  }
}

export async function updateReminder(req, res) {
  try {
    const { id } = req.params;
    const { title, detail, complete } = req.body;

    const existingReminder = await prisma.reminder.findUnique({
      where: { id },
    });

    if (!existingReminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    const updatedReminder = await prisma.reminder.update({
      where: { id },
      data: {
        title:
          title !== undefined
            ? title?.trim() || existingReminder.title
            : undefined,
        detail: detail !== undefined ? detail?.trim() || null : undefined,
        complete: complete !== undefined ? complete : undefined,
      },
    });

    res.json(updatedReminder);
  } catch (error) {
    console.error("Error updating reminder:", error);
    res.status(500).json({ error: "Failed to update reminder" });
  }
}

export async function deleteReminder(req, res) {
  try {
    const { id } = req.params;

    const existingReminder = await prisma.reminder.findUnique({
      where: { id },
    });

    if (!existingReminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    await prisma.reminder.delete({
      where: { id },
    });

    res.json({ message: "Reminder deleted successfully" });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    res.status(500).json({ error: "Failed to delete reminder" });
  }
}
