"use client";

import { useState } from "react";
import { useStudentGraph } from "@/contexts/StudentGraph";

const DEFAULT_MILESTONES = [
  { id: "profile-started", label: "Profile Started" },
  { id: "major-selected", label: "Major Selected" },
  { id: "activities-added", label: "Activities Added" },
  { id: "awards-added", label: "Awards Added" },
  { id: "test-scores-added", label: "Test Scores Added" },
  { id: "essay-started", label: "Essay Started" },
  { id: "applications-started", label: "Applications Started" },
] as const;

export default function MilestoneTracker() {
  const { graph, completeMilestone } = useStudentGraph();
  const [justCompleted, setJustCompleted] = useState<string | null>(null);

  function isMilestoneComplete(id: string): boolean {
    return graph.milestones.some((m) => m.id === id && m.completed);
  }

  function isMilestoneAutoMet(id: string): boolean {
    switch (id) {
      case "profile-started":
        return graph.firstName !== "";
      case "major-selected":
        return graph.intendedMajor !== undefined && graph.intendedMajor !== "";
      case "activities-added":
        return graph.extracurriculars.length > 0;
      case "awards-added":
        return graph.awards.length > 0;
      case "test-scores-added":
        return graph.satMath > 0 || graph.satReading > 0 || graph.actComposite > 0;
      case "essay-started":
        return false; // manual only
      case "applications-started":
        return false; // manual only
      default:
        return false;
    }
  }

  function handleComplete(id: string) {
    if (!isMilestoneComplete(id)) {
      completeMilestone(id);
      setJustCompleted(id);
      setTimeout(() => setJustCompleted(null), 2000);
    }
  }

  const completedCount = DEFAULT_MILESTONES.filter((m) => isMilestoneComplete(m.id)).length;
  const autoMetCount = DEFAULT_MILESTONES.filter(
    (m) => !isMilestoneComplete(m.id) && isMilestoneAutoMet(m.id)
  ).length;
  const progress = Math.round(
    ((completedCount + autoMetCount) / DEFAULT_MILESTONES.length) * 100
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Application Journey
        </h3>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {completedCount + autoMetCount}/{DEFAULT_MILESTONES.length}
        </span>
      </div>

      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-1">
        {DEFAULT_MILESTONES.map((m) => {
          const completed = isMilestoneComplete(m.id);
          const autoMet = !completed && isMilestoneAutoMet(m.id);

          return (
            <button
              key={m.id}
              onClick={() => handleComplete(m.id)}
              disabled={completed}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                completed
                  ? "text-gray-400 dark:text-gray-500"
                  : autoMet
                    ? "text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50"
              } ${justCompleted === m.id ? "bg-green-50 dark:bg-green-900/20" : ""}`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] transition-colors ${
                  completed
                    ? "border-green-400 bg-green-50 text-green-500 dark:border-green-600 dark:bg-green-900/30 dark:text-green-400"
                    : autoMet
                      ? "border-blue-300 bg-blue-50 text-blue-500 dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700"
                }`}
              >
                {completed ? "✓" : autoMet ? "~" : ""}
              </span>
              <span
                className={
                  completed
                    ? "line-through"
                    : autoMet
                      ? "font-medium"
                      : ""
                }
              >
                {m.label}
              </span>
              {autoMet && (
                <span className="ml-auto text-[10px] text-blue-400 dark:text-blue-500">
                  auto
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[10px] text-gray-400 dark:text-gray-500">
        Auto-detected milestones are marked with ~. Tap to confirm manually.
      </p>
    </div>
  );
}
