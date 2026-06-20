export default function CookingHeader({
  title,
  currentStepNumber,
  totalSteps,
}) {
  return (
    <div className="min-w-0 space-y-3">
      <span className="inline-flex rounded-full bg-rv-plum/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-rv-plum">
        Cooking Mode
      </span>

      <div className="space-y-1">
        <h1 className="wrap-break-word text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl">
          {title}
        </h1>

        <p className="text-sm font-medium text-stone-600">
          Step {currentStepNumber} of {totalSteps}
        </p>
      </div>
    </div>
  );
}