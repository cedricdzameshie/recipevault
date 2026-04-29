import express from "express";
import { importRecipeFromText } from "../controllers/importController.js";

const router = express.Router();

router.post("/recipe", importRecipeFromText);

export default router;
