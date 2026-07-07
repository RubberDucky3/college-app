"use client";

import Link from "next/link";
import CollegeCard from "@/components/CollegeCard";
import { useFavorites } from "@/hooks/useFavorites";
import { getCollegeById, toSummary } from "@/lib/api";

export default function SavedPage() {
  const { favorites, hydrated } = useFavorites();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse text-center text-gray-400">Loading...</div>
      </div>
    );
  }

  const colleges = favorites
    .map((id) => getCollegeById(id))
    .filter((c): c is NonNullable<typeof c> => c != null)
    .map(toSummary);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Saved Colleges
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          {favorites.length === 0
            ? "You haven't saved any colleges yet."
            : `${favorites.length} college${favorites.length !== 1 ? "s" : ""} saved`}
        </p>
      </div>

      {colleges.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
          <div className="text-4xl">⭐</div>
          <h2 className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
            No saved colleges
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Browse colleges and tap the star icon to save them here.
          </p>
          <Link
            href="/colleges"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            Browse Colleges →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {colleges.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      )}
    </div>
  );
}
