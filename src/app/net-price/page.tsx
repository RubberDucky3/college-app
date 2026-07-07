"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getCollegeById, toSummary } from "@/lib/api";
import { formatCurrency, getCollegeInitialsLogo } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";

const INCOME_BRACKETS = [
  { label: "Under $30,000", min: 0, max: 30000, multiplier: 0.65 },
  { label: "$30,000 – $48,000", min: 30000, max: 48000, multiplier: 0.8 },
  { label: "$48,000 – $75,000", min: 48000, max: 75000, multiplier: 0.95 },
  { label: "$75,000 – $110,000", min: 75000, max: 110000, multiplier: 1.1 },
  { label: "Over $110,000", min: 110000, max: Infinity, multiplier: 1.25 },
];

function estimateNetPrice(
  avgNetPrice: number,
  income: number,
  pellEligible: boolean
): number {
  const bracket = INCOME_BRACKETS.find(
    (b) => income >= b.min && income < b.max
  ) ?? INCOME_BRACKETS[INCOME_BRACKETS.length - 1];

  let est = Math.round(avgNetPrice * bracket.multiplier);

  // Pell-eligible students get additional need-based aid
  if (pellEligible && income < 75000) {
    est = Math.round(est * 0.85);
  }

  // Cap at sticker price (tuitionInState + fees + roomBoard for in-state)
  // but for net price we're estimating out-of-pocket, so keep it reasonable
  return Math.max(est, 2000); // floor — everyone pays something
}

function incomeToSliderValue(income: number): number {
  // Map $0–$200k to slider 0–200
  return Math.min(Math.round(income / 1000), 200);
}

function sliderValueToIncome(slider: number): number {
  return slider * 1000;
}

export default function NetPriceCalculatorPage() {
  const { favorites } = useFavorites();
  const [income, setIncome] = useState(65000);
  const [pellEligible, setPellEligible] = useState(false);

  const savedColleges = useMemo(
    () =>
      favorites
        .map((id) => {
          const c = getCollegeById(id);
          return c ? toSummary(c) : null;
        })
        .filter((c): c is NonNullable<typeof c> => c != null),
    [favorites]
  );

  const currentBracket = INCOME_BRACKETS.find(
    (b) => income >= b.min && income < b.max
  ) ?? INCOME_BRACKETS[INCOME_BRACKETS.length - 1];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/colleges"
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to colleges
      </Link>
      <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
        Net Price Calculator
      </h1>
      <p className="mt-1 text-gray-600 dark:text-gray-400">
        Estimate your out-of-pocket cost at each college based on family
        income and financial aid eligibility.
      </p>

      {/* Calculator Controls */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Your Financial Profile
        </h2>

        {/* Income Slider */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Estimated Family Income
          </label>
          <div className="mt-2 flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={incomeToSliderValue(income)}
              onChange={(e) => setIncome(sliderValueToIncome(Number(e.target.value)))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600 dark:bg-gray-600"
            />
            <span className="min-w-[120px] text-right text-lg font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(income)}
            </span>
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-400">
            <span>$0</span>
            <span>$50k</span>
            <span>$100k</span>
            <span>$150k</span>
            <span>$200k+</span>
          </div>
        </div>

        {/* Pell Eligibility Toggle */}
        <div className="mt-6">
          <label className="inline-flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={pellEligible}
              onChange={(e) => setPellEligible(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              I may be eligible for Pell Grants (typically family income under $50k)
            </span>
          </label>
        </div>

        {/* Active bracket info */}
        <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
          Income bracket: <strong>{currentBracket.label}</strong> →
          Estimated net price multiplier: <strong>×{currentBracket.multiplier}</strong>
          {pellEligible && income < 75000 && (
            <span className="ml-1">
              + <strong>Pell Grant discount</strong> (−15%)
            </span>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Estimated Net Price by College
        </h2>

        {savedColleges.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
            <p className="text-gray-500 dark:text-gray-400">
              No saved colleges yet.
            </p>
            <Link
              href="/colleges"
              className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              Browse and save colleges →
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {savedColleges.map((college) => {
              const estNetPrice = estimateNetPrice(
                college.avgNetPrice,
                income,
                pellEligible
              );
              const roiMultiple = college.medianEarnings10yr / estNetPrice;
              const isAffordable = estNetPrice < college.medianEarnings10yr * 0.6;

              return (
                <div
                  key={college.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={college.logoUrl}
                      alt={college.name}
                      className="h-8 w-8 flex-shrink-0 rounded object-contain"
                      onError={(e) => {
                        e.currentTarget.src = getCollegeInitialsLogo(college.name, college.primaryColor);
                      }}
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/colleges/${college.id}`}
                        className="text-sm font-semibold text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400 truncate block"
                      >
                        {college.name}
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Published avg net price: {formatCurrency(college.avgNetPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(estNetPrice)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      /year estimated
                    </span>
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`rounded-full px-2 py-0.5 font-medium ${
                          isAffordable
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                        }`}
                      >
                        {isAffordable
                          ? "Likely Affordable"
                          : "Stretch Budget"}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 font-medium ${
                          roiMultiple >= 3
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : roiMultiple >= 1.5
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                        }`}
                      >
                        {roiMultiple.toFixed(1)}× ROI
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Methodology */}
      <details className="mt-8 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
          How is this calculated?
        </summary>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Estimates are based on each college&apos;s published average net price
          (tuition + fees + room &amp; board − average grant/scholarship aid).
          The calculator adjusts this baseline by an income-based multiplier
          derived from national financial aid distribution patterns. Pell-eligible
          students under $75k income receive an additional 15% reduction.
          <strong> This is an estimate only</strong> — actual costs depend on
          your specific financial situation, merit scholarships, and the
          college&apos;s aid policies. Always file the FAFSA and check each
          college&apos;s net price calculator for a personalized estimate.
        </p>
      </details>
    </div>
  );
}
