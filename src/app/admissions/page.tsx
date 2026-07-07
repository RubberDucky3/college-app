"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { nationalUniversities } from "@/lib/national-data";
import { formatPercent, formatNumber } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";

function Gauge({
  value,
  maxValue = 100,
  label,
  color,
  size = "md",
}: {
  value: number;
  maxValue?: number;
  label: string;
  color: string;
  size?: "sm" | "md";
}) {
  const pct = Math.min((value / maxValue) * 100, 100);
  const circumference = size === "sm" ? 2 * Math.PI * 28 : 2 * Math.PI * 40;
  const offset = circumference - (pct / 100) * circumference;
  const r = size === "sm" ? 28 : 40;
  const strokeW = size === "sm" ? 5 : 6;
  const viewBox = size === "sm" ? "0 0 72 72" : "0 0 96 96";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox={viewBox} className={size === "sm" ? "h-16 w-16" : "h-24 w-24"}>
        {/* Background circle */}
        <circle
          cx={size === "sm" ? 36 : 48}
          cy={size === "sm" ? 36 : 48}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeW}
          className="text-gray-100 dark:text-gray-700"
        />
        {/* Value arc */}
        <circle
          cx={size === "sm" ? 36 : 48}
          cy={size === "sm" ? 36 : 48}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeW}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size === "sm" ? 36 : 48} ${size === "sm" ? 36 : 48})`}
          className="transition-all duration-700"
        />
        {/* Center text */}
        <text
          x={size === "sm" ? 36 : 48}
          y={size === "sm" ? 36 : 48}
          textAnchor="middle"
          dominantBaseline="central"
          className={`${size === "sm" ? "text-[10px]" : "text-sm"} font-bold fill-gray-900 dark:fill-gray-100`}
        >
          {maxValue === 100 ? `${Math.round(value)}%` : formatNumber(Math.round(value))}
        </text>
      </svg>
      <span className={`${size === "sm" ? "text-[10px]" : "text-xs"} text-gray-500 dark:text-gray-400 text-center leading-tight`}>
        {label}
      </span>
    </div>
  );
}

function SelectivityBadge({ rate }: { rate: number }) {
  if (rate < 15)
    return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">Most Selective</span>;
  if (rate < 30)
    return <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">Highly Selective</span>;
  if (rate < 50)
    return <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">Moderately Selective</span>;
  if (rate < 75)
    return <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Less Selective</span>;
  return <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">Open Admission</span>;
}

function SATGauge({ math25, math75, read25, read75 }: { math25: number; math75: number; read25: number; read75: number }) {
  const total25 = math25 + read25;
  const total75 = math75 + read75;
  const mid30 = Math.round((total25 + total75) / 2);

  let color = "#22c55e";
  if (mid30 >= 1300) color = "#ef4444";
  else if (mid30 >= 1100) color = "#f59e0b";
  else if (mid30 >= 900) color = "#3b82f6";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 160 80" className="h-20 w-40">
        {/* Track */}
        <path
          d="M 10 70 A 60 60 0 0 1 150 70"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="text-gray-100 dark:text-gray-700"
        />
        {/* Active arc (scaled by mid30) */}
        <path
          d="M 10 70 A 60 60 0 0 1 150 70"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${((mid30 - 400) / 1200) * 220} 220`}
          className="transition-all duration-700"
        />
        {/* Midpoint marker */}
        <text x="80" y="34" textAnchor="middle" className="text-lg font-bold fill-gray-900 dark:fill-gray-100">
          {total25}-{total75}
        </text>
        <text x="80" y="50" textAnchor="middle" className="text-[9px] fill-gray-400">
          SAT Range (25th-75th)
        </text>
      </svg>
    </div>
  );
}

