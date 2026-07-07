"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { STATE_ABBREVIATIONS, COLLEGE_TYPES, COLLEGE_LOCALES, COLLEGE_SIZES, SORT_OPTIONS, COLLEGE_PROGRAMS } from "@/lib/constants";
import { useState, useCallback, useRef, useEffect } from "react";

export default function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [filters, setFilters] = useState({
    query: searchParams.get("query") || "",
    state: searchParams.get("state") || "",
    type: searchParams.get("type") || "",
    locale: searchParams.get("locale") || "",
    size: searchParams.get("size") || "",
    program: searchParams.get("program") || "",
    sortBy: searchParams.get("sortBy") || "name",
    sortOrder: searchParams.get("sortOrder") || "asc",
  });

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const applyFilters = useCallback(
    (updatedFilters: typeof filters) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const params = new URLSearchParams();
        Object.entries(updatedFilters).forEach(([key, value]) => {
          if (value) params.set(key, value);
        });
        router.push(`/colleges?${params.toString()}`);
      }, 300);
    },
    [router]
  );

  function handleChange(key: keyof typeof filters, value: string) {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    applyFilters(updated);
  }

  return (
    <div className="flex flex-wrap gap-3">
      {/* Type filter */}
      <select
        value={filters.type}
        onChange={(e) => handleChange("type", e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-400 dark:focus:ring-blue-800"
      >
        <option value="">All Types</option>
        {COLLEGE_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      {/* Locale filter */}
      <select
        value={filters.locale}
        onChange={(e) => handleChange("locale", e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-400 dark:focus:ring-blue-800"
      >
        <option value="">All Locations</option>
        {COLLEGE_LOCALES.map((l) => (
          <option key={l.value} value={l.value}>
            {l.label}
          </option>
        ))}
      </select>

      {/* Size filter */}
      <select
        value={filters.size}
        onChange={(e) => handleChange("size", e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-400 dark:focus:ring-blue-800"
      >
        <option value="">All Sizes</option>
        {COLLEGE_SIZES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {/* State filter */}
      <select
        value={filters.state}
        onChange={(e) => handleChange("state", e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-400 dark:focus:ring-blue-800"
      >
        <option value="">All States</option>
        {Object.entries(STATE_ABBREVIATIONS).map(([abbr, name]) => (
          <option key={abbr} value={abbr}>
            {name}
          </option>
        ))}
      </select>

      {/* Program filter */}
      <select
        value={filters.program}
        onChange={(e) => handleChange("program", e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-400 dark:focus:ring-blue-800"
      >
        <option value="">All Programs</option>
        {COLLEGE_PROGRAMS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={filters.sortBy}
        onChange={(e) => handleChange("sortBy", e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-400 dark:focus:ring-blue-800"
      >
        {SORT_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            Sort: {s.label}
          </option>
        ))}
      </select>

      <button
        onClick={() => handleChange("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc")}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        title="Toggle sort order"
      >
        {filters.sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
      </button>
    </div>
  );
}
