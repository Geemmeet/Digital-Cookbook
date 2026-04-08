import { inputs, buttons, layout, errorMessage } from "../../styles/theme";

export const StepSection = ({ state, setters }: any) => {
  const addStep = () => {
    if (!state.currentStep.trim()) return;
    setters.setSteps([
      ...state.steps,
      { id: state.steps.length + 1, description: state.currentStep.trim() },
    ]);
    setters.setCurrentStep("");
    if (state.errors.steps)
      setters.setErrors((p: any) => ({ ...p, steps: "" }));
  };

  const removeStep = (id: number) => {
    const updatedSteps = state.steps
      .filter((st: any) => st.id !== id)
      .map((st: any, index: number) => ({ ...st, id: index + 1 }));
    setters.setSteps(updatedSteps);
  };

  return (
    <section>
      <label className={inputs.label}>Instruktioner</label>
      <div className="flex flex-col gap-2 mb-3">
        {state.steps.map((s: any) => (
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
          value={state.currentStep}
          onChange={(e) => setters.setCurrentStep(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && (e.preventDefault(), addStep())
          }
          className={`flex-1 px-3 py-2 border rounded-xl resize-none focus:ring-2 focus:ring-focus outline-none ${
            state.errors.steps ? "border-[#B8312F]" : "border-border"
          }`}
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
      {state.errors.steps && (
        <p className={errorMessage.warning}>{state.errors.steps}</p>
      )}
    </section>
  );
};
