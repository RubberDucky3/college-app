"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

interface SearchBarProps {
  initialQuery?: string;
  large?: boolean;
}

export default function SearchBar({
  initialQuery = "",
  large = false,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/colleges?query=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/colleges");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg
            className={`${large ? "h-6 w-6" : "h-5 w-5"} text-gray-400 dark:text-gray-500`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search colleges by name or city..."
          className={`w-full rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-800 ${
            large
              ? "py-4 pl-12 pr-6 text-lg"
              : "py-2.5 pl-11 pr-4 text-sm"
          }`}
        />
      </div>
    </form>
  );
}
