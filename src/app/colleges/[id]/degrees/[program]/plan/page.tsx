import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCollegeById, getCollegePlan, getCollegeSourceUrl } from "@/lib/api";
import { slugToProgram } from "@/lib/slug-utils";
import PlannerClient from "./planner-client";

interface PageProps {
  params: Promise<{ id: string; program: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id, program: programSlug } = await params;
  const college = getCollegeById(id);
  if (!college) return { title: "Plan Not Found" };
  const programName = slugToProgram(programSlug, college.programs);
  if (!programName) return { title: "Plan Not Found" };
  return {
    title: `${programName} Degree Planner — ${college.name}`,
    description: `Interactive 4-year semester plan for the ${programName} program at ${college.name}.`,
  };
}

export default async function PlannerPage({ params }: PageProps) {
  const { id, program: programSlug } = await params;
  const college = getCollegeById(id);
  if (!college) notFound();

  const programName = slugToProgram(programSlug, college.programs);
  if (!programName) notFound();

  const plan = getCollegePlan(college.id, programName);
  if (!plan) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link
          href={`/colleges/${college.id}/degrees/${programSlug}`}
          className="hover:text-blue-600 transition-colors"
        >
          ← Back to {programName} at {college.name}
        </Link>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div
          className="mb-4 h-2 w-16 rounded-full"
          style={{ backgroundColor: college.primaryColor }}
        />
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-100">
          {programName} — Degree Planner
        </h1>
        <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">
          {college.name} · {plan.degree} · {plan.totalCredits} total credits
        </p>
      </div>

      <PlannerClient plan={plan} collegeId={college.id} />

      <p className="mt-8 text-xs text-gray-400 dark:text-gray-500">
        Semester plans are representative examples based on typical program curricula. Course availability varies by semester and institution. Always consult{" "}
        <a
          href={getCollegeSourceUrl(college)}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600 dark:hover:text-gray-300"
        >
          {college.name}&apos;s official catalog ↗
        </a>{" "}
        and advisor for degree planning.
      </p>
    </div>
  );
}
