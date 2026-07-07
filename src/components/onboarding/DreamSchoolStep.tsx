"use client";

import { useState } from "react";
import type { College } from "@/types";
import { allColleges } from "@/lib/college-data";

export default function DreamSchoolStep({
  selected,
  onSelect,
  onNext,
  onSkip,
}: {
  selected: string[];
  onSelect: (schools: string[]) => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  const [query, setQuery] = useState("");
  const colleges: College[] = allColleges;

  const filtered = query
    ? colleges.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const toggleSchool = (name: string) => {
    if (selected.includes(name)) {
      onSelect(selected.filter((s) => s !== name));
    } else {
      onSelect([...selected, name]);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
        What&apos;s your dream school?
      </h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Search for colleges you&apos;re interested in
      </p>

      <div className="w-full max-w-md">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search colleges..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>

        {query && (
          <div className="mt-2 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            {filtered.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">No colleges found</p>
            ) : (
              filtered.slice(0, 10).map((college) => (
                <button
                  key={college.id}
                  onClick={() => toggleSchool(college.name)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    selected.includes(college.name)
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : ""
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                      selected.includes(college.name)
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {selected.includes(college.name) && (
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {college.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {college.city}, {college.state}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {selected.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            >
              {name}
              <button
                onClick={() => toggleSchool(name)}
                className="ml-1 hover:text-blue-900 dark:hover:text-blue-100"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          onClick={onSkip}
          className="rounded-lg px-6 py-3 font-medium text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Skip
        </button>
        <button
          onClick={onNext}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
