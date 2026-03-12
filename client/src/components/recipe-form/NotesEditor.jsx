import Card from "../common/Card";
import Textarea from "../common/Textarea";

export default function NotesEditor({ value, onChange }) {
  return (
    <Card>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Notes</h2>

        <Textarea
          label="Recipe Notes"
          name="notes"
          value={value}
          onChange={onChange}
          placeholder="Add extra baking notes, tips, substitutions, or reminders..."
          rows={5}
        />
      </div>
    </Card>
  );
}