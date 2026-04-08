import { inputs } from "../styles/theme";

// Hjälpfunktion för felmeddelanden 
export const inputClass = (key: string, errors: { [key: string]: string }) =>
  `${inputs.base} ${errors[key] ? "border-primary" : ""}`;