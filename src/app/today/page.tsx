"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStudentGraph } from "@/contexts/StudentGraph";
import {
  generateTasks,
  categoryIcon,
  categoryLabel,
  urgencyColor,
  type Task,
} from "@/lib/task-engine";

const BUDGETS = [30, 60, 120];
const DEFAULT_BUDGET = 60;

function todayKey(): string {
  return `collegehub-today-${new Date().toISOString().split("T")[0]}`;
}

/** Completions are per-day and disposable — no need to put them in the graph. */
function readDone(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(todayKey()) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export default function TodayPage() {
  const { graph, hydrated } = useStudentGraph();
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  // Safe as an initializer: nothing below renders until `hydrated` flips, so
  // the server's markup (null) and the client's first render still match.
  const [done, setDone] = useState<string[]>(readDone);

  function toggle(id: string) {
    setDone((prev) => {
      const next = prev.includes(id)
        ? prev.filter((d) => d !== id)
        : [...prev, id];
      try {
        localStorage.setItem(todayKey(), JSON.stringify(next));
      } catch {
        // localStorage full or unavailable
      }
      return next;
    });
  }

  const summary = useMemo(() => generateTasks(graph), [graph]);

  // Fill the day's budget greedily in priority order; the rest waits.
  const { plan, later } = useMemo(() => {
    const plan: Task[] = [];
    const later: Task[] = [];
    let spent = 0;
    for (const task of summary.tasks) {
      if (spent + task.estimatedMinutes <= budget || plan.length === 0) {
        plan.push(task);
        spent += task.estimatedMinutes;
      } else {
        later.push(task);
      }
    }
    return { plan, later };
  }, [summary.tasks, budget]);

  const planned = plan.reduce((sum, t) => sum + t.estimatedMinutes, 0);
  const remaining = plan
    .filter((t) => !done.includes(t.id))
    .reduce((sum, t) => sum + t.estimatedMinutes, 0);
  const finished = plan.filter((t) => done.includes(t.id)).length;

  if (!hydrated) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Today
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
          {" — "}
          {plan.length === 0
            ? "nothing on your plate."
            : `${plan.length} thing${plan.length === 1 ? "" : "s"}, about ${planned} minutes.`}
        </p>
      </div>

      {/* Time budget */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Time I have today:
        </span>
        <div className="flex gap-2">
          {BUDGETS.map((b) => (
            <button
              key={b}
              onClick={() => setBudget(b)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                budget === b
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {b < 60 ? `${b} min` : `${b / 60} hr`}
            </button>
          ))}
        </div>
        {plan.length > 0 && (
          <span className="ml-auto text-sm font-medium text-gray-700 dark:text-gray-300">
            {finished}/{plan.length} done
            {remaining > 0 && ` · ~${remaining} min left`}
          </span>
        )}
      </div>

      {/* Overdue banner */}
      {summary.dueThisWeek.length > 0 && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
          ⏰ {summary.dueThisWeek.length} item
          {summary.dueThisWeek.length === 1 ? " is" : "s are"} due within 7 days.
        </div>
      )}

      {/* The plan */}
      {plan.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-4xl">🎉</p>
          <p className="mt-3 font-medium text-gray-900 dark:text-gray-100">
            Nothing urgent today.
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Add colleges or fill in your profile and new steps will show up here.
          </p>
          <Link
            href="/colleges"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Explore colleges
          </Link>
        </div>
      ) : (
        <ol className="space-y-3">
          {plan.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              done={done.includes(task.id)}
              onToggle={() => toggle(task.id)}
            />
          ))}
        </ol>
      )}

      {/* Everything else */}
      {later.length > 0 && (
        <details className="mt-8">
          <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            {later.length} more task{later.length === 1 ? "" : "s"} waiting for
            another day
          </summary>
          <ol className="mt-3 space-y-3">
            {later.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                done={done.includes(task.id)}
                onToggle={() => toggle(task.id)}
              />
            ))}
          </ol>
        </details>
      )}
    </div>
  );
}

function TaskRow({
  task,
  done,
  onToggle,
}: {
  task: Task;
  done: boolean;
  onToggle: () => void;
}) {
  return (
    <li
      className={`flex items-start gap-3 rounded-xl border p-4 transition ${
        done
          ? "border-gray-200 bg-gray-50 opacity-60 dark:border-gray-700 dark:bg-gray-800/50"
          : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
      }`}
    >
      <input
        type="checkbox"
        checked={done}
        onChange={onToggle}
        aria-label={`Mark "${task.title}" done`}
        className="mt-1 h-5 w-5 shrink-0 rounded border-gray-300"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span>{categoryIcon(task.category)}</span>
          <h3
            className={`font-medium text-gray-900 dark:text-gray-100 ${done ? "line-through" : ""}`}
          >
            {task.title}
          </h3>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${urgencyColor(task.urgency)}`}
          >
            {categoryLabel(task.category)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ~{task.estimatedMinutes} min
          </span>
          {task.daysUntilDeadline != null && task.daysUntilDeadline <= 14 && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {task.daysUntilDeadline}d left
            </span>
          )}
        </div>
        {!done && (
          <>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {task.description}
            </p>
            <Link
              href={task.href}
              className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              Start →
            </Link>
          </>
        )}
      </div>
    </li>
  );
}
