export default function CookingHeader({
  title,
  currentStepNumber,
  totalSteps,
}) {
  return (
    <div className="min-w-0 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex rounded-full bg-rv-plum/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-rv-plum">
          Cooking Mode
        </span>

        <span className="inline-flex rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-600">
          Step {currentStepNumber} of {totalSteps}
        </span>
      </div>

      <h1 className="wrap-break-word text-2xl font-bold leading-tight text-stone-950 sm:text-4xl">
        {title}
      </h1>
    </div>
  );
}