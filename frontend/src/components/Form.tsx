import { useState } from "react";
import { supabase } from "../supabaseClient";

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

const units = ["dl", "msk", "tsk", "krm", "nypa", "l", "ml", "cl", "st","kg", "g", "portioner"];

const inputClass = "w-full px-4 py-3 rounded-xl border border-accent/30 bg-white text-text text-sm outline-none focus:ring-2 focus:ring-accent transition-colors duration-200";

const labelClass = "block text-sm font-semibold text-accent mb-1";

// Hooks för tillfällig lagring och hantering av formulärdata i webbläsaren innan inskick till backend.
export default function RecipeForm() {
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
      // 1. Ladda upp bild direkt till Supabase Storage
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

      // 2. Skicka receptdata till FastAPI
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

      // 3. Nollställ formuläret
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
        <label className={labelClass}>Maträttens namn</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="T.ex. Köttbullar med potatismos"
          className={inputClass}
        />
      </div>

      {/* Beskrivning */}
      <div>
        <label className={labelClass}>Kortare beskrivning</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beskriv rätten kortfattat..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Tid */}
      <div>
        <label className={labelClass}>Tid (minuter)</label>
        <input
          type="number"
          min="1"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="T.ex. 30"
          className={inputClass}
        />
      </div>

      {/* Bild */}
      <div>
        <label className={labelClass}>Bild</label>
        <div className="w-full rounded-xl border-2 border-dashed border-accent/30 overflow-hidden">
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Förhandsgranskning" className="w-full h-48 object-cover" />
              <button
                type="button"
                onClick={() => { setImagePreview(null); setImageFile(null); }}
                className="absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-md bg-primary text-white hover:bg-primary-hover"
              >
                Ta bort
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-accent/5 transition-colors">
              <span className="text-3xl mb-1">📷</span>
              <span className="text-sm text-accent/50 font-medium">Klicka för att ladda upp bild</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>
      </div>

      {/* Ingredienser */}
      <div>
        <label className={labelClass}>Ingredienser</label>
        {ingredients.length > 0 && (
          <ul className="mb-3 flex flex-col gap-1">
            {ingredients.map((ing) => (
              <li key={ing.id} className="flex items-center gap-2">
                <span className="text-accent text-lg leading-none">•</span>
                <span className="text-sm text-text flex-1">{ing.amount} {ing.unit} {ing.name}</span>
                <button type="button" onClick={() => handleEditIngredient(ing.id)} className="text-xs font-semibold px-2 py-1 rounded-md bg-focus/20 text-accent hover:bg-focus/40 transition-colors">Redigera</button>
                <button type="button" onClick={() => setIngredients((prev) => prev.filter((i) => i.id !== ing.id))} className="text-xs font-bold px-2 py-1 rounded-md bg-primary text-white hover:bg-primary-hover transition-colors">✕</button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2 items-center">
          <input type="text" value={currentIngredient.amount} onChange={(e) => setCurrentIngredient((prev) => ({ ...prev, amount: e.target.value }))} placeholder="Antal" className="w-20 px-3 py-3 rounded-xl border border-accent/30 text-sm outline-none focus:ring-2 focus:ring-accent bg-white transition-colors duration-200" />
          <select value={currentIngredient.unit} onChange={(e) => setCurrentIngredient((prev) => ({ ...prev, unit: e.target.value }))} className="px-3 py-3 rounded-xl border border-accent/30 text-sm outline-none focus:ring-2 focus:ring-accent bg-white transition-colors duration-200">
            {units.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <input type="text" value={currentIngredient.name} onChange={(e) => setCurrentIngredient((prev) => ({ ...prev, name: e.target.value }))} placeholder="Ingrediens" className="flex-1 px-3 py-3 rounded-xl border border-accent/30 text-sm outline-none focus:ring-2 focus:ring-accent bg-white transition-colors duration-200" />
          <button type="button" onClick={handleAddIngredient} className="bg-accent text-white rounded-xl px-4 py-3 text-xl font-bold hover:bg-accent-hover transition-colors duration-200">+</button>
        </div>
      </div>

      {/* Steg */}
      <div>
        <label className={labelClass}>Steg</label>
        {steps.length > 0 && (
          <ul className="mb-3 flex flex-col gap-1">
            {steps.map((step) => (
              <li key={step.id} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center mt-0.5">{step.id}</span>
                <span className="text-sm text-text flex-1">{step.description}</span>
                <button type="button" onClick={() => handleEditStep(step.id)} className="text-xs font-semibold px-2 py-1 rounded-md bg-focus/20 text-accent hover:bg-focus/40 transition-colors flex-shrink-0">Redigera</button>
                <button type="button" onClick={() => handleDeleteStep(step.id)} className="text-xs font-bold px-2 py-1 rounded-md bg-primary text-white hover:bg-primary-hover transition-colors flex-shrink-0">✕</button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2 items-center">
          <textarea value={currentStep} onChange={(e) => setCurrentStep(e.target.value)} placeholder="Beskriv steget..." rows={2} className="flex-1 px-3 py-3 rounded-xl border border-accent/30 text-sm outline-none focus:ring-2 focus:ring-accent resize-none bg-white transition-colors duration-200" />
          <button type="button" onClick={handleAddStep} className="bg-accent text-white rounded-xl px-4 py-3 text-xl font-bold hover:bg-accent-hover transition-colors duration-200 self-end">+</button>
        </div>
      </div>

      {/* Kategori */}
      <div>
        <label className={labelClass}>Kategori</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
          <option value="frukost">Frukost</option>
          <option value="lunch">Lunch</option>
          <option value="middag">Middag</option>
          <option value="baka">Baka</option>
        </select>
      </div>

      {/* Skicka */}
      <button type="submit" className="w-full mt-4 py-4 rounded-xl bg-accent text-white text-base font-bold hover:bg-accent-hover transition-colors duration-200 shadow-md">
        Spara recept
      </button>

    </form>
  );
}