"use client";

import { useStudentGraph } from "@/contexts/StudentGraph";

const DIMENSIONS = [
  { key: "academics", label: "Academics", color: "bg-blue-500" },
  { key: "activities", label: "Activities", color: "bg-green-500" },
  { key: "goals", label: "Goals & Direction", color: "bg-purple-500" },
  { key: "testing", label: "Test Prep", color: "bg-orange-500" },
  { key: "preparation", label: "Application Readiness", color: "bg-pink-500" },
] as const;

export default function ReadinessScore() {
  const { graph } = useStudentGraph();

  const scores: Record<string, number> = {
    academics: graph.gpa > 0 ? Math.min(Math.round((graph.gpa / 4.0) * 100), 100) : 0,
    activities: Math.min(graph.extracurriculars.length * 20, 100),
    goals: graph.intendedMajor ? 100 : graph.interests.length > 0 ? 60 : graph.track !== "undecided" ? 40 : 10,
    testing: graph.satMath > 0 || graph.satReading > 0 || graph.actComposite > 0 ? 100 : 0,
    preparation: graph.essays.length > 0 ? 100 : graph.colleges.length > 0 ? 50 : 10,
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
        Progress Radar
      </h3>
      <div className="space-y-3">
        {DIMENSIONS.map(({ key, label, color }) => {
          const score = scores[key] ?? 0;
          return (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {label}
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {score}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${color}`}
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
