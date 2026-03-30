import { useState } from "react";
import { supabase } from "../supabaseClient";

// För att hålla koden ren och organiserad definierar vi våra datatyper först. Detta gör det enklare att förstå vad varje del av formuläret hanterar och underlättar när vi senare ska skicka data till Supabase.
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

// En lista över vanliga måttenheter för ingredienser
const units = ["msk", "tsk", "st", "dl", "ml", "l", "g", "kg", "krm", "nypa", "portioner"];

export default function RecipeForm() {
  //Use states för att hantera formulärets data
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [category, setCategory] = useState("frukost");

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState({
    amount: "",
    unit: "st",
    name: "",
  });

  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Spara filen för att kunna ladda upp den till Supabase Storage senare
      setImageFile(file); 
      
      // 2. Skapa en temporär URL för att visa bilden i formuläret direkt
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || ingredients.length === 0 || steps.length === 0) {
      alert("Fyll i namn och lägg till minst en ingrediens och ett steg!");
      return;
    }

    try {
      let finalImageUrl = "";

      // 1. Ladda upp bilden till Supabase Storage om en fil finns
      if (imageFile) {
        // Skapa ett unikt filnamn för att undvika krockar
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('recipe-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // Hämta den publika URL:en för bilden
        const { data: urlData } = supabase.storage
          .from('recipe-images')
          .getPublicUrl(filePath);
        
        finalImageUrl = urlData.publicUrl;
      }

      // 2. Spara själva receptet med den RIKTIGA bild-URL:en
      const { data: recipe, error: recipeError } = await supabase
        .from("recipes")
        .insert([
          {
            name: name,
            description: description,
            cooking_time: parseInt(time) || 0,
            image_url: finalImageUrl, // Spara bildlänk till molnet (Bucket supabase)
            category: category,
          },
        ])
        .select()
        .single();

      if (recipeError) throw recipeError;

      const recipeId = recipe.id;

      // 3. Förbered ingredienser och steg
      const ingredientsToSave = ingredients.map((ing) => ({
        recipe_id: recipeId,
        amount: ing.amount,
        unit: ing.unit,
        name: ing.name,
      }));

      const stepsToSave = steps.map((step, index) => ({
        recipe_id: recipeId,
        step_number: index + 1,
        description: step.description,
      }));

      // 4. Skicka upp allt parallellt
      const [ingResponse, stepResponse] = await Promise.all([
        supabase.from("ingredients").insert(ingredientsToSave),
        supabase.from("steps").insert(stepsToSave),
      ]);

      if (ingResponse.error) throw ingResponse.error;
      if (stepResponse.error) throw stepResponse.error;

      alert("Receptet har sparats i Kokboken!");
      
      // 5. Nollställ allt
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

  const inputClass = "w-full px-4 py-3 rounded-xl border border-accent/30 bg-white text-text text-sm outline-none focus:ring-2 focus:ring-accent transition-colors duration-200";
  const labelClass = "block text-sm font-semibold text-accent mb-1";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Name */}
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

      {/* Description */}
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

      {/* Time */}
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

      {/* Image */}
      <div>
        <label className={labelClass}>Bild</label>
        <div className="w-full rounded-xl border-2 border-dashed border-accent/30 overflow-hidden">
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Förhandsgranskning" className="w-full h-48 object-cover" />
              <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                setImageFile(null);
              }}
              className="..."
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

      {/* Ingredients */}
      <div>
        <label className={labelClass}>Ingredienser</label>

        {/* Bullet list */}
        {ingredients.length > 0 && (
          <ul className="mb-3 flex flex-col gap-1">
            {ingredients.map((ing) => (
              <li key={ing.id} className="flex items-center gap-2">
                {/* Bullet */}
                <span className="text-accent text-lg leading-none">•</span>

                {/* Text */}
                <span className="text-sm text-text flex-1">
                  {ing.amount} {ing.unit} {ing.name}
                </span>

                {/* Redigera */}
                <button
                  type="button"
                  onClick={() => handleEditIngredient(ing.id)}
                  className="text-xs font-semibold px-2 py-1 rounded-md bg-focus/20 text-accent hover:bg-focus/40 transition-colors"
                >
                  Redigera
                </button>

                {/* Ta bort */}
                <button
                  type="button"
                  onClick={() => setIngredients((prev) => prev.filter((i) => i.id !== ing.id))}
                  className="text-xs font-bold px-2 py-1 rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* New ingredient input */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={currentIngredient.amount}
            onChange={(e) => setCurrentIngredient((prev) => ({ ...prev, amount: e.target.value }))}
            placeholder="Antal"
            className="w-20 px-3 py-3 rounded-xl border border-accent/30 text-sm outline-none focus:ring-2 focus:ring-accent bg-white transition-colors duration-200"
          />
          <select
            value={currentIngredient.unit}
            onChange={(e) => setCurrentIngredient((prev) => ({ ...prev, unit: e.target.value }))}
            className="px-3 py-3 rounded-xl border border-accent/30 text-sm outline-none focus:ring-2 focus:ring-accent bg-white transition-colors duration-200"
          >
            {units.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <input
            type="text"
            value={currentIngredient.name}
            onChange={(e) => setCurrentIngredient((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Ingrediens"
            className="flex-1 px-3 py-3 rounded-xl border border-accent/30 text-sm outline-none focus:ring-2 focus:ring-accent bg-white transition-colors duration-200"
          />
          <button
            type="button"
            onClick={handleAddIngredient}
            className="bg-accent text-white rounded-xl px-4 py-3 text-xl font-bold hover:bg-accent-hover transition-colors duration-200"
          >
            +
          </button>
        </div>
      </div>

      {/* Steps */}
      <div>
        <label className={labelClass}>Steg</label>

        {steps.length > 0 && (
          <ul className="mb-3 flex flex-col gap-1">
            {steps.map((step) => (
              <li key={step.id} className="flex items-start gap-2">
                {/* Step number */}
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {step.id}
                </span>

                {/* Text */}
                <span className="text-sm text-text flex-1">{step.description}</span>

                {/* Redigera */}
                <button
                  type="button"
                  onClick={() => handleEditStep(step.id)}
                  className="text-xs font-semibold px-2 py-1 rounded-md bg-focus/20 text-accent hover:bg-focus/40 transition-colors flex-shrink-0"
                >
                  Redigera
                </button>

                {/* Ta bort */}
                <button
                  type="button"
                  onClick={() => handleDeleteStep(step.id)}
                  className="text-xs font-bold px-2 py-1 rounded-md bg-primary text-white hover:bg-primary-hover transition-colors flex-shrink-0"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* New step input */}
        <div className="flex gap-2 items-center">
          <textarea
            value={currentStep}
            onChange={(e) => setCurrentStep(e.target.value)}
            placeholder="Beskriv steget..."
            rows={2}
            className="flex-1 px-3 py-3 rounded-xl border border-accent/30 text-sm outline-none focus:ring-2 focus:ring-accent resize-none bg-white transition-colors duration-200"
          />
          <button
            type="button"
            onClick={handleAddStep}
            className="bg-accent text-white rounded-xl px-4 py-3 text-xl font-bold hover:bg-accent-hover transition-colors duration-200 self-end"
          >
            +
          </button>
        </div>
      </div>

      {/* Kategori */}
      <div>
        <label className={labelClass}>Kategori</label>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        >
          <option value="frukost">Frukost</option>
          <option value="lunch">Lunch</option>
          <option value="middag">Middag</option>
          <option value="baka">Baka</option>
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full mt-4 py-4 rounded-xl bg-accent text-white text-base font-bold hover:bg-accent-hover transition-colors duration-200 shadow-md"
      >
        Spara recept
      </button>
    </form>
  );
}