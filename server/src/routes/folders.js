import express from "express";
import { getFolders, createFolder } from "../controllers/foldersController.js";

const router = express.Router();

router.get("/", getFolders);
router.post("/", createFolder);

export default router;
