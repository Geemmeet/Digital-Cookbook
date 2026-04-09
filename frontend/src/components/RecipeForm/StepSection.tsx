import { inputs, buttons, layout, errorMessage } from "../../styles/theme";
import { inputClass } from "../../utils/formHelpers";
import { Required } from "./Required";

interface Step {
  id: number;
  description: string;
}

interface Props {
  currentStep: string;
  steps: Step[];
  errors: { [key: string]: string };
  setSteps: (steps: Step[]) => void;
  setCurrentStep: (step: string) => void;
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

export const StepSection = ({
  currentStep,
  steps,
  errors,
  setSteps,
  setCurrentStep,
  setErrors,
}: Props) => {
  const addStep = () => {
    if (!currentStep.trim()) return;
    setSteps([
      ...steps,
      { id: steps.length + 1, description: currentStep.trim() },
    ]);
    setCurrentStep("");
    if (errors.steps) setErrors((p) => ({ ...p, steps: "" }));
  };

  const removeStep = (id: number) => {
    const updatedSteps = steps
      .filter((st) => st.id !== id)
      .map((st, index) => ({ ...st, id: index + 1 }));
    setSteps(updatedSteps);
  };

  return (
    <section className="relative">
      <label className={inputs.label}>
        Instruktioner
        <Required />
      </label>
      <div className="flex flex-col gap-2 mb-3">
        {steps.map((s) => (
          <div key={s.id} className={layout.ingredientRow}>
            <p className="text-sm flex gap-2">
              <span className="font-bold text-accent">{s.id}.</span>
              <span>{s.description}</span>
            </p>
            <button
              type="button"
              onClick={() => removeStep(s.id)}
              className={buttons.icon}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <textarea
          value={currentStep}
          onChange={(e) => setCurrentStep(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && (e.preventDefault(), addStep())
          }
          className={`${inputClass("steps", errors)} flex-1 resize-none`}
          rows={2}
          placeholder="Lägg till steg..."
        />
        <button
          type="button"
          onClick={addStep}
          className={`${buttons.plus} self-end`}
        >
          +
        </button>
      </div>
      {errors.steps && <p className={errorMessage.warning}>{errors.steps}</p>}
    </section>
  );
};
