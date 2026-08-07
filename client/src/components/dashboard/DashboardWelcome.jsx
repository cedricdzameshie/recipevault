import Card from "../common/Card";
import DashboardQuickActions from "./DashboardQuickActions";
import QuickActionCard from "./QuickActionCard";

export default function DashboardWelcome({
  reminderCount = 0,
  continueCookingRecipe = null,
  continueCookingStep = 1,
  onDismissContinueCooking,
}) {
  const dailyQuote = {
    text: "Good things rise with time.",
  };

  return (
    <Card className="border-stone-300/70 bg-white/95 p-5 sm:p-6 md:p-8">
      <div className="space-y-5">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-rv-plum md:text-5xl">
            Welcome!
          </h1>

          <p className="mt-3 text-base font-semibold leading-7 text-rv-plum sm:text-lg">
            “{dailyQuote.text}”
          </p>
        </div>

        {continueCookingRecipe ? (
          <div className="relative">
            <QuickActionCard
              title="Continue Cooking"
              description={`${continueCookingRecipe.title} · Step ${continueCookingStep}`}
              to={`/recipes/${continueCookingRecipe.id}/cook?step=${continueCookingStep}`}
              icon="▶"
              variant="primary"
              size="standard"
              className={onDismissContinueCooking ? "pr-14" : ""}
            />

            {onDismissContinueCooking ? (
              <button
                type="button"
                onClick={onDismissContinueCooking}
                aria-label={`Remove ${continueCookingRecipe.title} from Continue Cooking`}
                title="Remove cooking session"
                className={[
                  "absolute right-3 top-1/2 z-10",
                  "flex h-8 w-8 -translate-y-1/2 items-center justify-center",
                  "rounded-lg border border-rv-plum/20 bg-white/70",
                  "text-lg leading-none text-rv-plum",
                  "transition hover:bg-white",
                  "focus:outline-none focus-visible:ring-2",
                  "focus-visible:ring-rv-plum focus-visible:ring-offset-2",
                ].join(" ")}
              >
                ×
              </button>
            ) : null}
          </div>
        ) : null}

        <DashboardQuickActions reminderCount={reminderCount} />
      </div>
    </Card>
  );
}