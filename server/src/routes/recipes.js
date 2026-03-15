import express from "express";
import {
  getRecipes,
  getRecipeById,
  createRecipe,
} from "../controllers/recipesController.js";

const router = express.Router();

router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.post("/", createRecipe);

export default router;
