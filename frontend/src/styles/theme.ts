export const inputs = {
  base: "px-4 py-3 rounded-xl border border-border bg-white text-text text-sm outline-none focus:ring-2 focus:ring-surface-dark transition-colors duration-200",
  label: "block text-sm font-semibold text-text mb-1",
};

export const buttons = {
  // Röd knapp (Primary)
  primary: "py-3 px-5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors duration-200 shadow-sm disabled:opacity-50",
  
  // Blå knapp (Accent)
  accent: "py-3 px-5 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover transition-colors duration-200 shadow-sm disabled:opacity-50",
  
  // Små runda plus-knappar (Blå)
  plus: "w-10 h-10 flex items-center justify-center rounded-xl bg-accent text-white text-xl font-bold hover:bg-accent-hover transition-colors duration-200 shadow-sm",
  
  secondary: "py-3 px-5 rounded-xl bg-surface-dark text-text font-semibold hover:bg-border transition-colors duration-200",
  icon: "text-border hover:text-text transition-colors duration-200 text-lg",
};

export const layout = {
  card: "bg-white border border-border rounded-2xl shadow-sm p-6",
  ingredientRow: "flex items-center justify-between bg-surface border border-border rounded-xl px-4 py-3",
};

export const errorMessage = {
  warning: "text-primary text-xs mt-1 me-5 font-medium italic whitespace-nowrap"
}