import prisma from "../prisma/prismaClient.js";

export async function getFolders(req, res) {
  try {
    const folders = await prisma.folder.findMany({
      include: {
        recipes: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    res.status(500).json({ error: "Failed to fetch folders" });
  }
}

export async function createFolder(req, res) {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Folder name is required" });
    }

    const folder = await prisma.folder.create({
      data: {
        name: name.trim(),
      },
      include: {
        recipes: true,
      },
    });

    res.status(201).json(folder);
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ error: "Failed to create folder" });
  }
}

export async function updateFolder(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Folder name is required" });
    }

    const existingFolder = await prisma.folder.findUnique({
      where: { id },
    });

    if (!existingFolder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const updatedFolder = await prisma.folder.update({
      where: { id },
      data: {
        name: name.trim(),
      },
      include: {
        recipes: true,
      },
    });

    res.json(updatedFolder);
  } catch (error) {
    console.error("Error updating folder:", error);
    res.status(500).json({ error: "Failed to update folder" });
  }
}

export async function deleteFolder(req, res) {
  try {
    const { id } = req.params;

    const existingFolder = await prisma.folder.findUnique({
      where: { id },
    });

    if (!existingFolder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    await prisma.folder.delete({
      where: { id },
    });

    res.json({ message: "Folder deleted successfully" });
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).json({ error: "Failed to delete folder" });
  }
}
