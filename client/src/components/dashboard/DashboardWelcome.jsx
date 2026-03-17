import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";

const quotes = [
  "Small steps make great bakes.",
  "Good things rise with time.",
  "Every recipe gets better with practice.",
  "Bake with patience.",
];

export default function DashboardWelcome() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-wide text-green-700">
              RecipeVault
            </p>

            <div>
              <h1 className="text-4xl font-bold tracking-tight text-stone-900">
                Welcome back, Chakas
              </h1>

              <p className="mt-2 text-base text-stone-600">
                Ready to bake something good today?
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/recipes/new">
              <Button>Add Recipe</Button>
            </Link>

            <Link to="/recipes">
              <Button variant="secondary">Browse Recipes</Button>
            </Link>

            <Button variant="secondary">Import Recipe</Button>
          </div>
        </div>

        <div className="rounded-2xl bg-green-50 px-4 py-4">
          <p className="text-sm font-medium text-green-900">
            {quotes[quoteIndex]}
          </p>
        </div>
      </div>
    </section>
  );
}