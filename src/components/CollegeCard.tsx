"use client";

import Link from "next/link";
import type { CollegeSummary } from "@/types";
import {
  formatCurrency,
  formatPercent,
  formatNumber,
  acceptanceRateColor,
  graduationRateColor,
  getCollegeInitialsLogo,
} from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";
import { useCompare } from "@/hooks/useCompare";
import { MAX_COMPARE } from "@/hooks/useCompare";

interface CollegeCardProps {
  college: CollegeSummary;
}

export default function CollegeCard({ college }: CollegeCardProps) {
  const { isFavorite, toggle } = useFavorites();
  const { isCompare, toggleCompare, canAdd } = useCompare();
  const saved = isFavorite(college.id);
  const comparing = isCompare(college.id);

  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600 dark:hover:shadow-lg dark:hover:shadow-blue-900/10">
      <Link href={`/colleges/${college.id}`} className="block">
      {/* Brand color accent bar */}
      <div
        className="h-1.5 rounded-t-xl"
        style={{ backgroundColor: college.primaryColor }}
      />

      <div className="p-5 pt-4">
        {/* Header with logo + badges + favorite */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <img
                src={college.logoUrl}
                alt={`${college.name} logo`}
                className="h-8 w-8 object-contain"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = getCollegeInitialsLogo(college.name, college.primaryColor);
                }}
              />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors dark:text-gray-100 dark:group-hover:text-blue-400">
                {college.name}
              </h3>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                {college.city}, {college.state}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Favorite button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                toggle(college.id);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={saved ? "Remove from favorites" : "Add to favorites"}
            >
              {saved ? "★" : "☆"}
            </button>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                college.type === "public"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                  : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
              }`}
            >
              {college.type === "public" ? "Public" : "Private"}
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Acceptance</span>
            <p
              className={`font-semibold ${acceptanceRateColor(college.acceptanceRate)}`}
            >
              {formatPercent(college.acceptanceRate)}
            </p>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">In-State Tuition</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(college.tuitionInState)}
            </p>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Graduation (4yr)</span>
            <p
              className={`font-semibold ${graduationRateColor(college.graduationRate4yr)}`}
            >
              {formatPercent(college.graduationRate4yr)}
            </p>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Enrollment</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {formatNumber(college.totalEnrollment)}
            </p>
          </div>
        </div>

        {/* Compare toggle */}
        <div className="mt-3 flex items-center gap-2">
          <label
            className="flex cursor-pointer items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={comparing}
              onChange={() => toggleCompare(college.id)}
              disabled={!comparing && !canAdd}
              className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-40"
            />
            Compare
          </label>
        </div>

        {/* Program tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {college.programs.slice(0, 3).map((program) => (
            <span
              key={program}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            >
              {program}
            </span>
          ))}
          {college.programs.length > 3 && (
            <span className="text-[11px] text-gray-400 dark:text-gray-500">
              +{college.programs.length - 3}
            </span>
          )}
        </div>

        <div className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-400 dark:border-gray-700 dark:text-gray-500">
          Median earnings 10yr: {formatCurrency(college.medianEarnings10yr)}
        </div>
      </div>
    </Link>
    </div>
  );
}
