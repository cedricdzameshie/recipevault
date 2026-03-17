import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import Card from "../common/Card";

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
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border-stone-300/70 bg-white/95 p-8 md:p-10">
      <div className="space-y-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rv-plum/80">
              RecipeVault
            </p>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight text-rv-plum md:text-5xl">
                Welcome back, Chakas
              </h1>

              <p className="max-w-2xl text-base text-stone-600 md:text-lg">
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

            <Button variant="accent">Import Recipe</Button>
          </div>
        </div>

        <div className="rounded-2xl border border-rv-teal/30 bg-rv-teal/18 px-5 py-4">
          <p className="text-base font-medium text-rv-plum">
            {quotes[quoteIndex]}
          </p>
        </div>
      </div>
    </Card>
  );
}