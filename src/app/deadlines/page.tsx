"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getCollegeById } from "@/lib/api";
import { useFavorites } from "@/hooks/useFavorites";
import type { College } from "@/types";

type DeadlineType = "regular" | "early-action" | "early-decision" | "priority" | "housing";

interface DeadlineEvent {
  date: string;
  label: string;
  type: DeadlineType;
  collegeId: string;
  collegeName: string;
  collegeColor: string;
}

function parseDeadline(raw: string): { month: number; day: number } | null {
  if (!raw || raw === "N/A") return null;

  const months: Record<string, number> = {
    january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
    july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  };

  const parts = raw.trim().split(/\s+/);
  if (parts.length < 2) return null;

  const monthStr = parts[0]?.toLowerCase().replace(",", "");
  const month = months[monthStr];
  if (!month) return null;

  const day = parseInt(parts[1]?.replace(",", ""), 10);
  if (isNaN(day)) return null;

  return { month, day };
}

function extractDeadlines(college: College): DeadlineEvent[] {
  const events: DeadlineEvent[] = [];

  const reg = parseDeadline(college.applicationDeadline);
  if (reg) {
    events.push({
      date: `${reg.month}/${reg.day}`,
      label: `Application Deadline`,
      type: "regular",
      collegeId: college.id,
      collegeName: college.name,
      collegeColor: college.primaryColor,
    });
  }

  const ea = parseDeadline(college.earlyActionDeadline);
  if (ea) {
    events.push({
      date: `${ea.month}/${ea.day}`,
      label: `Early Action Deadline`,
      type: "early-action",
      collegeId: college.id,
      collegeName: college.name,
      collegeColor: college.primaryColor,
    });
  }

  const ed = parseDeadline(college.earlyDecisionDeadline);
  if (ed) {
    events.push({
      date: `${ed.month}/${ed.day}`,
      label: `Early Decision Deadline`,
      type: "early-decision",
      collegeId: college.id,
      collegeName: college.name,
      collegeColor: college.primaryColor,
    });
  }

  const prio = parseDeadline(college.priorityApplicationDeadline);
  if (prio) {
    events.push({
      date: `${prio.month}/${prio.day}`,
      label: `Priority Deadline`,
      type: "priority",
      collegeId: college.id,
      collegeName: college.name,
      collegeColor: college.primaryColor,
    });
  }

  const housing = parseDeadline(college.housingDepositDeadline);
  if (housing) {
    events.push({
      date: `${housing.month}/${housing.day}`,
      label: `Housing Deposit Deadline`,
      type: "housing",
      collegeId: college.id,
      collegeName: college.name,
      collegeColor: college.primaryColor,
    });
  }

  return events;
}

const TYPE_ORDER: Record<DeadlineType, number> = {
  "early-decision": 0,
  "early-action": 1,
  priority: 2,
  regular: 3,
  housing: 4,
};

const TYPE_STYLES: Record<DeadlineType, string> = {
  "early-decision": "border-l-purple-500 bg-purple-50 dark:bg-purple-900/20",
  "early-action": "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20",
  priority: "border-l-teal-500 bg-teal-50 dark:bg-teal-900/20",
  regular: "border-l-amber-500 bg-amber-50 dark:bg-amber-900/20",
  housing: "border-l-green-500 bg-green-50 dark:bg-green-900/20",
};

const TYPE_LABELS: Record<DeadlineType, string> = {
  "early-decision": "Early Decision",
  "early-action": "Early Action",
  priority: "Priority",
  regular: "Regular",
  housing: "Housing",
};

// Sort months for calendar grouping
const MONTH_ORDER = [
  "August", "September", "October", "November", "December",
  "January", "February", "March", "April", "May", "June", "July",
];

function monthName(m: number): string {
  return [
    "", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ][m] ?? "";
}

