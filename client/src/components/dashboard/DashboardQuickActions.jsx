import { Link } from "react-router-dom";

export default function DashboardQuickActions() {
  return (
    <section className="grid gap-3 sm:grid-cols-3">
      <Link
        to="/recipes/new"
        className="inline-flex items-center justify-center rounded-2xl bg-green-700 px-4 py-4 text-sm font-medium text-white transition hover:bg-green-800"
      >
        Add Recipe
      </Link>

      <button
        type="button"
        className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-4 py-4 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
      >
        Import Recipe
      </button>

      <Link
        to="/recipes"
        className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-4 py-4 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
      >
        Browse Recipes
      </Link>
    </section>
  );
}