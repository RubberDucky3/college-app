"use client";

import { useStudentGraph } from "@/contexts/StudentGraph";

const DIMENSIONS = [
  { key: "academics", label: "Academics", color: "bg-blue-500" },
  { key: "leadership", label: "Leadership", color: "bg-purple-500" },
  { key: "research", label: "Research", color: "bg-emerald-500" },
  { key: "community", label: "Community", color: "bg-amber-500" },
  { key: "impact", label: "Impact", color: "bg-rose-500" },
] as const;

type DimensionKey = (typeof DIMENSIONS)[number]["key"];

export default function ProgressRadar() {
  const { graph } = useStudentGraph();

  function computeScore(dim: DimensionKey): number {
    switch (dim) {
      case "academics": {
        let score = 0;
        let max = 0;
        if (graph.gpa > 0) { score += 25; }
        max += 25;
        if (graph.satMath > 0 || graph.satReading > 0 || graph.actComposite > 0) { score += 25; }
        max += 25;
        const advancedCount = graph.apCourses.length + graph.ibCourses.length + graph.honorsCourses.length;
        if (advancedCount > 0) { score += Math.min(advancedCount * 5, 25); }
        max += 25;
        if (graph.intendedMajor) { score += 25; }
        max += 25;
        return max === 0 ? 0 : Math.round((score / max) * 100);
      }
      case "leadership": {
        const leaders = graph.extracurriculars.filter((ec) => ec.leadership);
        return Math.min(leaders.length * 25, 100);
      }
      case "research": {
        const research = graph.extracurriculars.filter(
          (ec) => ec.type === "research"
        );
        return Math.min(research.length * 33, 100);
      }
      case "community": {
        const volunteer = graph.extracurriculars.filter(
          (ec) => ec.type === "volunteer"
        );
        const ecCount = graph.extracurriculars.length;
        const base = Math.min(volunteer.length * 25, 50);
        const total = Math.min(ecCount * 10, 50);
        return Math.min(base + total, 100);
      }
      case "impact": {
        const awards = graph.awards.length;
        return Math.min(awards * 25, 100);
      }
      default:
        return 0;
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">
        Skill Overview
      </h3>
      <div className="space-y-3">
        {DIMENSIONS.map((dim) => {
          const score = computeScore(dim.key);
          return (
            <div key={dim.key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {dim.label}
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {score}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${dim.color}`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