export default function AdmissionsPage() {
  const { favorites } = useFavorites();
  const [view, setView] = useState<"all" | "saved">("all");
  const [sortBy, setSortBy] = useState<"rate" | "sat" | "name">("rate");

  const colleges = useMemo(() => {
    let list = view === "saved"
      ? nationalUniversities.filter((c) => favorites.includes(c.id))
      : [...nationalUniversities];

    list.sort((a, b) => {
      if (sortBy === "rate") return a.acceptanceRate - b.acceptanceRate;
      if (sortBy === "sat")
        return (b.satMath75th + b.satReading75th) - (a.satMath75th + a.satReading75th);
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [view, favorites, sortBy]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/colleges" className="text-sm text-blue-600 hover:underline">
        ← Back to colleges
      </Link>
      <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
        Admissions Difficulty
      </h1>
      <p className="mt-1 text-gray-600 dark:text-gray-400">
        Compare acceptance rates, test scores, and selectivity across colleges.
      </p>

      {/* Controls */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
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
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Sort:</span>
          {(["rate", "sat", "name"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`rounded px-2 py-1 font-medium transition-colors ${
                sortBy === key
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {key === "rate" ? "Acceptance Rate" : key === "sat" ? "SAT Score" : "Name"}
            </button>
          ))}
        </div>
      </div>

      {view === "saved" && favorites.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
          <p className="text-gray-500 dark:text-gray-400">No saved colleges yet.</p>
          <Link href="/colleges" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline">
            Browse and save colleges →
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {colleges.map((college) => {
            const color =
              college.acceptanceRate < 20
                ? "#ef4444"
                : college.acceptanceRate < 40
                  ? "#f59e0b"
                  : college.acceptanceRate < 65
                    ? "#3b82f6"
                    : "#22c55e";

            return (
              <div
                key={college.id}
                className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="flex flex-wrap items-center gap-4">
                  {/* Logo + Name */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={`https://logos.hunter.io/${college.website.replace(/^https?:\/\/(www\.)?/, "")}`}
                      alt={college.name}
                      className="h-10 w-10 flex-shrink-0 rounded object-contain"
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/colleges/${college.id}`}
                        className="text-sm font-semibold text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400 truncate block"
                      >
                        {college.name}
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {college.city}, {college.type}
                      </p>
                    </div>
                    <SelectivityBadge rate={college.acceptanceRate} />
                  </div>

                  {/* Gauges */}
                  <div className="flex items-center gap-6">
                    <Gauge value={college.acceptanceRate} label="Acceptance Rate" color={color} />
                    <Gauge
                      value={college.satMath75th + college.satReading75th}
                      maxValue={1600}
                      label="Top SAT"
                      color={college.satMath75th + college.satReading75th >= 1300 ? "#ef4444" : "#3b82f6"}
                      size="sm"
                    />
                    <div className="hidden sm:block">
                      <Gauge
                        value={college.retentionRate}
                        label="Retention Rate"
                        color={college.retentionRate >= 80 ? "#22c55e" : "#f59e0b"}
                        size="sm"
                      />
                    </div>
                    <div className="hidden md:block">
                      <Gauge
                        value={college.pctReceivingGrants}
                        label="Get Grants"
                        color={college.pctReceivingGrants >= 70 ? "#22c55e" : "#3b82f6"}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>

                {/* SAT arc gauge (collapsible on small screens) */}
                <div className="mt-3 hidden sm:flex justify-center">
                  <SATGauge
                    math25={college.satMath25th}
                    math75={college.satMath75th}
                    read25={college.satReading25th}
                    read75={college.satReading75th}
                  />
                </div>
              </div>
            );
          })}

          {/* Summary */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong className="text-gray-900 dark:text-gray-100">{colleges.length}</strong> college{colleges.length !== 1 ? "s" : ""} · 
              Avg acceptance rate: <strong className="text-gray-900 dark:text-gray-100">
                {formatPercent(Math.round(colleges.reduce((s, c) => s + c.acceptanceRate, 0) / colleges.length))}
              </strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
