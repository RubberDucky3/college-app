"use client";

import { useState } from "react";
import { useStudentGraph } from "@/contexts/StudentGraph";

export default function TodayGoal() {
  const { graph, setDailyGoal, completeDailyGoal } = useStudentGraph();
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(graph.dailyGoal || "");

  const today = new Date().toISOString().split("T")[0];
  const isToday = graph.dailyGoalDate === today;
  const activeGoal = isToday ? graph.dailyGoal : "";

  const handleSave = () => {
    if (input.trim()) {
      setDailyGoal(input.trim());
      setEditing(false);
    }
  };

  if (!activeGoal && !editing) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Today&apos;s Goal
        </h3>
        <button
          onClick={() => setEditing(true)}
          className="mt-2 text-sm text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          + Set a goal for today
        </button>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Today&apos;s Goal
        </h3>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            placeholder="e.g. Finish activity descriptions"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
          <button
            onClick={handleSave}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Set
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Today&apos;s Goal
      </h3>
      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={() => completeDailyGoal()}
          disabled={graph.dailyGoalCompleted}
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
            graph.dailyGoalCompleted
              ? "border-green-500 bg-green-500 text-white"
              : "border-gray-300 hover:border-blue-400 dark:border-gray-600"
          }`}
        >
          {graph.dailyGoalCompleted && (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <span
          className={`text-sm ${
            graph.dailyGoalCompleted
              ? "text-gray-400 line-through dark:text-gray-500"
              : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {activeGoal}
        </span>
      </div>
    </div>
  );
}
