"use client";

import { useState, useEffect } from "react";
import { nationalUniversities } from "@/lib/national-data";
import type { College } from "@/types";

interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
  collegeId?: string;
}

const defaultTasks = [
  { id: "request-transcripts", text: "Request high school transcripts", done: false },
  { id: "request-rec-letters", text: "Request teacher recommendation letters", done: false },
  { id: "write-essay", text: "Write personal statement / college essay", done: false },
  { id: "request-test-scores", text: "Request SAT/ACT score reports", done: false },
  { id: "fill-out-fafsa", text: "Fill out FAFSA", done: false },
  { id: "fill-out-css", text: "Fill out CSS Profile (if required)", done: false },
  { id: "prep-interview", text: "Prepare for admissions interview", done: false },
  { id: "visit-campus", text: "Schedule campus visit / virtual tour", done: false },
  { id: "check-deadlines", text: "Verify application deadlines", done: false },
  { id: "submit-application", text: "Submit application", done: false },
];

const STORAGE_KEY = "collegehub-checklists";

function loadItems(): ChecklistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveItems(items: ChecklistItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function ChecklistsPage() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newText, setNewText] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setItems(loadItems());
  }, []);

  useEffect(() => {
    if (items.length > 0) saveItems(items);
  }, [items]);

  function addItem() {
    if (!newText.trim()) return;
    const item: ChecklistItem = {
      id: crypto.randomUUID(),
      text: newText.trim(),
      done: false,
      collegeId: selectedCollege || undefined,
    };
    setItems((prev) => [...prev, item]);
    setNewText("");
  }

  function toggleItem(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  }

  function deleteItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function addDefaultTasks() {
    setItems((prev) => {
      const existingTexts = new Set(prev.map((i) => i.text));
      const newTasks = defaultTasks
        .filter((t) => !existingTexts.has(t.text))
        .map((t) => ({ ...t, id: crypto.randomUUID(), collegeId: selectedCollege || undefined }));
      return [...prev, ...newTasks];
    });
  }

  function clearDone() {
    setItems((prev) => prev.filter((i) => !i.done));
  }

  const filtered = items.filter((item) => {
    if (filter === "active" && item.done) return false;
    if (filter === "done" && !item.done) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchesText = item.text.toLowerCase().includes(q);
      const college = item.collegeId
        ? nationalUniversities.find((c) => c.id === item.collegeId)
        : null;
      const matchesCollege = college
        ? college.name.toLowerCase().includes(q)
        : false;
      return matchesText || matchesCollege;
    }
    return true;
  });

  const activeCount = items.filter((i) => !i.done).length;
  const doneCount = items.filter((i) => i.done).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Application Checklists
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track your college application tasks — {activeCount} active,{" "}
            {doneCount} done
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addDefaultTasks}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            + Defaults
          </button>
          {doneCount > 0 && (
            <button
              onClick={clearDone}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              Clear done
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "active", "done"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === "all" ? items.length : f === "active" ? activeCount : doneCount})
          </button>
        ))}
      </div>

      {/* Add item */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder="Add a task..."
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
        <select
          value={selectedCollege}
          onChange={(e) => setSelectedCollege(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="">General task</option>
          {nationalUniversities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          onClick={addItem}
          disabled={!newText.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {/* Search */}
      {items.length > 0 && (
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks or colleges..."
          className="mb-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center text-sm text-gray-400 dark:border-gray-600 dark:text-gray-500">
          {items.length === 0
            ? "No tasks yet. Add one above or click '+ Defaults' to start with common tasks."
            : "No tasks match your filter."}
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((item) => {
            const college = item.collegeId
              ? nationalUniversities.find((c) => c.id === item.collegeId)
              : null;
            return (
              <div
                key={item.id}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  item.done
                    ? "bg-gray-50 dark:bg-gray-800/50"
                    : "bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-750"
                }`}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    item.done
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300 hover:border-blue-400 dark:border-gray-600"
                  }`}
                >
                  {item.done && (
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
                <span
                  className={`flex-1 text-sm ${
                    item.done
                      ? "text-gray-400 line-through dark:text-gray-500"
                      : "text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {item.text}
                </span>
                {college && (
                  <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    {college.name}
                  </span>
                )}
                <button
                  onClick={() => deleteItem(item.id)}
                  className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Delete task"
                >
                  <svg
                    className="h-4 w-4 text-gray-400 hover:text-red-500"
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
  );
}
