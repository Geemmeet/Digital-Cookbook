import { useState } from "react";
import { supabase } from "../supabaseClient";
import { theme } from "../styles/theme";

/**
 * Representerar en enskild ingrediens i ett recept.
 */
interface Ingredient {
  id: number;
  amount: string;
  unit: string;
  name: string;
}

/**
 * Representerar ett enskilt instruktionssteg i tillagningsprocessen.
 */
interface Step {
  id: number;
  description: string;
}

// Grupperade enheter för bättre UX
const unitGroups = [
  { 
    label: "Köksmått", 
    units: ["dl", "msk", "tsk", "krm"] 
  },
  { 
    label: "Volym", 
    units: ["l", "dl", "ml", "cl"] 
  },
  { 
    label: "Vikt", 
    units: ["kg", "g", "mg"] 
  },
  { 
    label: "Övrigt", 
    units: ["st", "portioner", "nypa"] 
  }
];

export default function RecipeForm() {
  // Hooks för tillfällig lagring av data
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [category, setCategory] = useState("frukost");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState({ amount: "", unit: "st", name: "" });
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState("");

  // Packar upp stilarna för kortare kod i JSX
  const { input, label, buttonPrimary, buttonSecondary, ingredientRow, iconButton } = theme;

  // Bildhantering
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Ingredienser
  const handleAddIngredient = () => {
    if (!currentIngredient.name || !currentIngredient.amount) return;
    setIngredients((prev) => [...prev, { ...currentIngredient, id: Date.now() }]);
    setCurrentIngredient({ amount: "", unit: "st", name: "" });
  };

  const handleEditIngredient = (id: number) => {
    const ingredient = ingredients.find((i) => i.id === id);
    if (!ingredient) return;
    setCurrentIngredient({ amount: ingredient.amount, unit: ingredient.unit, name: ingredient.name });
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  // Steg
  const handleAddStep = () => {
    if (!currentStep.trim()) return;
    setSteps((prev) => [...prev, { id: prev.length + 1, description: currentStep.trim() }]);
    setCurrentStep("");
  };

  const handleEditStep = (id: number) => {
    const step = steps.find((s) => s.id === id);
    if (!step) return;
    setCurrentStep(step.description);
    setSteps((prev) => prev.filter((s) => s.id !== id).map((s, i) => ({ ...s, id: i + 1 })));
  };

  const handleDeleteStep = (id: number) => {
    setSteps((prev) => prev.filter((s) => s.id !== id).map((s, i) => ({ ...s, id: i + 1 })));
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || ingredients.length === 0 || steps.length === 0) {
      alert("Fyll i namn och lägg till minst en ingrediens och ett steg!");
      return;
    }

    try {
      let foto_url = "";
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const filePath = `${Math.random()}.${fileExt}`;

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
          rubrik: name,
          beskrivning: description,
          tidsatgang: time,
          ingredienser: ingredients.map((i) => ({
            amount: i.amount,
            unit: i.unit,
            name: i.name,
          })),
          steg: steps.map((s) => s.description),
          kategori: category,
          foto_url,
        }),
      });

      if (!response.ok) throw new Error("Kunde inte spara receptet");

      alert("Receptet har sparats i Kokboken!");

      setName("");
      setDescription("");
      setTime("");
      setIngredients([]);
      setSteps([]);
      setImagePreview(null);
      setImageFile(null);

    } catch (error: any) {
      console.error("Fel vid sparande:", error.message);
      alert("Kunde inte spara receptet. Kolla konsolen.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Namn */}
      <div>
        <label className={label}>Maträttens namn</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="T.ex. Köttbullar med potatismos"
          className={input}
        />
      </div>

      {/* Beskrivning */}
      <div>
        <label className={label}>Kortare beskrivning</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beskriv rätten kortfattat..."
          rows={3}
          className={`${input} resize-none`}
        />
      </div>

      {/* Tid och Kategori i bredd */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Tid (minuter)</label>
          <input
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={input}
          />
        </div>
        <div>
          <label className={label}>Kategori</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={input}>
            <option value="frukost">Frukost</option>
            <option value="lunch">Lunch</option>
            <option value="middag">Middag</option>
            <option value="baka">Baka</option>
          </select>
        </div>
      </div>

      {/* Bild */}
      <div>
        <label className={label}>Bild</label>
        <div className="w-full rounded-xl border-2 border-dashed border-border overflow-hidden bg-white">
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Förhandsgranskning" className="w-full h-48 object-cover" />
              <button
                type="button"
                onClick={() => { setImagePreview(null); setImageFile(null); }}
                className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md"
              >
                Ta bort
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-surface transition-colors">
              <span className="text-3xl mb-1">📷</span>
              <span className="text-sm text-text/50 font-medium">Ladda upp bild</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>
      </div>

      {/* Ingredienser */}
      <div>
        <label className={label}>Ingredienser</label>
        <div className="flex flex-col gap-2 mb-3">
          {ingredients.map((ing) => (
            <div key={ing.id} className={ingredientRow}>
              <span className="text-sm text-text font-medium">{ing.amount} {ing.unit} {ing.name}</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => handleEditIngredient(ing.id)} className="text-xs font-semibold text-primary">Redigera</button>
                <button type="button" onClick={() => setIngredients((p) => p.filter((i) => i.id !== ing.id))} className={iconButton}>✕</button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <input type="text" value={currentIngredient.amount} onChange={(e) => setCurrentIngredient((p) => ({ ...p, amount: e.target.value }))} placeholder="Antal" className="w-20 px-3 py-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-surface-dark bg-white" />
          <select value={currentIngredient.unit} onChange={(e) => setCurrentIngredient((p) => ({ ...p, unit: e.target.value }))} className="px-3 py-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-surface-dark bg-white">
            {unitGroups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.units.map((u) => <option key={u} value={u}>{u}</option>)}
              </optgroup>
            ))}
          </select>
          <input type="text" value={currentIngredient.name} onChange={(e) => setCurrentIngredient((p) => ({ ...p, name: e.target.value }))} placeholder="Ingrediens" className="flex-1 px-3 py-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-surface-dark bg-white" />
          <button type="button" onClick={handleAddIngredient} className="bg-primary text-white rounded-xl px-4 py-3 font-bold">+</button>
        </div>
      </div>

      {/* Steg */}
      <div>
        <label className={label}>Instruktioner</label>
        <div className="flex flex-col gap-2 mb-3">
          {steps.map((s) => (
            <div key={s.id} className={ingredientRow}>
              <div className="flex gap-3">
                <span className="font-bold text-primary">{s.id}.</span>
                <span className="text-sm text-text">{s.description}</span>
              </div>
              <button type="button" onClick={() => handleDeleteStep(s.id)} className={iconButton}>✕</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 items-end">
          <textarea value={currentStep} onChange={(e) => setCurrentStep(e.target.value)} placeholder="Beskriv steget..." rows={2} className={`${input} flex-1 resize-none`} />
          <button type="button" onClick={handleAddStep} className="bg-primary text-white rounded-xl px-4 py-3 font-bold">+</button>
        </div>
      </div>

      {/* Skicka-knapp */}
      <button type="submit" className={`${buttonPrimary} w-full mt-4 text-lg`}>
        Spara Recept
      </button>

    </form>
  );
}