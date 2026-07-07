"use client";

import { useState, useEffect, useCallback } from "react";
import { nationalUniversities } from "@/lib/national-data";
import type { College } from "@/types";

// ─── Types ──────────────────────────────────────────────────────

interface DeadlineReminder {
  id: string;
  collegeId: string;
  label: string;
  date: string;
  notes: string;
  notifyDaysBefore: number;
}

interface Notification {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
}

// ─── Storage helpers ────────────────────────────────────────────

const REMINDERS_KEY = "collegehub-reminders";
const NOTIFICATIONS_KEY = "collegehub-notifications";

function loadReminders(): DeadlineReminder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveReminders(items: DeadlineReminder[]) {
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(items));
}

function loadNotifications(): Notification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotifications(items: Notification[]) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(items));
}

// ─── Derive deadlines from college data ─────────────────────────

const deadlineFields: { label: string; key: keyof College }[] = [
  { label: "Application Deadline", key: "applicationDeadline" },
  { label: "Early Action Deadline", key: "earlyActionDeadline" },
  { label: "Early Decision Deadline", key: "earlyDecisionDeadline" },
  { label: "Priority Deadline", key: "priorityApplicationDeadline" },
  { label: "Housing Deposit Deadline", key: "housingDepositDeadline" },
];

function generateSuggestedReminders(): DeadlineReminder[] {
  const suggestions: DeadlineReminder[] = [];
  const seen = new Set<string>();

  for (const college of nationalUniversities) {
    for (const field of deadlineFields) {
      const dateVal = college[field.key];
      if (!dateVal || typeof dateVal !== "string") continue;
      const key = `${college.id}-${field.key}`;
      if (seen.has(key)) continue;
      seen.add(key);
      suggestions.push({
        id: crypto.randomUUID(),
        collegeId: college.id,
        label: field.label,
        date: dateVal,
        notes: `Deadline for ${college.name}`,
        notifyDaysBefore: 14,
      });
    }
  }

  return suggestions;
}

// ─── Component ──────────────────────────────────────────────────

