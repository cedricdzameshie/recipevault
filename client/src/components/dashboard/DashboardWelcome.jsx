const quotes = [
  "Small steps make great bakes.",
  "Good things rise with time.",
  "Every recipe gets better with practice.",
  "Bake with patience.",
];

function getQuoteOfTheDay() {
  const dayIndex = new Date().getDate() % quotes.length;
  return quotes[dayIndex];
}

export default function DashboardWelcome() {
  const quote = getQuoteOfTheDay();

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-green-700">
          RecipeVault
        </p>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
            Welcome back, Chakas
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Ready to bake something good today?
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 px-4 py-3">
          <p className="text-sm text-green-900">{quote}</p>
        </div>
      </div>
    </section>
  );
}