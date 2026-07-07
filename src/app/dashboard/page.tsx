"use client";

import GreetingBanner from "@/components/dashboard/GreetingBanner";
import NextPriority from "@/components/dashboard/NextPriority";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import SuggestedOpportunities from "@/components/dashboard/SuggestedOpportunities";
import TodayGoal from "@/components/dashboard/TodayGoal";
import ReadinessScore from "@/components/dashboard/ReadinessScore";
import ProgressRadar from "@/components/dashboard/ProgressRadar";
import MilestoneTracker from "@/components/dashboard/MilestoneTracker";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Greeting */}
      <div className="mb-6">
        <GreetingBanner />
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: priorities */}
        <div className="space-y-6 lg:col-span-2">
          <NextPriority />
          <SuggestedOpportunities />
        </div>

        {/* Right column: progress + events */}
        <div className="space-y-6">
          <ReadinessScore />
          <UpcomingEvents />
          <TodayGoal />
        </div>
      </div>

      {/* Progress radar + milestones */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ProgressRadar />
        <MilestoneTracker />
      </div>

      {/* Quick links */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Quick Links
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickLink
            href="/colleges"
            emoji="🏛️"
            title="College Explorer"
            desc="Search and compare universities"
          />
          <QuickLink
            href="/financial"
            emoji="💰"
            title="Financial Aid"
            desc="Grants, loans, scholarships"
          />
          <QuickLink
            href="/tracker"
            emoji="📊"
            title="Application Tracker"
            desc="Track deadlines and statuses"
          />
          <QuickLink
            href="/degrees"
            emoji="🎓"
            title="Degree Planner"
            desc="Plan your academic path"
          />
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  emoji,
  title,
  desc,
}: {
  href: string;
  emoji: string;
  title: string;
  desc: string;
}) {
  return (
    <a
      href={href}
      className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="mb-2 text-2xl">{emoji}</div>
      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors dark:text-gray-100 dark:group-hover:text-blue-400">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>
    </a>
  );
}
