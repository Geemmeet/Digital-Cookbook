import { useState } from "react";
import { theme } from "../styles/theme";

interface Ingredient {
  id: number;
  amount: string;
  unit: string;
  name: string;
}

const units = ["msk", "tsk", "st", "dl", "ml", "l", "g", "kg", "krm", "nypa"];

export default function NyttRecept() {
  const [mode, setMode] = useState<"manual" | "link">("manual");
  const [linkUrl, setLinkUrl] = useState("");
  const [loadingLink, setLoadingLink] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState({
    amount: "",
    unit: "st",
    name: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleAddIngredient = () => {
    if (!currentIngredient.name || !currentIngredient.amount) return;
    setIngredients((prev) => [
      ...prev,
      { ...currentIngredient, id: Date.now() },
    ]);
    setCurrentIngredient({ amount: "", unit: "st", name: "" });
  };

  const handleEditIngredient = (id: number) => {
    const ingredient = ingredients.find((i) => i.id === id);
    if (!ingredient) return;
    setCurrentIngredient({
      amount: ingredient.amount,
      unit: ingredient.unit,
      name: ingredient.name,
    });
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  const handleFetchFromLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl) return;
    setLoadingLink(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoadingLink(false);
    alert("API-hämtning inte kopplad ännu — lägg till din logik här!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !time || ingredients.length === 0) {
      alert("Fyll i alla fält och lägg till minst en ingrediens!");
      return;
    }
    console.log("Recept skickat:", { name, description, time, ingredients });
    alert("Receptet har skickats in!");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-primary mb-8">Lägg till recept</h1>

        {/* Mode toggle */}
        <div className="flex rounded-xl overflow-hidden border border-border mb-8">
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors duration-200 ${
              mode === "manual"
                ? "bg-primary text-white"
                : "bg-white text-text hover:bg-surface-dark"
            }`}
          >
            Fyll i manuellt
          </button>
          <button
            type="button"
            onClick={() => setMode("link")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors duration-200 ${
              mode === "link"
                ? "bg-primary text-white"
                : "bg-white text-text hover:bg-surface-dark"
            }`}
          >
            Hämta från länk
          </button>
        </div>

        {/* Link mode */}
        {mode === "link" && (
          <form
            onSubmit={handleFetchFromLink}
            className="p-6 bg-surface-dark rounded-2xl border border-border"
          >
            <label className={theme.label}>Klistra in länk till recept</label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              className={theme.input}
            />
            <button
              type="submit"
              disabled={loadingLink}
              className={`mt-3 w-full ${theme.buttonPrimary} disabled:opacity-50`}
            >
              {loadingLink ? "Hämtar..." : "Hämta recept"}
            </button>
          </form>
        )}

        {/* Manual form */}
        {mode === "manual" && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Name */}
            <div>
              <label className={theme.label}>Maträttens namn</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="T.ex. Köttbullar"
                className={theme.input}
              />
            </div>

            {/* Description */}
            <div>
              <label className={theme.label}>Kortare beskrivning</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Beskriv rätten kortfattat..."
                rows={3}
                className={`${theme.input} resize-none`}
              />
            </div>

            {/* Time */}
            <div>
              <label className={theme.label}>Tid</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="T.ex. 30 min"
                className={theme.input}
              />
            </div>

            {/* Image */}
            <div>
              <label className={theme.label}>Bild</label>
              <div className="w-full rounded-xl border-2 border-dashed border-border overflow-hidden">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Förhandsgranskning"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 bg-white text-primary rounded-full px-3 py-1 text-xs font-semibold shadow hover:bg-surface-dark transition-colors"
                    >
                      Ta bort
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-surface-dark transition-colors">
                    <span className="text-3xl mb-1">📷</span>
                    <span className="text-sm text-text/50 font-medium">
                      Klicka för att ladda upp bild
                    </span>
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

            {/* Ingredients */}
            <div>
              <label className={theme.label}>Ingredienser</label>

              {/* Locked ingredients */}
              {ingredients.length > 0 && (
                <div className="flex flex-col gap-2 mb-3">
                  {ingredients.map((ing) => (
                    <div key={ing.id} className={theme.ingredientRow}>
                      <span className="text-sm text-text font-medium">
                        {ing.amount} {ing.unit} {ing.name}
                      </span>
                      <div className="flex items-center gap-1 ml-auto">
                        <button
                          type="button"
                          onClick={() => handleEditIngredient(ing.id)}
                          className={theme.iconButton}
                          title="Redigera"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setIngredients((prev) =>
                              prev.filter((i) => i.id !== ing.id)
                            )
                          }
                          className={theme.iconButton}
                          title="Ta bort"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* New ingredient input */}
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={currentIngredient.amount}
                  onChange={(e) =>
                    setCurrentIngredient((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  placeholder="Antal"
                  className="w-20 px-3 py-3 rounded-xl border border-border text-sm outline-none focus:ring-2 focus:ring-surface-dark transition-colors duration-200"
                />
                <select
                  value={currentIngredient.unit}
                  onChange={(e) =>
                    setCurrentIngredient((prev) => ({
                      ...prev,
                      unit: e.target.value,
                    }))
                  }
                  className="px-3 py-3 rounded-xl border border-border text-sm outline-none focus:ring-2 focus:ring-surface-dark bg-white transition-colors duration-200"
                >
                  {units.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={currentIngredient.name}
                  onChange={(e) =>
                    setCurrentIngredient((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Ingrediens"
                  className="flex-1 px-3 py-3 rounded-xl border border-border text-sm outline-none focus:ring-2 focus:ring-surface-dark transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="bg-primary text-white rounded-xl px-4 py-3 text-xl font-bold hover:bg-primary-hover transition-colors duration-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className={`w-full mt-4 py-4 text-base ${theme.buttonPrimary}`}>
              Skicka in recept
            </button>
          </form>
        )}
      </div>
    </div>
  );
}