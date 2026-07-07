"use client";

import Link from "next/link";
import { useCompare } from "@/hooks/useCompare";

export default function CompareBar() {
  const { compareIds, clearCompare } = useCompare();

  if (compareIds.length < 2) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">{compareIds.length}</span> college
          {compareIds.length !== 1 ? "s" : ""} selected for comparison
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={clearCompare}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Clear
          </button>
          <Link
            href={`/compare?ids=${compareIds.join(",")}`}
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            Compare →
          </Link>
        </div>
      </div>
    </div>
  );
}
