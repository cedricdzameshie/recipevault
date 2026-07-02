import Card from "../common/Card";
import DashboardQuickActions from "./DashboardQuickActions";

export default function DashboardWelcome({
  reminderCount = 0,
}) {
  const dailyQuote = {
    text: "Good things rise with time.",
    category: "Kitchen Note",
  };

  return (
    <Card className="border-stone-300/70 bg-white/95 p-5 sm:p-6 md:p-8">
      <div className="space-y-5">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-rv-plum md:text-5xl">
            Welcome!
          </h1>

          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/65">
              {dailyQuote.category}
            </p>

            <p className="mt-1 text-sm font-semibold leading-6 text-rv-plum sm:text-base">
              “{dailyQuote.text}”
            </p>
          </div>
        </div>

        <DashboardQuickActions
          reminderCount={reminderCount}
        />
      </div>
    </Card>
  );
}