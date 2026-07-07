"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { getCollegeById, toSummary } from "@/lib/api";
import {
  formatCurrency,
  formatPercent,
  formatNumber,
  formatSAT,
  formatACT,
} from "@/lib/utils";

function CompareContent() {
  const searchParams = useSearchParams();
  const ids = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];
  const colleges = ids
    .map((id) => getCollegeById(id))
    .filter((c): c is NonNullable<typeof c> => c != null)
    .map(toSummary);

  const fullColleges = ids
    .map((id) => getCollegeById(id))
    .filter((c): c is NonNullable<typeof c> => c != null);

  if (colleges.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="text-4xl">📋</div>
        <h1 className="mt-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
          No colleges to compare
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Select colleges from the browse page to compare them here.
        </p>
        <Link
          href="/colleges"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          Browse Colleges →
        </Link>
      </div>
    );
  }

  type RowDef = {
    label: string;
    value: (c: (typeof fullColleges)[number]) => string;
  };

  const rows: RowDef[] = [
    { label: "Type", value: (c) => (c.type === "public" ? "Public" : "Private") },
    { label: "Location", value: (c) => `${c.city}, ${c.state}` },
    { label: "Locale", value: (c) => c.locale.charAt(0).toUpperCase() + c.locale.slice(1) },
    { label: "Size", value: (c) => c.size.replace("-", " ") },
    { label: "Acceptance Rate", value: (c) => formatPercent(c.acceptanceRate) },
    { label: "SAT Range", value: (c) => formatSAT({ math25th: c.satMath25th, math75th: c.satMath75th, reading25th: c.satReading25th, reading75th: c.satReading75th }) },
    { label: "ACT Range", value: (c) => formatACT(c.actComposite25th, c.actComposite75th) },
    { label: "In-State Tuition", value: (c) => formatCurrency(c.tuitionInState) },
    { label: "Out-of-State Tuition", value: (c) => formatCurrency(c.tuitionOutOfState) },
    { label: "Avg Net Price", value: (c) => formatCurrency(c.avgNetPrice) },
    { label: "Room & Board", value: (c) => formatCurrency(c.roomBoardOnCampus) },
    { label: "Graduation Rate (4yr)", value: (c) => formatPercent(c.graduationRate4yr) },
    { label: "Graduation Rate (6yr)", value: (c) => formatPercent(c.graduationRate6yr) },
    { label: "Retention Rate", value: (c) => formatPercent(c.retentionRate) },
    { label: "Enrollment", value: (c) => formatNumber(c.totalEnrollment) },
    { label: "Median Earnings (10yr)", value: (c) => formatCurrency(c.medianEarnings10yr) },
    { label: "Pct Receiving Grants", value: (c) => formatPercent(c.pctReceivingGrants) },
    { label: "Avg Grant Aid", value: (c) => formatCurrency(c.avgGrantAid) },
    { label: "Programs", value: (c) => c.programs.join(", ") },
    { label: "Test Policy", value: (c) => {
      const map: Record<string, string> = {
        required: "Required",
        optional: "Optional",
        recommended: "Recommended",
        "considered-if-submitted": "Considered if Submitted",
        "not-considered": "Not Considered",
        "test-flexible": "Test Flexible",
      };
      return map[c.standardizedTestPolicy] ?? c.standardizedTestPolicy;
    } },
    { label: "Common App", value: (c) => c.commonApplicationAccepted ? "Yes" : "No" },
    { label: "Application Fee", value: (c) => formatCurrency(c.applicationFee) },
    { label: "Deadline", value: (c) => c.applicationDeadline },
    { label: "Early Action", value: (c) => c.earlyActionDeadline || "N/A" },
    { label: "Early Decision", value: (c) => c.earlyDecisionDeadline || "N/A" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/colleges"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to colleges
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          College Comparison
        </h1>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <th className="sticky left-0 min-w-[180px] bg-gray-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                Metric
              </th>
              {fullColleges.map((c) => (
                <th
                  key={c.id}
                  className="min-w-[160px] px-4 py-3 text-center"
                >
                  <div className="flex flex-col items-center gap-1">
                    <img
                      src={`https://logos.hunter.io/${c.website.replace(/^https?:\/\/(www\.)?/, "")}`}
                      alt={c.name}
                      className="h-6 w-6 object-contain"
                    />
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {c.name}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {rows.map((row) => (
              <tr key={row.label} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="sticky left-0 bg-white px-4 py-2.5 text-xs font-medium text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                  {row.label}
                </td>
                {fullColleges.map((c) => {
                  const val = row.value(c);
                  const isNum = /^[\d,%.$]/.test(val);
                  return (
                    <td
                      key={c.id}
                      className={`px-4 py-2.5 text-center text-sm ${
                        isNum ? "font-semibold text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
