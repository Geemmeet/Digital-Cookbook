import { inputs, buttons, layout, errorMessage } from "../../styles/theme";

export const IngredientSection = ({ state, setters }: any) => {
  const unitGroups = [
    { label: "Hushållsmått", units: ["dl", "msk", "tsk", "krm"] },
    { label: "Volym", units: ["l", "dl", "ml", "cl"] },
    { label: "Vikt", units: ["kg", "g", "mg"] },
    { label: "Övrigt", units: ["st", "portioner", "nypa"] },
  ];

  const add = () => {
    if (!state.currentIngredient.name || !state.currentIngredient.amount)
      return;
    setters.setIngredients([
      ...state.ingredients,
      { ...state.currentIngredient, id: Date.now() },
    ]);
    setters.setCurrentIngredient({ amount: "", unit: "dl", name: "" });
    setters.setErrors((p: any) => ({ ...p, ingredients: "" }));
  };

  return (
    <section>
      <label className={inputs.label}>Ingredienser</label>
      <div className="flex flex-col gap-2 mb-3">
        {state.ingredients.map((ing: any) => (
          <div key={ing.id} className={layout.ingredientRow}>
            <span>
              {ing.amount} {ing.unit} {ing.name}
            </span>
            <button
              type="button"
              onClick={() =>
                setters.setIngredients(
                  state.ingredients.filter((i: any) => i.id !== ing.id),
                )
              }
              className={buttons.icon}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Input-raden */}
      <div className="flex gap-2 items-start">
        <input
          type="number"
          step="any"
          placeholder="Mängd"
          value={state.currentIngredient.amount}
          onChange={(e) =>
            setters.setCurrentIngredient({
              ...state.currentIngredient,
              amount: e.target.value,
            })
          }
          className={`${inputs.base} w-1 px-2`}
        />
        <select
          value={state.currentIngredient.unit}
          onChange={(e) =>
            setters.setCurrentIngredient({
              ...state.currentIngredient,
              unit: e.target.value,
            })
          }
          className={`${inputs.base} w-auto min-w-[75px]`} // Anpassad efter måttet
        >
          {unitGroups.map((g) => (
            <optgroup key={g.label} label={g.label}>
              {g.units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <input
          type="text"
          placeholder="Ingrediens"
          value={state.currentIngredient.name}
          onChange={(e) =>
            setters.setCurrentIngredient({
              ...state.currentIngredient,
              name: e.target.value,
            })
          }
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          className={`${inputs.base} flex-1`} // Tar upp resten av platsen
        />
        <button type="button" onClick={add} className={buttons.plus}>
          +
        </button>
      </div>
      
      {state.errors.ingredients && (
        <p className={`${errorMessage.warning} mt-2 w-full`}>
          {state.errors.ingredients}
        </p>
      )}
    </section>
  );
};