export default function NotificationsPage() {
  const [reminders, setReminders] = useState<DeadlineReminder[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "all" | "past" | "settings">("upcoming");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setReminders(loadReminders());
    setNotifications(loadNotifications());
  }, []);

  useEffect(() => {
    if (reminders.length > 0) saveReminders(reminders);
  }, [reminders]);

  useEffect(() => {
    if (notifications.length > 0) saveNotifications(notifications);
  }, [notifications]);

  // ── Notification check ────────────────────────────────────────

  const checkDeadlines = useCallback(() => {
    const today = new Date();
    const newNotifs: Notification[] = [];

    for (const r of reminders) {
      const deadlineDate = new Date(r.date);
      const diffMs = deadlineDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays <= 0 && diffDays > -3) {
        // Deadline passed within last 3 days
        const college = nationalUniversities.find((c) => c.id === r.collegeId);
        newNotifs.push({
          id: crypto.randomUUID(),
          title: `Deadline passed: ${r.label}`,
          body: `${r.label} for ${college?.name ?? "Unknown college"} was on ${r.date}.`,
          date: new Date().toISOString(),
          read: false,
        });
      } else if (diffDays > 0 && diffDays <= r.notifyDaysBefore && r.notifyDaysBefore > 0) {
        // Approaching deadline
        const college = nationalUniversities.find((c) => c.id === r.collegeId);
        newNotifs.push({
          id: crypto.randomUUID(),
          title: `Coming up: ${r.label}`,
          body: `${r.label} for ${college?.name ?? "Unknown college"} is in ${diffDays} day${diffDays === 1 ? "" : "s"} (${r.date}).`,
          date: new Date().toISOString(),
          read: false,
        });
      }
    }

    if (newNotifs.length > 0) {
      setNotifications((prev) => {
        const existing = new Set(prev.map((n) => n.title + n.body));
        const unique = newNotifs.filter((n) => !existing.has(n.title + n.body));
        return [...unique, ...prev];
      });
    }
  }, [reminders]);

  // Initial check
  useEffect(() => {
    if (reminders.length > 0) checkDeadlines();
  }, [checkDeadlines, reminders.length]);

  // ── Reminder CRUD ────────────────────────────────────────────

  function addReminder(r: DeadlineReminder) {
    setReminders((prev) => {
      const exists = prev.some(
        (p) => p.collegeId === r.collegeId && p.label === r.label
      );
      if (exists) return prev;
      return [...prev, r];
    });
  }

  function deleteReminder(id: string) {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function clearAllNotifications() {
    setNotifications([]);
  }

  // ── Filtering ─────────────────────────────────────────────────

  const today = new Date();

  const upcoming = reminders
    .map((r) => ({
      ...r,
      college: nationalUniversities.find((c) => c.id === r.collegeId),
      daysUntil: Math.ceil(
        (new Date(r.date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      ),
    }))
    .filter((r) => r.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const past = reminders
    .map((r) => ({
      ...r,
      college: nationalUniversities.find((c) => c.id === r.collegeId),
      daysUntil: Math.ceil(
        (new Date(r.date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      ),
    }))
    .filter((r) => r.daysUntil < 0)
    .sort((a, b) => b.daysUntil - a.daysUntil);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const suggestions = generateSuggestedReminders();

  // Count how many suggestion deadlines have been added
  const existingKeys = new Set(
    reminders.map((r) => `${r.collegeId}-${r.label}`)
  );
  const freshSuggestions = suggestions.filter(
    (s) => !existingKeys.has(`${s.collegeId}-${s.label}`)
  );

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Notification Tracker
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track deadlines and get reminded about upcoming application dates
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 pb-2 dark:border-gray-700">
        {(["upcoming", "all", "past", "settings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === "all" && unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Notifications tab ─────────────────────────────────── */}
      {activeTab === "all" && (
        <div>
          {notifications.length > 0 && (
            <div className="mb-4 flex gap-2">
              <button
                onClick={markAllRead}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Mark all read
              </button>
              <button
                onClick={clearAllNotifications}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                Clear all
              </button>
            </div>
          )}

          {notifications.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center text-sm text-gray-400 dark:border-gray-600 dark:text-gray-500">
              No notifications yet. Go to Settings to add deadline reminders.
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition-colors ${
                    n.read
                      ? "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                      : "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          n.read
                            ? "text-gray-700 dark:text-gray-300"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {n.title}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {n.body}
                      </p>
                      <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                        {new Date(n.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {!n.read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Upcoming reminders tab ────────────────────────────── */}
      {activeTab === "upcoming" && (
        <div>
          {upcoming.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center text-sm text-gray-400 dark:border-gray-600 dark:text-gray-500">
              No upcoming deadlines. Add reminders in Settings.
            </div>
          ) : (
            <div className="space-y-2">
              {upcoming.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {r.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {r.college?.name ?? "Unknown"} — {r.date}
                    </p>
                    {r.notes && (
                      <p className="mt-0.5 text-xs text-gray-400">
                        {r.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        r.daysUntil <= 7
                          ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                          : r.daysUntil <= 30
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                      }`}
                    >
                      {r.daysUntil === 0
                        ? "Today!"
                        : r.daysUntil === 1
                          ? "Tomorrow"
                          : `${r.daysUntil} days`}
                    </span>
                    <button
                      onClick={() => deleteReminder(r.id)}
                      className="text-gray-400 hover:text-red-500"
                      aria-label="Delete reminder"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Past reminders tab ────────────────────────────────── */}
      {activeTab === "past" && (
        <div>
          {past.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center text-sm text-gray-400 dark:border-gray-600 dark:text-gray-500">
              No past deadlines yet.
            </div>
          ) : (
            <div className="space-y-2">
              {past.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 opacity-60 dark:border-gray-700 dark:bg-gray-800/50"
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 line-through dark:text-gray-400">
                      {r.label}
                    </p>
                    <p className="text-xs text-gray-400">
                      {r.college?.name ?? "Unknown"} — {r.date}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-400">
                    {Math.abs(r.daysUntil)} days ago
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Settings tab ──────────────────────────────────────── */}
      {activeTab === "settings" && (
        <div>
          {/* Import reminders from college data */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
              Import Deadlines from College Data
            </h2>
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
              Automatically add all known application deadlines from our college database ({freshSuggestions.length} new deadlines available).
            </p>
            {freshSuggestions.length > 0 ? (
              <button
                onClick={() => {
                  freshSuggestions.forEach(addReminder);
                  setShowSuggestions(false);
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Import {freshSuggestions.length} deadlines
              </button>
            ) : (
              <p className="text-xs text-green-600 dark:text-green-400">
                All known deadlines have been imported ✓
              </p>
            )}
          </div>

          {/* Desktop notification permission */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
              Browser Notifications
            </h2>
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
              Get desktop notifications for upcoming deadlines. You&apos;ll see alerts
              here and in your browser.
            </p>
            <button
              onClick={() => {
                if ("Notification" in window) {
                  Notification.requestPermission();
                }
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Enable browser notifications
            </button>
          </div>

          {/* Your active reminders */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Your Reminders ({reminders.length})
              </h2>
              {reminders.length > 0 && (
                <button
                  onClick={() => {
                    setReminders([]);
                    setNotifications([]);
                  }}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Clear all
                </button>
              )}
            </div>
            {reminders.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                No reminders yet. Import deadlines from the section above.
              </p>
            ) : (
              <div className="max-h-64 space-y-1 overflow-y-auto">
                {reminders.map((r) => {
                  const college = nationalUniversities.find(
                    (c) => c.id === r.collegeId
                  );
                  return (
                    <div
                      key={r.id}
                      className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex-1">
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          {r.label}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {college?.name ?? "Unknown"} — {r.date}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteReminder(r.id)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Remove reminder"
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
