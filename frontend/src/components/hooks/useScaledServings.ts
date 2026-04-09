import { useEffect, useState } from "react";


// Skalar portionsstorlek
export function useScaledServings(baseServings: number) {
  const [currentServings, setCurrentServings] = useState(baseServings);

  useEffect(() => {
    if (baseServings) {
      setCurrentServings(baseServings);
    }
  }, [baseServings]);

  return { currentServings, setCurrentServings };
}