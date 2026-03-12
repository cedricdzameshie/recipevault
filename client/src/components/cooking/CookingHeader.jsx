export default function CookingHeader({
  title,
  currentStepNumber,
  totalSteps,
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium uppercase tracking-wide text-stone-500">
        Cooking Mode
      </p>

      <h1 className="text-3xl font-semibold text-stone-900">{title}</h1>

      <p className="text-sm text-stone-600">
        Step {currentStepNumber} of {totalSteps}
      </p>
    </div>
  );
}