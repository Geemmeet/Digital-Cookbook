import { inputs } from "../../styles/theme";

export const ImageSection = ({
  imagePreview,
  setImageFile,
  setImagePreview,
}: {
  imagePreview: string | null;
  setImageFile: (file: File | null) => void;
  setImagePreview: (url: string | null) => void;
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <section>
      <label className={inputs.label}>Bild</label>
      <div className="w-full rounded-xl border-2 border-dashed border-border overflow-hidden bg-white min-h-[128px] flex items-center justify-center transition-all hover:border-accent/40">
        {imagePreview ? (
          <div className="relative w-full">
            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
            <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                setImageFile(null);
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
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
          </label>
        )}
      </div>
    </section>
  );
};