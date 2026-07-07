import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCollegeById, getCollegeDegrees, getCollegeSourceUrl } from "@/lib/api";
import { slugToProgram } from "@/lib/slug-utils";

interface PageProps {
  params: Promise<{ id: string; program: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id, program: programSlug } = await params;
  const college = getCollegeById(id);
  if (!college) return { title: "Program Not Found" };
  const programName = slugToProgram(programSlug, college.programs);
  if (!programName) return { title: "Program Not Found" };
  return {
    title: `${programName} at ${college.name} — CollegeHub`,
    description: `View curriculum and course information for the ${programName} program at ${college.name}.`,
  };
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { id, program: programSlug } = await params;
  const college = getCollegeById(id);
  if (!college) notFound();

  const programName = slugToProgram(programSlug, college.programs);
  if (!programName) notFound();

  const degrees = getCollegeDegrees(college.id);
  const degree = degrees.find((d) => d.program === programName);
  if (!degree) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link
          href={`/colleges/${college.id}`}
          className="hover:text-blue-600 transition-colors"
        >
          ← Back to {college.name}
        </Link>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div
          className="mb-4 h-2 w-16 rounded-full"
          style={{ backgroundColor: college.primaryColor }}
        />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-100">
              {degree.program}
            </h1>
            <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">
              {college.name} · {degree.department}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">
            {degree.degreeType}
          </span>
        </div>
      </div>

      {/* Program Overview */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100">
          Program Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {degree.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-6">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Degree Type
            </span>
            <p className="mt-0.5 text-sm font-bold text-gray-900 dark:text-gray-100">
              {degree.degreeType}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Credits
            </span>
            <p className="mt-0.5 text-sm font-bold text-gray-900 dark:text-gray-100">
              {degree.totalCredits}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Department
            </span>
            <p className="mt-0.5 text-sm font-bold text-gray-900 dark:text-gray-100">
              {degree.department}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <Link
            href={`/colleges/${college.id}/degrees/${programSlug}/plan`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            View Degree Plan
          </Link>
        </div>
      </div>

      {/* Sample Curriculum */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-1 text-xl font-bold text-gray-900 dark:text-gray-100">
          Sample Curriculum
        </h2>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Representative courses in the {degree.program} program
        </p>
        <div className="space-y-3">
          {degree.sampleCourses.map((course) => (
            <div
              key={course.code}
              className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-900/50"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-mono font-medium text-blue-600 dark:text-blue-400">
                    {course.code}
                  </span>
                  <h3 className="mt-0.5 text-sm font-bold text-gray-900 dark:text-gray-100">
                    {course.name}
                  </h3>
                </div>
                <span className="shrink-0 rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {course.credits} cr
                </span>
              </div>
              {course.description && (
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {course.description}
                </p>
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
          Course listings based on typical program curricula. For official degree requirements, refer to{" "}
          <a
            href={getCollegeSourceUrl(college)}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600 dark:hover:text-gray-300"
          >
            {college.name}&apos;s academic catalog ↗
          </a>
          .
        </p>
      </div>

      {/* Related Programs */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
          All Programs at {college.name}
        </h2>
        <div className="flex flex-wrap gap-2">
          {degrees.map((d) => (
            <Link
              key={d.program}
              href={`/colleges/${college.id}/degrees/${encodeURIComponent(
                d.program.toLowerCase().replace(/\s+/g, "-")
              )}`}
              className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                d.program === degree.program
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {d.program}
            </Link>
          ))}
        </div>
        <div className="mt-4">
          <Link
            href={`/colleges/${college.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to {college.name} overview
          </Link>
        </div>
      </div>
    </div>
  );
}
