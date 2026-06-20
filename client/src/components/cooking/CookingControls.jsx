import Button from "../common/Button";

export default function CookingControls({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="secondary"
        onClick={onPrevious}
        type="button"
        disabled={!canGoPrevious}
        className="min-h-11 flex-1 sm:flex-none sm:min-w-32"
      >
        Previous
      </Button>

      <Button
        onClick={onNext}
        type="button"
        className="min-h-11 flex-1 sm:ml-auto sm:flex-none sm:min-w-36"
      >
        {canGoNext ? "Next Step" : "Finish Cooking"}
      </Button>
    </div>
  );
}