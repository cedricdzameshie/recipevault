import Card from "../common/Card";
import DashboardQuickActions from "./DashboardQuickActions";

export default function DashboardWelcome() {
  const dailyQuote = {
    text: "Good things rise with time.",
    category: "Kitchen Note",
  };

  return (
    <Card className="border-stone-300/70 bg-white/95 p-6 md:p-8">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-rv-plum md:text-5xl">
          Welcome!
        </h1>

        <DashboardQuickActions />

        <div className="border-t border-stone-200 pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/65">
            {dailyQuote.category}
          </p>

          <p className="mt-2 text-base font-semibold leading-7 text-rv-plum md:text-lg">
            “{dailyQuote.text}”
          </p>
        </div>
      </div>
    </Card>
  );
}