"use client";

import type { Track } from "@/types/student-graph";

const GOALS: { track: Track; emoji: string; label: string; desc: string }[] =
  [
    {
      track: "college",
      emoji: "🎓",
      label: "College",
      desc: "Apply to universities and pursue higher education",
    },
    {
      track: "career",
      emoji: "💼",
      label: "Career",
      desc: "Start working or join the workforce directly",
    },
    {
      track: "research",
      emoji: "🧪",
      label: "Research",
      desc: "Pursue scientific research and discovery",
    },
    {
      track: "startup",
      emoji: "🚀",
      label: "Startup",
      desc: "Build your own company or venture",
    },
    {
      track: "undecided",
      emoji: "❓",
      label: "Not Sure Yet",
      desc: "Still exploring your options — that&apos;s okay!",
    },
  ];

export default function GoalStep({
  selected,
  onSelect,
  onNext,
}: {
  selected: Track | null;
  onSelect: (track: Track) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
        What are you hoping to do after high school?
      </h2>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        Choose the path that best describes your goals
      </p>

      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        {GOALS.map(({ track, emoji, label, desc }) => (
          <button
            key={track}
            onClick={() => onSelect(track)}
            className={`group rounded-xl border-2 p-5 text-left transition-all hover:shadow-md ${
              selected === track
                ? "border-blue-500 bg-blue-50 shadow-md dark:border-blue-400 dark:bg-blue-900/20"
                : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
            }`}
          >
            <div className="mb-2 text-3xl">{emoji}</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {label}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
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
