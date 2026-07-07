import type { Metadata } from "next";
import Link from "next/link";
import { getDegreesOverview } from "@/lib/api";
import { getAllPrograms } from "@/lib/degree-data";

export const metadata: Metadata = {
  title: "College Degree Programs — CollegeHub",
  description:
    "Browse degree programs offered across all US colleges. Search by program type — computer science, engineering, nursing, business, and more.",
  alternates: { canonical: "/degrees" },
  openGraph: {
    title: "College Degree Programs — CollegeHub",
    description:
      "Browse degree programs offered across all US colleges. Search by program type and find the best school for your major.",
  },
};

export default function DegreesPage() {
  const overview = getDegreesOverview();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-100">
          Degrees &amp; Programs
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Explore programs offered across featured colleges
        </p>
      </div>

      {/* Program grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {overview.map((entry) => (
          <div
            key={entry.program}
            className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {entry.program}
              </h2>
              <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                {entry.collegeIds.length}
              </span>
            </div>
            <ul className="space-y-1">
              {entry.collegeIds.map((college) => (
                <li key={college.id}>
                  <Link
                    href={`/colleges/${college.id}/degrees/${encodeURIComponent(
                      entry.program.toLowerCase().replace(/\s+/g, "-")
                    )}`}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    {college.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs text-gray-400 dark:text-gray-500">
        Program data compiled from publicly available academic catalogs and institutional reports. Always verify degree requirements with each college&apos;s official catalog.
      </p>
    </div>
  );
}
