import express from "express";
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleFavorite,
} from "../controllers/recipesController.js";

const router = express.Router();

router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.post("/", createRecipe);
router.patch("/:id", updateRecipe);
router.patch("/:id/favorite", toggleFavorite);
router.delete("/:id", deleteRecipe);

export default router;
