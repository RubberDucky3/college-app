"use client";

import Link from "next/link";
import { useStudentGraph } from "@/contexts/StudentGraph";
import { generateTasks, categoryIcon } from "@/lib/task-engine";

export default function NextPriority() {
  const { graph } = useStudentGraph();
  const summary = generateTasks(graph);
  const topTasks = summary.tasks.slice(0, 3);

  if (topTasks.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Next Priority
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          You&apos;re all caught up! Check back later for new tasks.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Next Priority
      </h3>
      <div className="mt-3 space-y-3">
        {topTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700/50"
          >
            <span className="mt-1 text-xl">{categoryIcon(task.category)}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {task.title}
                </h4>
                {task.daysUntilDeadline != null && task.daysUntilDeadline <= 7 && (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    {task.daysUntilDeadline}d left
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {task.description}
              </p>
              {task.href && (
                <Link
                  href={task.href}
                  className="mt-2 inline-block rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700"
                >
                  Start task →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
