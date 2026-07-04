import { Suspense } from "react";
import type { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import CollegeCard from "@/components/CollegeCard";
import Pagination from "@/components/Pagination";
import { searchColleges } from "@/lib/api";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Texas Colleges — CollegeHub",
  description:
    "Browse and compare Texas universities. Filter by type, location, size, and more.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function CollegesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const { colleges, total, page, totalPages } = searchColleges({
    query: params.query,
    type: params.type as never,
    locale: params.locale as never,
    size: params.size as never,
    sortBy: params.sortBy as never,
    sortOrder: params.sortOrder as never,
    page: params.page ? Number(params.page) : 1,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Texas Colleges & Universities
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          {formatNumber(total)} colleges found
          {params.query && (
            <span>
              {" "}
              for &ldquo;
              <span className="font-medium">{params.query}</span>
              &rdquo;
            </span>
          )}
        </p>
      </div>

      {/* Search + Filters */}
      <div className="mb-6 space-y-4">
        <Suspense fallback={null}>
          <SearchBar initialQuery={params.query || ""} />
          <FilterPanel />
        </Suspense>
      </div>

      {/* Results */}
      {colleges.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
          <div className="text-4xl">🔍</div>
          <h2 className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
            No colleges found
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {colleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>

          <div className="mt-8">
            <Pagination currentPage={page} totalPages={totalPages} />
          </div>
        </>
      )}
    </div>
  );
}
