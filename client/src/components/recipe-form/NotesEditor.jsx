import { useState } from "react";
import Card from "../common/Card";
import Textarea from "../common/Textarea";
import Button from "../common/Button";

function createNotesPreview(notes) {
  const trimmedNotes = notes?.trim();

  if (!trimmedNotes) {
    return "No notes added.";
  }

  if (trimmedNotes.length <= 120) {
    return trimmedNotes;
  }

  return `${trimmedNotes.slice(0, 117)}...`;
}

export default function NotesEditor({ value, onChange }) {
  const hasNotes = Boolean(value?.trim());
  const [isExpanded, setIsExpanded] = useState(hasNotes);

  function handleRemoveNotes() {
    onChange({
      target: {
        name: "notes",
        value: "",
      },
    });

    setIsExpanded(false);
  }

  return (
    <Card className="overflow-hidden">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/60">
              Step 4
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-stone-950">
              Notes
            </h2>

            <p className="mt-1 text-sm leading-6 text-stone-500">
              Add substitutions, baking tips, reminders, or anything helpful for
              next time.
            </p>
          </div>

          {!isExpanded ? (
            <div className="w-full sm:w-auto">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsExpanded(true)}
                aria-expanded={isExpanded}
              >
                {hasNotes ? "Edit Notes" : "+ Add Notes"}
              </Button>
            </div>
          ) : null}
        </div>

        {!isExpanded ? (
          <div className="rounded-2xl border border-stone-200/80 bg-stone-50/80 p-4">
            <p className="text-sm leading-6 text-stone-600">
              {createNotesPreview(value)}
            </p>
          </div>
        ) : null}

        {isExpanded ? (
          <div className="space-y-4 border-t border-stone-200 pt-4">
            <Textarea
              label="Recipe Notes"
              name="notes"
              value={value}
              onChange={onChange}
              placeholder="Add extra baking notes, tips, substitutions, or reminders..."
              rows={5}
            />

            <div className="flex flex-col gap-3 border-t border-stone-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleRemoveNotes}
                className="text-sm font-medium text-stone-500 transition hover:text-red-600"
              >
                Remove Notes
              </button>

              <Button type="button" onClick={() => setIsExpanded(false)}>
                Done
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}