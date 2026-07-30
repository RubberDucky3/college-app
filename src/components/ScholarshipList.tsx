"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { scholarships } from "@/lib/financial-data";
import { formatCurrency } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { useStudentGraph } from "@/contexts/StudentGraph";
import {
  rankScholarships,
  fitLabel,
  fitColor,
  type ScoreInput,
  type ScholarshipFit,
} from "@/lib/scholarship-score";

export default function ScholarshipList() {
  const { profile, hydrated } = useProfile();
  const { graph } = useStudentGraph();
  const [hideBlocked, setHideBlocked] = useState(false);

  const input: ScoreInput = useMemo(
    () => ({
      gpa: graph.gpa || profile.gpa,
      gpaScale: graph.gpa ? graph.gpaScale : profile.gpaScale,
      state: profile.state,
      gradeLevel: graph.hasCompletedOnboarding ? graph.gradeLevel : "",
      pellEligible: profile.pellEligible,
      hasLeadership:
        graph.extracurriculars.some((ec) => ec.leadership) ||
        profile.extracurriculars.some((ec) => ec.leadership),
      intendedMajor: graph.intendedMajor || profile.intendedMajor,
      satTotal:
        graph.satMath + graph.satReading || profile.satMath + profile.satReading,
      actComposite: graph.actComposite || profile.actComposite,
    }),
    [graph, profile]
  );

  // Before hydration we know nothing about the student, so keep the dataset's
  // own order — that's what the server rendered.
  const ranked = useMemo(
    () => rankScholarships(scholarships, input),
    [input]
  );

  const scored =
    hydrated && (input.gpa > 0 || !!input.state || !!input.gradeLevel);
  const visible = scored && hideBlocked
    ? ranked.filter((f) => f.blockers.length === 0)
    : ranked;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        {scored ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ranked against your profile. Scores are a starting point — always
            check the provider&apos;s own rules.
          </p>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <Link href="/profile" className="text-blue-600 hover:underline">
              Add your GPA and state
            </Link>{" "}
            to rank these by how well you fit.
          </p>
        )}

        {scored && (
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={hideBlocked}
              onChange={(e) => setHideBlocked(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            Hide ones I don&apos;t qualify for
          </label>
        )}
      </div>

      <div className="space-y-4">
        {visible.map((fit) => (
          <ScholarshipCard key={fit.scholarship.id} fit={fit} showScore={scored} />
        ))}
        {visible.length === 0 && (
          <p className="rounded-xl border border-gray-200 p-5 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
            Nothing matches every requirement yet. Uncheck the filter to see all{" "}
            {scholarships.length} scholarships.
          </p>
        )}
      </div>
    </>
  );
}

function ScholarshipCard({
  fit,
  showScore,
}: {
  fit: ScholarshipFit;
  showScore: boolean;
}) {
  const s = fit.scholarship;

  return (
    <div className="rounded-xl border border-purple-200 p-5 dark:border-purple-900/50">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
          Scholarship
        </span>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {s.name}
        </h3>
        {showScore && (
          <span
            className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${fitColor(fit.score)}`}
          >
            {fitLabel(fit.score)} · {fit.score}/10
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">{s.description}</p>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        <Field label="Amount" value={formatCurrency(s.amount)} />
        <Field label="Provider" value={s.provider} />
        <Field label="Type" value={s.type} capitalize />
        <Field label="Deadline" value={s.deadline} />
      </div>

      {showScore && (fit.reasons.length > 0 || fit.blockers.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {fit.reasons.map((r) => (
            <Chip key={r} tone="good">
              ✓ {r}
            </Chip>
          ))}
          {fit.blockers.map((b) => (
            <Chip key={b} tone="bad">
              ✕ {b}
            </Chip>
          ))}
        </div>
      )}

      {fit.verify.length > 0 && (
        <div className="mt-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {showScore ? "CONFIRM YOURSELF" : "ELIGIBILITY"}
          </span>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {fit.verify.join(" · ")}
          </p>
        </div>
      )}

      <a
        href={s.website}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
      >
        Apply →
      </a>
    </div>
  );
}

function Field({
  label,
  value,
  capitalize,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div>
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <p
        className={`font-semibold text-gray-900 dark:text-gray-100 ${capitalize ? "capitalize" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

function Chip({
  tone,
  children,
}: {
  tone: "good" | "bad";
  children: React.ReactNode;
}) {
  const cls =
    tone === "good"
      ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300";
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}
