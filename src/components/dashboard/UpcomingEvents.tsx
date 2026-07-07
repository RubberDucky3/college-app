"use client";

import { useStudentGraph } from "@/contexts/StudentGraph";

function getUpcomingEvents(graph: ReturnType<typeof useStudentGraph>["graph"]) {
  const events: { title: string; date: string; type: string; emoji: string }[] = [];

  // College deadlines
  for (const college of graph.colleges) {
    if (college.deadline && college.status === "planning" || college.status === "in-progress") {
      events.push({
        title: `${college.collegeName} application due`,
        date: college.deadline,
        type: "deadline",
        emoji: "📋",
      });
    }
  }

  // Scholarship deadlines
  for (const s of graph.scholarships) {
    if (s.deadline && (s.status === "saved" || s.status === "applying")) {
      events.push({
        title: `${s.name} scholarship deadline`,
        date: s.deadline,
        type: "deadline",
        emoji: "💰",
      });
    }
  }

  // Sort by date
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return events.slice(0, 5);
}

export default function UpcomingEvents() {
  const { graph } = useStudentGraph();
  const events = getUpcomingEvents(graph);

  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Upcoming
        </h3>
        <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">
          No upcoming deadlines. Add colleges to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Upcoming
      </h3>
      <div className="mt-2 space-y-3">
        {events.map((event, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="mt-0.5 text-lg">{event.emoji}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {event.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(event.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
