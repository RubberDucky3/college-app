"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { nationalUniversities } from "@/lib/national-data";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";

type SortKey = "roi" | "cost" | "earnings" | "name";

export default function ROIPage() {
  const { favorites } = useFavorites();
  const [view, setView] = useState<"all" | "saved">("all");
  const [sortBy, setSortBy] = useState<SortKey>("roi");
  const [sortAsc, setSortAsc] = useState(false);

  const colleges = useMemo(() => {
    const list =
      view === "saved"
        ? nationalUniversities.filter((c) => favorites.includes(c.id))
        : [...nationalUniversities];

    return list.sort((a, b) => {
      const getVal = (c: (typeof list)[number]) => {
        const cost4yr = (c.tuitionInState + c.feesInState + c.roomBoardOnCampus) * 4;
        switch (sortBy) {
          case "roi": return (c.medianEarnings10yr * 4) / cost4yr;
          case "cost": return cost4yr;
          case "earnings": return c.medianEarnings10yr;
          case "name": return 0;
        }
      };
      const av = getVal(a);
      const bv = getVal(b);
      if (sortBy === "name") return sortAsc ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
      return sortAsc ? av - bv : bv - av;
    });
  }, [view, favorites, sortBy, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortAsc(!sortAsc);
    else { setSortBy(key); setSortAsc(false); }
  };

  // For the chart, use top 20
  const chartData = useMemo(() => colleges.slice(0, 20), [colleges]);

  const maxVal = useMemo(() => {
    let m = 0;
    for (const c of chartData) {
      const cost4yr = (c.tuitionInState + c.feesInState + c.roomBoardOnCampus) * 4;
      m = Math.max(m, c.medianEarnings10yr, cost4yr);
    }
    return m;
  }, [chartData]);

  const CHART_HEIGHT = 380;
  const BAR_WIDTH = 28;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/colleges" className="text-sm text-blue-600 hover:underline">
        ← Back to colleges
      </Link>
      <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
        Return on Investment
      </h1>
      <p className="mt-1 text-gray-600 dark:text-gray-400">
        Compare 4-year costs against median earnings 10 years after enrollment.
      </p>

      {/* Controls */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        {/* View toggle */}
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setView("all")}
            className={`px-3 py-1.5 text-sm font-medium ${
              view === "all"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            } rounded-l-lg transition-colors`}
          >
            All Colleges
          </button>
          <button
            onClick={() => setView("saved")}
            className={`px-3 py-1.5 text-sm font-medium ${
              view === "saved"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            } rounded-r-lg transition-colors`}
          >
            Saved Only
          </button>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Sort by:</span>
          {(["roi", "cost", "earnings", "name"] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => toggleSort(key)}
              className={`rounded px-2 py-1 font-medium transition-colors ${
                sortBy === key
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {key === "roi" && "ROI"}
              {key === "cost" && "Cost"}
              {key === "earnings" && "Earnings"}
              {key === "name" && "Name"}
              {sortBy === key ? (sortAsc ? " ↑" : " ↓") : ""}
            </button>
          ))}
        </div>
      </div>

      {view === "saved" && favorites.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
          <p className="text-gray-500 dark:text-gray-400">
            No saved colleges yet. Save some to see their ROI comparison.
          </p>
          <Link
            href="/colleges"
            className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            Browse and save colleges →
          </Link>
        </div>
      ) : (
        <>
          {/* Chart */}
          <div className="mt-8 overflow-x-auto rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Cost vs. Earnings (Top {chartData.length})
            </h2>

            <svg
              viewBox={`0 0 ${Math.max(chartData.length * (BAR_WIDTH + 12) + 80, 600)} ${CHART_HEIGHT + 60}`}
              className="w-full"
              style={{ minHeight: 300 }}
            >
              {/* Y-axis labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
                const y = CHART_HEIGHT - frac * (CHART_HEIGHT - 40);
                const val = Math.round(maxVal * frac);
                return (
                  <g key={frac}>
                    <text x="0" y={y + 4} className="text-[10px] fill-gray-400" textAnchor="start">
                      ${(val / 1000).toFixed(0)}k
                    </text>
                    <line
                      x1="50"
                      y1={y}
                      x2={chartData.length * (BAR_WIDTH + 12) + 70}
                      y2={y}
                      className="stroke-gray-100 dark:stroke-gray-700"
                      strokeWidth="1"
                    />
                  </g>
                );
              })}

              {/* Bars */}
              {chartData.map((college, i) => {
                const x = 60 + i * (BAR_WIDTH + 12);
                const cost4yr = (college.tuitionInState + college.feesInState + college.roomBoardOnCampus) * 4;
                const costH = (cost4yr / maxVal) * (CHART_HEIGHT - 40);
                const earnH = (college.medianEarnings10yr / maxVal) * (CHART_HEIGHT - 40);
                const costY = CHART_HEIGHT - costH;
                const earnY = CHART_HEIGHT - earnH;

                return (
                  <g key={college.id}>
                    {/* Cost bar */}
                    <rect
                      x={x}
                      y={costY}
                      width={BAR_WIDTH / 2 - 1}
                      height={costH}
                      fill="#ef4444"
                      rx="2"
                      opacity={0.85}
                    />
                    {/* Earnings bar */}
                    <rect
                      x={x + BAR_WIDTH / 2 + 1}
                      y={earnY}
                      width={BAR_WIDTH / 2 - 1}
                      height={earnH}
                      fill="#22c55e"
                      rx="2"
                      opacity={0.85}
                    />
                    {/* Label */}
                    <text
                      x={x + BAR_WIDTH / 2}
                      y={CHART_HEIGHT + 14}
                      textAnchor="end"
                      transform={`rotate(-45, ${x + BAR_WIDTH / 2}, ${CHART_HEIGHT + 14})`}
                      className="text-[9px] fill-gray-500 dark:fill-gray-400"
                    >
                      {college.name.split(" ").slice(0, 2).join(" ")}
                    </text>
                  </g>
                );
              })}

              {/* Legend */}
              <g transform={`translate(${chartData.length * (BAR_WIDTH + 12) + 30}, 10)`}>
                <rect x="0" y="0" width="12" height="12" fill="#ef4444" rx="2" opacity={0.85} />
                <text x="18" y="10" className="text-[11px] fill-gray-600 dark:fill-gray-300">
                  4-Year Cost
                </text>
                <rect x="0" y="20" width="12" height="12" fill="#22c55e" rx="2" opacity={0.85} />
                <text x="18" y="30" className="text-[11px] fill-gray-600 dark:fill-gray-300">
                  Median Earnings (10yr)
                </text>
              </g>
            </svg>
          </div>

          {/* Table */}
          <div className="mt-8 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    College
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    4-Year Cost
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Median Earnings (10yr)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    ROI Multiple
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Payback Period
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {colleges.map((college) => {
                  const cost4yr =
                    (college.tuitionInState +
                      college.feesInState +
                      college.roomBoardOnCampus) * 4;
                  const roiMultiple = college.medianEarnings10yr / (cost4yr / 4);
                  const paybackYears = cost4yr / college.medianEarnings10yr;

                  return (
                    <tr
                      key={college.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-4 py-2.5">
                        <Link
                          href={`/colleges/${college.id}`}
                          className="font-semibold text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
                        >
                          {college.name}
                        </Link>
                        <span className="ml-2 text-xs text-gray-400">
                          {college.city}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(cost4yr)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(college.medianEarnings10yr)}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            roiMultiple >= 4
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                              : roiMultiple >= 2.5
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                : roiMultiple >= 1.5
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                          }`}
                        >
                          {roiMultiple.toFixed(1)}×
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right text-gray-700 dark:text-gray-300">
                        {paybackYears < 1
                          ? "< 1 year"
                          : `${paybackYears.toFixed(1)} years`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong className="text-gray-900 dark:text-gray-100">
                {colleges.length}
              </strong>{" "}
              college{colleges.length !== 1 ? "s" : ""} shown. ROI multiple =
              annual earnings ÷ annual cost. Payback period = total 4-year cost
              ÷ annual earnings (simplified, before taxes).
            </p>
          </div>
        </>
      )}
    </div>
  );
}
