import Link from "next/link";
import type { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import StatsCard from "@/components/StatsCard";
import CollegeCard from "@/components/CollegeCard";
import OnboardingGate from "@/components/OnboardingGate";
import { getFeaturedColleges, getStatewideStats } from "@/lib/api";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CollegeHub — Your Free College Planning Tool",
    description:
      "Compare universities, explore financial aid, find your best-fit college with our match quiz, and plan your future — all free.",
  },
};

export default function HomePage() {
  const featured = getFeaturedColleges();
  const stats = getStatewideStats();

  return (
    <OnboardingGate>
    <div>
      {/* ─── Hero ─────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Your College Hub
            </h1>
            <p className="mt-4 text-lg text-blue-100 sm:text-xl">
              Compare universities, explore financial aid, and find everything
              you need for college — all in one place.
            </p>
            <div className="mt-8">
              <SearchBar large />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-blue-200">
              <Link
                href="/colleges?type=public"
                className="rounded-full bg-white/10 px-4 py-2 backdrop-blur hover:bg-white/20 transition"
              >
                🏛️ Public Universities
              </Link>
              <Link
                href="/colleges?type=private"
                className="rounded-full bg-white/10 px-4 py-2 backdrop-blur hover:bg-white/20 transition"
              >
                🎓 Private Universities
              </Link>
              <Link
                href="/financial"
                className="rounded-full bg-white/10 px-4 py-2 backdrop-blur hover:bg-white/20 transition"
              >
                💰 Financial Aid
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Overview ─────────────────────────── */}
      <section className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <StatsCard
              title="Colleges"
              value={formatNumber(stats.totalColleges)}
              subtitle={`${stats.publicColleges} public · ${stats.privateColleges} private`}
              color="blue"
            />
            <StatsCard
              title="Avg In-State Tuition"
              value={formatCurrency(stats.avgInStateTuition)}
              subtitle="Per year"
              color="green"
            />
            <StatsCard
              title="Avg Acceptance Rate"
              value={formatPercent(stats.avgAcceptanceRate)}
              subtitle="Across all listed"
              color="purple"
            />
            <StatsCard
              title="Avg Graduation Rate"
              value={formatPercent(stats.avgGraduationRate6yr)}
              subtitle="Within 6 years"
              color="orange"
            />
            <StatsCard
              title="Avg Net Price"
              value={formatCurrency(stats.avgNetPrice)}
              subtitle="After financial aid"
              color="blue"
            />
            <StatsCard
              title="Total Students"
              value={formatNumber(stats.totalStudents)}
              subtitle="Across all listed"
              color="green"
            />
          </div>
        </div>
      </section>

      {/* ─── Featured Colleges ───────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
              Featured Universities
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Explore top public and private institutions
            </p>
          </div>
          <Link
            href="/colleges"
            className="hidden rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition sm:inline-block dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            View All →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/colleges"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            View All Colleges →
          </Link>
        </div>
      </section>

      {/* ─── Quick Links ─────────────────────────────── */}
      <section className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
            Everything You Need
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <Link
              href="/colleges"
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
            >
              <div className="mb-3 text-3xl">🏛️</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors dark:text-gray-100 dark:group-hover:text-blue-400">
                College Explorer
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Search and compare universities by stats, cost, size, and
                more.
              </p>
            </Link>

            <Link
              href="/financial"
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
            >
              <div className="mb-3 text-3xl">💰</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors dark:text-gray-100 dark:group-hover:text-blue-400">
                Financial Aid Hub
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Explore grants, loans, and scholarships to fund your education.
              </p>
            </Link>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-3 text-3xl">📊</div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Coming Soon
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Application tracking, deadline calendars, essay guides, and more
                tools.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </OnboardingGate>
  );
}
