import Button from "../common/Button";

export default function CookingControls({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}) {
  return (
    <div className="sticky bottom-3 z-20 -mx-1 rounded-2xl border border-stone-200/80 bg-white/95 p-2 shadow-lg shadow-stone-900/10 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-0">
      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
        <Button
          variant="secondary"
          onClick={onPrevious}
          type="button"
          disabled={!canGoPrevious}
          className="min-h-12 w-full sm:w-auto sm:min-w-32"
        >
          Previous
        </Button>

        <Button
          onClick={onNext}
          type="button"
          className="min-h-12 w-full sm:ml-auto sm:w-auto sm:min-w-40"
        >
          {canGoNext ? "Next Step" : "Finish Cooking"}
        </Button>
      </div>
    </div>
  );
}