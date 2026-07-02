import DashboardSection from "./DashboardSection";
import QuickActionCard from "./QuickActionCard";

export default function DashboardContinueCooking({
  recipe = null,
  currentStep = 1,
  isLoading = false,
  onDismiss,
}) {
  if (!isLoading && !recipe) {
    return null;
  }

  return (
    <DashboardSection title="Continue Cooking">
      {isLoading ? (
        <QuickActionCard
          title="Loading cooking session..."
          description="Checking your saved progress"
          icon="▶"
          variant="softPlum"
          size="standard"
        />
      ) : (
        <div className="relative">
          <QuickActionCard
            title={recipe.title}
            description={`Resume from step ${currentStep}`}
            to={`/recipes/${recipe.id}/cook?step=${currentStep}`}
            icon="▶"
            variant="primary"
            size="standard"
            className={onDismiss ? "pr-16" : ""}
          />

          {onDismiss ? (
            <button
              type="button"
              onClick={onDismiss}
              aria-label={`Remove ${recipe.title} from Continue Cooking`}
              title="Remove cooking session"
              className={[
                "absolute right-3 top-1/2 z-10",
                "flex h-9 w-9 -translate-y-1/2 items-center justify-center",
                "rounded-lg border border-white/30 bg-white/20",
                "text-xl leading-none text-white",
                "transition hover:bg-white/30",
                "focus:outline-none focus-visible:ring-2",
                "focus-visible:ring-white focus-visible:ring-offset-2",
                "focus-visible:ring-offset-rv-plum",
              ].join(" ")}
            >
              ×
            </button>
          ) : null}
        </div>
      )}
    </DashboardSection>
  );
}