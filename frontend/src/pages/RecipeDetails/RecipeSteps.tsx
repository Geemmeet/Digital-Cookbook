import type { Recipe } from "../../types";

interface Props {
  steps: Recipe["steps"];
}

export default function RecipeSteps({ steps }: Props) {
  return (
    <div className="p-[5%] pt-12 lg:pt-16 max-w-3xl mx-auto md:mx-0">
      <h2 className="text-2xl font-bold mb-12 uppercase tracking-tight text-center md:text-left text-gray-800">
        Gör så här
      </h2>

      <div className="space-y-10">
        {steps?.map((step, index) => {
          const description = typeof step === "string" ? step : step.description;

          return (
            <div key={index} className="flex flex-col md:flex-row gap-4 md:gap-6 group">
              {/* Mindre siffra och mörkare färg (color-surface-dark) */}
              <span className="text-2xl md:text-3xl font-black text-[#2D2D2D] leading-none text-center md:text-left shrink-0 opacity-80">
                {(index + 1).toString().padStart(2, "0")}
              </span>

              <div className="flex flex-col gap-2">
                <p className="text-gray-700 leading-relaxed text-base pt-1 text-center md:text-left">
                  {description}
                </p>
                <div className="w-8 border-b border-gray-200 mt-4 mx-auto md:mx-0"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}