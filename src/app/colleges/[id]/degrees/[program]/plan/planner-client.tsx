"use client";

import { useState, useEffect } from "react";
import type { DegreePlan, Semester } from "@/types";

function computeProgress(semesters: Semester[], checked: Set<string>) {
  let completed = 0;
  let total = 0;
  for (const sem of semesters) {
    for (const c of sem.courses) {
      total += c.credits;
      if (checked.has(c.code)) completed += c.credits;
    }
  }
  return { completed, total, pct: total > 0 ? Math.round((completed / total) * 100) : 0 };
}

function storageKey(collegeId: string, planId: string) {
  return `planner_${collegeId}_${planId}`;
}

export default function PlannerClient({
  plan,
  collegeId,
}: {
  plan: DegreePlan;
  collegeId: string;
}) {
  const [checked, setChecked] = useState<Set<string>>(() => new Set());
  const [mounted, setMounted] = useState(false);

  const key = storageKey(collegeId, plan.id);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const arr = JSON.parse(saved) as string[];
        setChecked(new Set(arr));
      }
    } catch {
      // ignore parse errors
    }
  }, [key]);

  // Persist to localStorage
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(key, JSON.stringify([...checked]));
    } catch {
      // ignore storage errors
    }
  }, [checked, key, mounted]);

  const { completed, total, pct } = computeProgress(plan.semesters, checked);

  const toggle = (courseCode: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(courseCode)) {
        next.delete(courseCode);
      } else {
        next.add(courseCode);
      }
      return next;
    });
  };

  const reset = () => setChecked(new Set());

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Your Progress
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {completed} / {total} credits
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
          {pct}% complete
        </p>
        <div className="mt-2 flex justify-end">
          <button
            onClick={reset}
            className="text-xs text-gray-500 hover:text-red-600 transition-colors dark:text-gray-400 dark:hover:text-red-400"
          >
            Reset progress
          </button>
        </div>
      </div>

      {/* Semester Cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        {plan.semesters.map((semester, si) => {
          const semCompleted = semester.courses.filter((c) =>
            checked.has(c.code)
          ).length;
          return (
            <div
              key={si}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  {semester.name}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {semCompleted}/{semester.courses.length}
                </span>
              </div>
              <ul className="space-y-2">
                {semester.courses.map((course) => {
                  const done = checked.has(course.code);
                  return (
                    <li key={course.code}>
                      <button
                        onClick={() => toggle(course.code)}
                        className={`w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                          done
                            ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
                            : "border-gray-100 bg-gray-50 hover:border-gray-200 dark:border-gray-600 dark:bg-gray-900/50 dark:hover:border-gray-500"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs transition ${
                            done
                              ? "border-green-500 bg-green-500 text-white"
                              : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
                          }`}
                        >
                          {done ? "\u2713" : ""}
                        </span>
                        <span className="flex-1">
                          <span className="font-mono text-xs text-blue-600 dark:text-blue-400">
                            {course.code}
                          </span>
                          <span className="ml-2 text-gray-900 dark:text-gray-100">
                            {course.name}
                          </span>
                        </span>
                        <span className="shrink-0 rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                          {course.credits}cr
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
