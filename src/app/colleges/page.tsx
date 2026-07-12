import { Suspense } from "react";
import type { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import CollegeCard from "@/components/CollegeCard";
import Pagination from "@/components/Pagination";
import CsvExportButton from "@/components/CsvExportButton";
import { searchColleges } from "@/lib/api";
import { formatNumber } from "@/lib/utils";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const parts: string[] = [];

  if (params.query) {
    parts.push(`matching "${params.query}"`);
  }
  if (params.state) {
    parts.push(`in ${params.state}`);
  }
  if (params.type) {
    parts.push(params.type === "public" ? "Public" : "Private");
  }
  if (params.size) {
    const sizeLabels: Record<string, string> = {
      small: "Small",
      medium: "Medium",
      large: "Large",
      "very-large": "Very Large",
    };
    parts.push(sizeLabels[params.size] ?? "");
  }
  if (params.program) {
    parts.push(`with ${params.program}`);
  }

  const titleSuffix = parts.length > 0 ? ` — ${parts.join(", ")}` : "";
  const filterDesc =
    parts.length > 0 ? ` ${parts.join(", ").toLowerCase()}.` : ".";
  return {
    title: `Colleges${titleSuffix} — CollegeHub`,
    description: `Browse and compare universities${filterDesc} Filter by type, location, size, and more.`,
    alternates: { canonical: "/colleges" },
  };
}

export default async function CollegesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const { colleges, total, page, totalPages } = searchColleges({
    query: params.query,
    state: params.state,
    type: params.type as never,
    locale: params.locale as never,
    size: params.size as never,
    program: params.program,
    sortBy: params.sortBy as never,
    sortOrder: params.sortOrder as never,
    page: params.page ? Number(params.page) : 1,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Colleges & Universities
          </h1>
          <h2 className="text-lg font-italic text-gray-900 dark:text-gray-100">
            Select up to five to compare
          </h2>
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
        <CsvExportButton />
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

      {/* Data source citation */}
      <div className="mt-12 border-t border-gray-200 pt-6 dark:border-gray-700">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          College data sourced from{" "}
          <a
            href="https://collegescorecard.ed.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600 dark:hover:text-gray-300"
          >
            College Scorecard
          </a>{" "}
          (U.S. Department of Education). Acceptance rates, tuition, graduation rates, and enrollment figures are reported by institutions and may not be available for all schools. Data reflects the most recent reporting period.
        </p>
      </div>
    </div>
  );
}
