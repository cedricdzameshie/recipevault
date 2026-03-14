import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import RecipesPage from "../pages/RecipesPage";
import RecipeDetailPage from "../pages/RecipeDetailPage";
import NewRecipePage from "../pages/NewRecipePage";
import EditRecipePage from "../pages/EditRecipePage";
import CookingModePage from "../pages/CookingModePage";
import FavoritesPage from "../pages/FavoritesPage";
import FoldersPage from "../pages/FoldersPage";
import NotFoundPage from "../pages/NotFoundPage";
import RemindersPage from "../pages/RemindersPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "recipes", element: <RecipesPage /> },
      { path: "recipes/new", element: <NewRecipePage /> },
      { path: "recipes/:id", element: <RecipeDetailPage /> },
      { path: "recipes/:id/edit", element: <EditRecipePage /> },
      { path: "recipes/:id/cook", element: <CookingModePage /> },
      { path: "favorites", element: <FavoritesPage /> },
      { path: "folders", element: <FoldersPage /> },
      { path: "reminders", element: <RemindersPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);