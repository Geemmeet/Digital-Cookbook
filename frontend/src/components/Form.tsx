import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { inputs, buttons, layout } from "../styles/theme";

interface Ingredient {
  id: number;
  amount: string;
  unit: string;
  name: string;
}

interface Step {
  id: number;
  description: string;
}

const unitGroups = [
  { label: "Hushållsmått", units: ["dl", "msk", "tsk", "krm"] },
  { label: "Volym", units: ["l", "dl", "ml", "cl"] },
  { label: "Vikt", units: ["kg", "g", "mg"] },
  { label: "Övrigt", units: ["st", "portioner", "nypa"] },
];

export default function RecipeForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [servings, setServings] = useState("4");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [category, setCategory] = useState("frukost");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState({
    amount: "",
    unit: "dl",
    name: "",
  });
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddIngredient = () => {
    {/* VALIDERING: Säkerställ att ingrediensen har ett namn och en giltig mängd innan den läggs till */}
    const amountValue = parseFloat(currentIngredient.amount);

    {/* Om namnet är tomt, mängden inte är ett nummer eller är mindre än eller lika med 0, avbryt */}
    if (!currentIngredient.name || isNaN(amountValue) || amountValue <= 0) {
      return;
    }
    
    {/* Lägg till den nya ingrediensen i listan och återställ input-fälten */}
    setIngredients((prev) => [
      ...prev,
      { ...currentIngredient, id: Date.now() },
    ]);
    setCurrentIngredient({ amount: "", unit: "dl", name: "" });
  };

  const handleAddStep = () => {
    if (!currentStep.trim()) return;
    setSteps((prev) => [
      ...prev,
      { id: prev.length + 1, description: currentStep.trim() },
    ]);
    setCurrentStep("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // SKAPA LOKALA KOPIOR FÖR ATT FÅNGA UPP "GLÖMDA" FÄLT
    let finalIngredients = [...ingredients];
    let finalSteps = [...steps];

    if (currentIngredient.name && currentIngredient.amount) {
      const newIng = { ...currentIngredient, id: Date.now() };
      finalIngredients.push(newIng);
      setIngredients(finalIngredients);
      setCurrentIngredient({ amount: "", unit: "dl", name: "" });
    }

    if (currentStep.trim()) {
      const newStep = { id: steps.length + 1, description: currentStep.trim() };
      finalSteps.push(newStep);
      setSteps(finalSteps);
      setCurrentStep("");
    }

    if (!name || finalIngredients.length === 0 || finalSteps.length === 0) {
      alert("Fyll i namn och lägg till minst en ingrediens och ett steg!");
      return;
    }

    try {
      let foto_url = "";
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("recipe-images")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("recipe-images")
          .getPublicUrl(filePath);

        foto_url = urlData.publicUrl;
      }

      const response = await fetch("http://localhost:8000/recept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          cooking_time: parseInt(time) || 0,
          servings: parseInt(servings) || 0,
          ingredients: finalIngredients.map(({ amount, unit, name }) => ({
            amount,
            unit,
            name,
          })),
          steps: finalSteps.map((s) => s.description),
          category,
          image_url: foto_url,
        }),
      });

      if (!response.ok) throw new Error("Kunde inte spara receptet");

      alert("Receptet har sparats!");
      setName("");
      setIngredients([]);
      setSteps([]);
      setImagePreview(null);
      setImageFile(null);
    } catch (error: any) {
      alert(`Fel: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Namn & Beskrivning */}
      <div>
        <label className={inputs.label}>Maträttens namn</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputs.base}
          placeholder="Namn..."
        />
      </div>

      <div>
        <label className={inputs.label}>Beskrivning</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputs.base} resize-none`}
          rows={3}
          placeholder="Beskrivning..."
        />
      </div>

      {/* Tid, Portioner & Kategori */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={inputs.label}>Tid (min)</label>
          <input
            type="number"
            min="0"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={inputs.base}
            placeholder="0"
          />
        </div>
        
        <div>
          <label className={inputs.label}>Portioner</label>
          <input
            type="number"
            min="1" // Förhindrar noll eller negativa portioner
            step="1" // Endast heltal för portioner är oftast bäst
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            onKeyDown={(e) => {
              // Förhindrar tecken som 'e', 'E', '+', '-', ',' och '.' 
              if (['e', 'E', '+', '-', ',', '.'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            className={inputs.base}
            placeholder="4"
          />
        </div>

        <div>
          <label className={inputs.label}>Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputs.base}
          >
            <option value="frukost">Frukost</option>
            <option value="lunch">Lunch</option>
            <option value="middag">Middag</option>
            <option value="baka">Baka</option>
          </select>
        </div>
      </div>

      {/* Bildhantering */}
      <div>
        <label className={inputs.label}>Bild</label>
        <div className="w-full rounded-xl border-2 border-dashed border-border overflow-hidden bg-white min-h-[128px] flex items-center justify-center">
          {imagePreview ? (
            <div className="relative w-full">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setImageFile(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded text-xs"
              >
                ✕
              </button>
            </div>
          ) : (
            <label className="cursor-pointer p-10 flex flex-col items-center w-full">
              <span className="text-2xl mb-2">📷</span>
              <span className="text-sm font-medium">Ladda upp bild</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Ingredienser */}
      <div>
        <label className={inputs.label}>Ingredienser</label>
        <div className="flex flex-col gap-2 mb-3">
          {ingredients.map((ing) => (
            <div key={ing.id} className={layout.ingredientRow}>
              <span className="text-sm">
                {ing.amount} {ing.unit} {ing.name}
              </span>
              <button
                type="button"
                onClick={() =>
                  setIngredients((p) => p.filter((i) => i.id !== ing.id))
                }
                className={buttons.icon}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            step="any"
            min="0"
            value={currentIngredient.amount}
            onChange={(e) =>
              setCurrentIngredient((p) => ({ ...p, amount: e.target.value }))
            }
            placeholder="Mängd"
            className="w-20 px-3 py-2 border border-border rounded-xl focus:ring-2 focus:ring-focus outline-none"
          />
          <select
            value={currentIngredient.unit}
            onChange={(e) =>
              setCurrentIngredient((p) => ({ ...p, unit: e.target.value }))
            }
            className="px-2 py-2 border border-border rounded-xl bg-white text-sm focus:ring-2 focus:ring-focus outline-none"
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
            value={currentIngredient.name}
            onChange={(e) =>
              setCurrentIngredient((p) => ({ ...p, name: e.target.value }))
            }
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAddIngredient())
            }
            placeholder="Ingrediens"
            className="flex-1 px-3 py-2 border border-border rounded-xl focus:ring-2 focus:ring-focus outline-none"
          />
          <button
            type="button"
            onClick={handleAddIngredient}
            disabled={!currentIngredient.name || !currentIngredient.amount}
            className={`${buttons.plus} disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            +
          </button>
        </div>
      </div>

      {/* Instruktioner */}
      <div>
        <label className={inputs.label}>Instruktioner</label>
        <div className="flex flex-col gap-2 mb-3">
          {steps.map((s) => (
            <div key={s.id} className={layout.ingredientRow}>
              <p className="text-sm">
                <span className="font-bold text-accent mr-2">{s.id}.</span>{" "}
                {s.description}
              </p>
              <button
                type="button"
                onClick={() =>
                  setSteps((p) =>
                    p
                      .filter((st) => st.id !== s.id)
                      .map((st, i) => ({ ...st, id: i + 1 })),
                  )
                }
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
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.preventDefault(), handleAddStep())
            }
            className="flex-1 px-3 py-2 border border-border rounded-xl resize-none focus:ring-2 focus:ring-focus outline-none"
            rows={2}
            placeholder="Beskriv steget..."
          />
          <button
            type="button"
            onClick={handleAddStep}
            disabled={!currentStep.trim()}
            className={`${buttons.plus} self-end disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            +
          </button>
        </div>
      </div>

      {/* Spara-knapp */}
      <button
        type="submit"
        className={`${buttons.accent} w-full py-4 text-lg mt-4`}
      >
        Spara Recept
      </button>
    </form>
  );
}
