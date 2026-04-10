import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { validateRecipe } from "../../utils/validation";
import type { Recipe, IngredientWithId } from "../../types";

const BASE_URL = import.meta.env.VITE_API_URL;

export const useRecipeForm = (
  initialData?: Recipe | null,
  isEditing: boolean = false,
  onSuccess?: (id: number, category: string) => void
) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cooking_time, setCookingTime] = useState("");
  const [servings, setServings] = useState("4");
  const [category, setCategory] = useState("frukost");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [ingredients, setIngredients] = useState<IngredientWithId[]>([]);
  const [steps, setSteps] = useState<{ id: number; description: string }[]>([]);

  const [currentIngredient, setCurrentIngredient] = useState({ amount: "", unit: "dl", name: "" });
  const [currentStep, setCurrentStep] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || "");
      setCookingTime(initialData.cooking_time.toString());
      setServings(initialData.servings.toString());
      setCategory(initialData.category);
      setImagePreview(initialData.image_url || null);
      setIngredients(initialData.ingredients.map((ing, i) => ({ ...ing, id: i })));
      setSteps(initialData.steps.map((step, i) => ({
        id: i + 1,
        description: typeof step === "string" ? step : (step as any).description,
      })));
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    let finalIngredients = [...ingredients];
    if (currentIngredient.name.trim() && currentIngredient.amount) {
      finalIngredients.push({ ...currentIngredient, id: Date.now() });
    }

    let finalSteps = [...steps];
    if (currentStep.trim()) {
      finalSteps.push({ id: steps.length + 1, description: currentStep.trim() });
    }

    const validationData = {
      name,
      cooking_time: parseInt(cooking_time) || 0,
      servings: parseInt(servings) || 0,
      ingredients: finalIngredients,
      steps: finalSteps,
    };

    const newErrors = validateRecipe(validationData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);

      let foto_url = initialData?.image_url || imagePreview;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `public/${fileName}`;
        await supabase.storage.from("recipe-images").upload(filePath, imageFile);
        const { data } = supabase.storage.from("recipe-images").getPublicUrl(filePath);
        foto_url = data.publicUrl;
      }

      const url = isEditing
        ? `${BASE_URL}/recept/${initialData?.id}`
        : `${BASE_URL}/recept`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, description, category,
          cooking_time: parseInt(cooking_time),
          servings: parseInt(servings),
          image_url: foto_url,
          ingredients: finalIngredients.map(({ amount, unit, name }) => ({ amount, unit, name })),
          steps: finalSteps.map((s) => s.description),
        }),
      });

      if (!response.ok) throw new Error("Kunde inte spara");

      const savedRecipe = await response.json();

      if (onSuccess) onSuccess(savedRecipe.id, savedRecipe.category);
          } catch (err: any) {
            setSubmitError("Något gick fel, försök igen.");
          } finally {
            setIsLoading(false);
          }
        };

  return {
    name, setName,
    description, setDescription,
    cooking_time, setCookingTime,
    servings, setServings,
    category, setCategory,
    imagePreview, setImagePreview,
    setImageFile,
    ingredients, setIngredients,
    steps, setSteps,
    currentIngredient, setCurrentIngredient,
    currentStep, setCurrentStep,
    errors, setErrors,
    isLoading,
    submitError,
    handleSubmit,
  };
};