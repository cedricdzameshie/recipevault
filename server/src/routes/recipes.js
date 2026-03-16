import express from "express";
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipesController.js";

const router = express.Router();

router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.post("/", createRecipe);
router.patch("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);

export default router;
