"use client";

import { useStudentGraph } from "@/contexts/StudentGraph";

const TRACK_LABELS: Record<string, string> = {
  college: "College Applicant",
  career: "Career Seeker",
  research: "Research Track",
  startup: "Entrepreneur",
  undecided: "Exploring Options",
};

const GRADE_LABELS: Record<string, string> = {
  "8th": "8th Grader",
  freshman: "Freshman",
  sophomore: "Sophomore",
  junior: "Junior",
  senior: "Senior",
  "gap-year": "Gap Year",
  college: "College Student",
};

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function GreetingBanner() {
  const { graph, getProfileCompleteness } = useStudentGraph();
  const name = graph.firstName || "Student";
  const track = TRACK_LABELS[graph.track] || "Student";
  const grade = GRADE_LABELS[graph.gradeLevel] || "";
  const completeness = getProfileCompleteness();

  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 text-white shadow-lg sm:p-8">
      <h1 className="text-2xl font-bold sm:text-3xl">
        {getTimeBasedGreeting()}, {name}.
      </h1>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-blue-100">
        <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
          {track}
        </span>
        {grade && (
          <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
            {grade}
          </span>
        )}
      </div>

      {/* Readiness bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm text-blue-100">
          <span>Profile Readiness</span>
          <span>{completeness}%</span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>
    </div>
  );
}
