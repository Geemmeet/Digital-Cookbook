import { useRecipeForm } from "../hooks/useRecipeForm";
import { inputs, buttons, errorMessage } from "../../styles/theme";
import { IngredientSection } from "./IngredientSection";
import { StepSection } from "./StepSection";
import { ImageSection } from "./ImageSection";
import type { Recipe } from "../../types";
import { inputClass } from "../../utils/formHelpers";
import { Required } from "./Required";

interface Props {
  initialData?: Recipe | null;
  isEditing?: boolean;
  onSuccess?: (id: string, category: string) => void;
}

export default function RecipeForm({
  initialData,
  isEditing,
  onSuccess,
}: Props) {
  const {
    name,
    setName,
    description,
    setDescription,
    cooking_time,
    setCookingTime,
    servings,
    setServings,
    category,
    setCategory,
    imagePreview,
    setImagePreview,
    setImageFile,
    ingredients,
    setIngredients,
    steps,
    setSteps,
    currentIngredient,
    setCurrentIngredient,
    currentStep,
    setCurrentStep,
    errors,
    setErrors,
    isLoading,
    submitError,
    handleSubmit,
  } = useRecipeForm(initialData, isEditing, onSuccess);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 text-left pb-10"
    >
      <div className="flex flex-col gap-4">
        <div className="relative">
          <label className={inputs.label}>
            Namn
            <Required />
          </label>
          <input
            placeholder="Köttbullar med potatismos..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors({ ...errors, name: "" });
            }}
            className={`${inputClass("name", errors)} w-full`}
          />
          {errors.name && <p className={errorMessage.warning}>{errors.name}</p>}
        </div>

        <div>
          <label className={inputs.label}>Beskrivning</label>
          <textarea
            placeholder="Köttbullar är en av mina favoriträtter..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputs.base} resize-none w-full`}
            rows={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="relative">
          <label className={inputs.label}>
            Minuter
            <Required />
          </label>
          <input
            type="number"
            value={cooking_time}
            onChange={(e) => {
              setCookingTime(e.target.value);
              setErrors({ ...errors, cooking_time: "" });
            }}
            className={`${inputClass("cooking_time", errors)} w-full`}
            placeholder="Minuter"
          />
          {errors.cooking_time && (
            <p className={errorMessage.warning}>{errors.cooking_time}</p>
          )}
        </div>
        <div className="relative">
          <label className={inputs.label}>
            Portioner
            <Required />
          </label>
          <input
            type="number"
            value={servings}
            onChange={(e) => {
              setServings(e.target.value);
              setErrors({ ...errors, servings: "" });
            }}
            className={`${inputClass("servings", errors)} w-full`}
            placeholder="Portioner"
          />
          {errors.servings && (
            <p className={errorMessage.warning}>{errors.servings}</p>
          )}
        </div>
        <div>
          <label className={inputs.label}>
            Kategori
            <Required />
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputs.base} w-full`}
          >
            <option value="frukost">Frukost</option>
            <option value="lunch">Lunch</option>
            <option value="middag">Middag</option>
            <option value="baka">Baka</option>
          </select>
        </div>
      </div>

      <ImageSection
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        setImageFile={setImageFile}
      />
      <IngredientSection
        ingredients={ingredients}
        currentIngredient={currentIngredient}
        errors={errors}
        setIngredients={setIngredients}
        setCurrentIngredient={setCurrentIngredient}
        setErrors={setErrors}
      />
      <StepSection
        steps={steps}
        currentStep={currentStep}
        errors={errors}
        setSteps={setSteps}
        setCurrentStep={setCurrentStep}
        setErrors={setErrors}
      />

      {submitError && <p className={errorMessage.warning}>{submitError}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className={`${buttons.accent} py-4 text-lg ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isLoading
          ? "Sparar..."
          : isEditing
            ? "Uppdatera recept"
            : "Spara recept"}
      </button>
    </form>
  );
}
