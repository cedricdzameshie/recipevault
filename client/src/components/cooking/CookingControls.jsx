import Button from "../common/Button";

export default function CookingControls({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Button
        variant="secondary"
        onClick={onPrevious}
        type="button"
        disabled={!canGoPrevious}
      >
        Previous
      </Button>

      <Button onClick={onNext} type="button">
        {canGoNext ? "Next Step" : "Finish"}
      </Button>
    </div>
  );
}