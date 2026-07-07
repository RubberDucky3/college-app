"use client";

const STEPS = [
  "Welcome",
  "Your Goal",
  "Grade Level",
  "Dream School",
  "AI Profile",
] as const;

export default function StepIndicator({
  currentStep,
}: {
  currentStep: number;
  totalSteps?: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
              i === currentStep
                ? "bg-blue-600 text-white"
                : i < currentStep
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
                  : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
            }`}
          >
            {i < currentStep ? "✓" : i + 1}
          </div>
          <span
            className={`hidden text-sm sm:inline ${
              i === currentStep
                ? "font-medium text-gray-900 dark:text-gray-100"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {label}
          </span>
          {i < STEPS.length - 1 && (
            <div
              className={`mx-1 h-px w-6 ${
                i < currentStep
                  ? "bg-blue-300 dark:bg-blue-700"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