export default function DeadlinesPage() {
  const { favorites } = useFavorites();
  const [selectedTypes, setSelectedTypes] = useState<Set<DeadlineType>>(
    new Set(["early-decision", "early-action", "priority", "regular", "housing"])
  );

  const allEvents = useMemo(() => {
    const events: DeadlineEvent[] = [];
    for (const id of favorites) {
      const c = getCollegeById(id);
      if (c) events.push(...extractDeadlines(c));
    }
    return events.sort(
      (a, b) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type]
    );
  }, [favorites]);

  const filteredEvents = useMemo(
    () => allEvents.filter((e) => selectedTypes.has(e.type)),
    [allEvents, selectedTypes]
  );

  // Group by month
  const groupedByMonth = useMemo(() => {
    const groups: Record<string, DeadlineEvent[]> = {};
    for (const event of filteredEvents) {
      const [m] = event.date.split("/");
      const mNum = parseInt(m, 10);
      const label = monthName(mNum);
      if (!groups[label]) groups[label] = [];
      groups[label].push(event);
    }
    return groups;
  }, [filteredEvents]);

  const sortedMonths = useMemo(
    () =>
      Object.keys(groupedByMonth).sort(
        (a, b) => MONTH_ORDER.indexOf(a) - MONTH_ORDER.indexOf(b)
      ),
    [groupedByMonth]
  );

  const toggleType = (t: DeadlineType) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/colleges" className="text-sm text-blue-600 hover:underline">
        ← Back to colleges
      </Link>
      <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
        Deadline Calendar
      </h1>
      <p className="mt-1 text-gray-600 dark:text-gray-400">
        Track application deadlines for your saved colleges.
      </p>

      {/* Type filter chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        {(Object.keys(TYPE_LABELS) as DeadlineType[]).map((t) => (
          <button
            key={t}
            onClick={() => toggleType(t)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedTypes.has(t)
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {favorites.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
          <p className="text-gray-500 dark:text-gray-400">
            No saved colleges yet.
          </p>
          <Link
            href="/colleges"
            className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            Browse and save colleges →
          </Link>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
          <p className="text-gray-500 dark:text-gray-400">
            No matching deadlines for the selected filter.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {sortedMonths.map((month) => (
            <div key={month}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {month}
              </h2>
              <div className="space-y-2">
                {groupedByMonth[month]
                  ?.sort((a, b) => {
                    // Sort by day within month
                    const dayA = parseInt(a.date.split("/")[1]!, 10);
                    const dayB = parseInt(b.date.split("/")[1]!, 10);
                    return dayA - dayB;
                  })
                  .map((event, idx) => {
                    const day = parseInt(event.date.split("/")[1]!, 10);
                    return (
                      <div
                        key={`${event.collegeId}-${event.type}-${idx}`}
                        className={`flex items-center gap-4 rounded-lg border-l-4 p-4 ${TYPE_STYLES[event.type]} border border-gray-200 dark:border-gray-700`}
                      >
                        {/* Day badge */}
                        <div className="flex flex-col items-center min-w-[48px]">
                          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {day}
                          </span>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            {month.slice(0, 3)}
                          </span>
                        </div>

                        {/* Event info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/colleges/${event.collegeId}`}
                            className="text-sm font-semibold text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400 truncate block"
                          >
                            {event.collegeName}
                          </Link>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {event.label}
                          </p>
                        </div>

                        {/* Type tag */}
                        <span
                          className="hidden sm:inline rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: `${event.collegeColor}15`,
                            color: event.collegeColor,
                          }}
                        >
                          {TYPE_LABELS[event.type]}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}

          {/* Summary bar */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong className="text-gray-900 dark:text-gray-100">
                {favorites.length}
              </strong>{" "}
              saved college{favorites.length !== 1 ? "s" : ""} ·{" "}
              <strong className="text-gray-900 dark:text-gray-100">
                {filteredEvents.length}
              </strong>{" "}
              deadline{filteredEvents.length !== 1 ? "s" : ""} shown
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
