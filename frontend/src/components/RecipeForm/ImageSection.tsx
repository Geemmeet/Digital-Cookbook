import { inputs } from "../../styles/theme";

export const ImageSection = ({ state, setters }: any) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setters.setImageFile(file);
      setters.setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <section>
      <label className={inputs.label}>Bild</label>
      <div className="w-full rounded-xl border-2 border-dashed border-border overflow-hidden bg-white min-h-[128px] flex items-center justify-center transition-all hover:border-accent/40">
        {state.imagePreview ? (
          <div className="relative w-full">
            <img src={state.imagePreview} alt="Preview" className="w-full h-48 object-cover" />
            <button
              type="button"
              onClick={() => {
                setters.setImagePreview(null);
                setters.setImageFile(null);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-lg shadow hover:bg-red-600 transition-colors"
            >
              ✕
            </button>
          </div>
        ) : (
          <label className="cursor-pointer p-8 flex flex-col items-center w-full">
            <span className="text-2xl mb-1">📷</span>
            <span className="text-sm font-medium text-gray-400">Ladda upp en bild</span>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        )}
      </div>
    </section>
  );
};