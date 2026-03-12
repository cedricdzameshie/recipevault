import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import StepIngredientsEditor from "./StepIngredientsEditor";

export default function StepsEditor({
  steps,
  onStepChange,
  onAddStep,
  onRemoveStep,
  onStepIngredientChange,
  onAddStepIngredient,
  onRemoveStepIngredient,
}) {
  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Steps</h2>
          <Button type="button" variant="secondary" onClick={onAddStep}>
            Add Step
          </Button>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="rounded-2xl border border-stone-200 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-stone-700">
                  Step {index + 1}
                </h3>

                <button
                  type="button"
                  onClick={() => onRemoveStep(step.id)}
                  className="text-sm text-stone-600 transition hover:text-stone-900"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-4">
                <Textarea
                  label="Instruction"
                  name="instruction"
                  value={step.instruction}
                  onChange={(e) =>
                    onStepChange(step.id, "instruction", e.target.value)
                  }
                  placeholder="Describe what to do in this step"
                  rows={3}
                />

                <Input
                  label="Prep Note (optional)"
                  name="prepNote"
                  value={step.prepNote}
                  onChange={(e) =>
                    onStepChange(step.id, "prepNote", e.target.value)
                  }
                  placeholder="Ex: Have oven preheated before starting this step"
                />

                <Input
                  label="Timer (minutes, optional)"
                  name="timerMinutes"
                  type="number"
                  value={step.timerMinutes}
                  onChange={(e) =>
                    onStepChange(step.id, "timerMinutes", e.target.value)
                  }
                  placeholder="10"
                />

                <StepIngredientsEditor
                  ingredients={step.ingredients}
                  onIngredientChange={(ingredientId, field, value) =>
                    onStepIngredientChange(step.id, ingredientId, field, value)
                  }
                  onAddIngredient={() => onAddStepIngredient(step.id)}
                  onRemoveIngredient={(ingredientId) =>
                    onRemoveStepIngredient(step.id, ingredientId)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}