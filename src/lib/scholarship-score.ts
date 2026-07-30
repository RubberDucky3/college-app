// ─── Scholarship Auto-Score — ranks scholarships against a student profile ──
//
// Eligibility criteria in the dataset are free text ("Minimum 3.0 GPA",
// "Texas resident"). Each rule below matches a phrase and checks it against
// what we know about the student. Unknowns never count against a scholarship —
// they surface as "verify" so the student knows what to confirm.

import type { Scholarship } from "@/types";

export interface ScoreInput {
  gpa: number;
  gpaScale: 4.0 | 5.0 | 100;
  /** Two-letter code or full name, e.g. "TX" or "Texas". Empty = unknown. */
  state: string;
  /** StudentGraph grade level, e.g. "senior". Empty = unknown. */
  gradeLevel: string;
  pellEligible: boolean;
  hasLeadership: boolean;
  intendedMajor: string;
  satTotal: number;
  actComposite: number;
}

export type CheckResult = "pass" | "fail" | "unknown";

export interface ScholarshipFit {
  scholarship: Scholarship;
  /** 1–10 fit score. 5 = neutral (nothing known either way). */
  score: number;
  reasons: string[];
  blockers: string[];
  /** Criteria we can't evaluate — student should confirm these themselves. */
  verify: string[];
}

const STEM_MAJORS =
  /engineer|computer|comp sci|math|physic|chem|biolog|science|technolog|data/i;

interface Rule {
  /** Matches an eligibility line (or the description). */
  match: RegExp;
  check: (input: ScoreInput, line: string) => CheckResult;
  label: (line: string) => string;
}

/** Convert any supported scale to a 0–4.0 equivalent. */
export function normalizeGpa(gpa: number, scale: ScoreInput["gpaScale"]): number {
  if (gpa <= 0) return 0;
  if (scale === 100) return (gpa / 100) * 4;
  if (scale === 5.0) return (gpa / 5) * 4;
  return gpa;
}

function isTexan(state: string): boolean {
  return /^(tx|texas)$/i.test(state.trim());
}

const RULES: Rule[] = [
  {
    // "Minimum 3.0 GPA", "3.3 GPA", "Minimum 3.0 GPA for high school / 2.5 for college"
    match: /(\d(?:\.\d+)?)\s*GPA/i,
    check: (input, line) => {
      if (input.gpa <= 0) return "unknown";
      const min = parseFloat(line.match(/(\d(?:\.\d+)?)\s*GPA/i)![1]);
      return normalizeGpa(input.gpa, input.gpaScale) >= min ? "pass" : "fail";
    },
    label: (line) => line.match(/(\d(?:\.\d+)?)\s*GPA/i)![0],
  },
  {
    match: /texas (resident|high school)/i,
    check: (input) => {
      if (!input.state) return "unknown";
      return isTexan(input.state) ? "pass" : "fail";
    },
    label: () => "Texas residency",
  },
  {
    match: /high school (senior|graduate)/i,
    check: (input) => {
      if (!input.gradeLevel) return "unknown";
      return input.gradeLevel === "senior" || input.gradeLevel === "gap-year"
        ? "pass"
        : "fail";
    },
    label: () => "High school senior",
  },
  {
    match: /\bpell\b|financial need|low-income/i,
    // We only ever learn that a student IS Pell-eligible, never that they
    // aren't — an unchecked box is not a "no". So this can't produce a fail.
    check: (input) => (input.pellEligible ? "pass" : "unknown"),
    label: () => "Demonstrated financial need",
  },
  {
    match: /leadership|community (service|involvement)/i,
    check: (input) => (input.hasLeadership ? "pass" : "unknown"),
    label: () => "Leadership / service",
  },
  {
    // Case-sensitive acronym with word boundaries: an /i match on "stem" also
    // hits "UT sySTEM school".
    match: /\bSTEM\b|[Ee]ngineering/,
    check: (input) => {
      if (!input.intendedMajor) return "unknown";
      return STEM_MAJORS.test(input.intendedMajor) ? "pass" : "fail";
    },
    label: () => "STEM major",
  },
  {
    match: /PSAT|top 1%|scores in top/i,
    check: (input) => {
      if (input.satTotal <= 0 && input.actComposite <= 0) return "unknown";
      return input.satTotal >= 1450 || input.actComposite >= 33 ? "pass" : "fail";
    },
    label: () => "Top-percentile test scores",
  },
];

const NEUTRAL = 5;
const PASS_WEIGHT = 1.5;
const FAIL_WEIGHT = 3;

export function scoreScholarship(
  scholarship: Scholarship,
  input: ScoreInput
): ScholarshipFit {
  const reasons: string[] = [];
  const blockers: string[] = [];
  const verify: string[] = [];

  for (const line of scholarship.eligibility) {
    const rule = RULES.find((r) => r.match.test(line));
    if (!rule) {
      // No rule covers this criterion (e.g. demographic eligibility, which we
      // deliberately don't collect or infer) — the student confirms it.
      verify.push(line);
      continue;
    }
    const result = rule.check(input, line);
    if (result === "pass") reasons.push(rule.label(line));
    else if (result === "fail") blockers.push(rule.label(line));
    else verify.push(line);
  }

  const raw = NEUTRAL + reasons.length * PASS_WEIGHT - blockers.length * FAIL_WEIGHT;
  const score = Math.max(1, Math.min(10, Math.round(raw)));

  return { scholarship, score, reasons, blockers, verify };
}

/** Score every scholarship and sort best fit first (ties broken by amount). */
export function rankScholarships(
  list: Scholarship[],
  input: ScoreInput
): ScholarshipFit[] {
  return list
    .map((s) => scoreScholarship(s, input))
    .sort((a, b) => b.score - a.score || b.scholarship.amount - a.scholarship.amount);
}

export function fitLabel(score: number): string {
  if (score >= 8) return "Strong fit";
  if (score >= 6) return "Likely fit";
  if (score >= 4) return "Possible fit";
  return "Unlikely";
}

export function fitColor(score: number): string {
  if (score >= 8) return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
  if (score >= 6) return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
  if (score >= 4) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";
  return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
}
