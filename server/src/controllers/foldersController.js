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
    });

    res.status(201).json(folder);
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ error: "Failed to create folder" });
  }
}
