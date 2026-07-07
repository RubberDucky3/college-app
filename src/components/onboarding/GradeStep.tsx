"use client";

import type { GradeLevel } from "@/types/student-graph";

const GRADES: { value: GradeLevel; label: string }[] = [
  { value: "8th", label: "8th Grade" },
  { value: "freshman", label: "Freshman" },
  { value: "sophomore", label: "Sophomore" },
  { value: "junior", label: "Junior" },
  { value: "senior", label: "Senior" },
  { value: "gap-year", label: "Gap Year" },
];

export default function GradeStep({
  selected,
  onSelect,
  onNext,
}: {
  selected: GradeLevel | null;
  onSelect: (grade: GradeLevel) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
        What grade are you in?
      </h2>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        This helps us build a timeline that fits your schedule
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {GRADES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className={`rounded-xl border-2 px-6 py-4 text-lg font-medium transition-all hover:shadow-md ${
              selected === value
                ? "border-blue-500 bg-blue-50 shadow-md dark:border-blue-400 dark:bg-blue-900/20"
                : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!selected}
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue
      </button>
    </div>
  );
}
