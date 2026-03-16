import express from "express";
import {
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
} from "../controllers/foldersController.js";

const router = express.Router();

router.get("/", getFolders);
router.post("/", createFolder);
router.patch("/:id", updateFolder);
router.delete("/:id", deleteFolder);

export default router;
