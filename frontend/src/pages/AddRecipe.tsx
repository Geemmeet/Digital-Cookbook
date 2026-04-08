import { useState } from "react";
import RecipeForm from "../components/RecipeForm";

export default function NyttRecept() {
  const [mode, setMode] = useState<"manual" | "link">("manual");
  const [linkUrl, setLinkUrl] = useState("");
  const [loadingLink, setLoadingLink] = useState(false);

  const handleFetchFromLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl) return;
    setLoadingLink(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoadingLink(false);
    alert("API-hämtning inte kopplad ännu — lägg till din logik här!");
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-accent mb-8">Lägg till recept</h1>

      {/* Mode toggle */}
      <div className="flex rounded-xl overflow-hidden border border-focus mb-8">
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors duration-200 ${
            mode === "manual"
              ? "bg-accent text-white"
              : "bg-white text-text hover:bg-focus/20"
          }`}
        >
          Fyll i manuellt
        </button>
        <button
          type="button"
          onClick={() => setMode("link")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors duration-200 ${
            mode === "link"
              ? "bg-accent text-white"
              : "bg-white text-text hover:bg-focus/20"
          }`}
        >
          Hämta från länk
        </button>
      </div>

      {/* Link mode */}
      {mode === "link" && (
        <form
          onSubmit={handleFetchFromLink}
          className="p-6 rounded-2xl border border-focus"
        >
          <label className="block text-sm font-semibold text-text mb-2">
            Klistra in länk till recept
          </label>
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-3 rounded-xl border border-focus text-sm outline-none focus:ring-2 focus:ring-focus bg-white"
          />
          <button
            type="submit"
            disabled={loadingLink}
            className="mt-3 w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-colors duration-200 disabled:opacity-50"
          >
            {loadingLink ? "Hämtar..." : "Hämta recept"}
          </button>
        </form>
      )}

      {/* Manual form */}
      {mode === "manual" && <RecipeForm />}
    </div>
  );
}