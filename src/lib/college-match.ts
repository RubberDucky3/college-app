// ─── College Match Quiz Engine ──────────────────────────────────
// Scores all 2,667 national colleges against a student's preferences
// and returns ranked matches.

import { allColleges } from "@/lib/college-data";
import type { College } from "@/types";

// ─── Types ──────────────────────────────────────────────────────

export interface QuizPreferences {
  /** Preferred size: "small" | "medium" | "large" | "very-large" | "any" */
  size: string;
  /** "public" | "private" | "any" */
  type: string;
  /** "urban" | "suburban" | "rural" | "any" */
  locale: string;
  /** Selectivity: "safety" (high acceptance), "target" (moderate), "reach" (low), "any" */
  selectivity: string;
  /** Max annual tuition (in-state) budget, 0 = no limit */
  maxTuition: number;
  /** Desired program/major or "" for any */
  program: string;
  /** Preferred state abbreviation or "" for any */
  state: string;
  /** Minimum graduation rate (0-100), 0 = no minimum */
  minGraduationRate: number;
  /** Minimum median earnings 10yr, 0 = no minimum */
  minEarnings: number;
  /** "small" (< 5k) | "medium" (5k-15k) | "large" (> 15k) | "any" */
  campusSize: string;
}

export interface MatchResult {
  id: string;
  name: string;
  city: string;
  state: string;
  type: "public" | "private" | "for-profit";
  locale: "urban" | "suburban" | "rural";
  size: "small" | "medium" | "large" | "very-large";
  acceptanceRate: number;
  tuitionInState: number;
  avgNetPrice: number;
  graduationRate6yr: number;
  totalEnrollment: number;
  medianEarnings10yr: number;
  primaryColor: string;
  matchScore: number; // 0-100 overall match
  selectivityTag: "safety" | "target" | "reach";
}

// ─── Scoring Engine ─────────────────────────────────────────────

const SIZE_ORDER: Record<string, number> = {
  small: 0,
  medium: 1,
  large: 2,
  "very-large": 3,
};

function getSelectivityTag(acceptanceRate: number): "safety" | "target" | "reach" {
  if (acceptanceRate >= 70) return "safety";
  if (acceptanceRate >= 35) return "target";
  return "reach";
}

function scoreSize(college: College, pref: string): number {
  if (pref === "any") return 0.5;
  const cSize = SIZE_ORDER[college.size] ?? 1;
  const pSize = SIZE_ORDER[pref] ?? 1;
  const diff = Math.abs(cSize - pSize);
  if (diff === 0) return 1;
  if (diff === 1) return 0.6;
  return 0.2;
}

function scoreType(college: College, pref: string): number {
  if (pref === "any") return 0.5;
  return college.type === pref ? 1 : 0.3;
}

function scoreLocale(college: College, pref: string): number {
  if (pref === "any") return 0.5;
  return college.locale === pref ? 1 : 0.4;
}

function scoreSelectivity(college: College, pref: string): number {
  if (pref === "any") return 0.5;
  const ar = college.acceptanceRate;
  // Map preferences to ideal rate ranges
  if (pref === "safety") {
    if (ar >= 75) return 1;
    if (ar >= 50) return 0.7;
    if (ar >= 30) return 0.3;
    return 0.1;
  }
  if (pref === "target") {
    if (ar >= 40 && ar < 75) return 1;
    if (ar >= 25 && ar < 40) return 0.7;
    if (ar >= 75) return 0.5;
    return 0.2;
  }
  if (pref === "reach") {
    if (ar < 30) return 1;
    if (ar < 50) return 0.6;
    if (ar < 70) return 0.3;
    return 0.1;
  }
  return 0.5;
}

function scoreTuition(college: College, maxTuition: number): number {
  if (maxTuition <= 0) return 0.5;
  const tuition = college.tuitionInState;
  if (tuition <= maxTuition) return 1;
  const overage = tuition - maxTuition;
  // Gradually decay for over-budget schools
  if (overage < 5000) return 0.7;
  if (overage < 15000) return 0.4;
  return 0.15;
}

function scoreProgram(college: College, program: string): number {
  if (!program) return 0.5;
  const p = program.toLowerCase();
  if (college.programs.some((prog) => prog.toLowerCase().includes(p))) return 1;
  if (college.programs.some((prog) => p.includes(prog.toLowerCase())))
    return 0.6;
  return 0.2;
}

function scoreState(college: College, state: string): number {
  if (!state) return 0.5;
  return college.state === state ? 1 : 0.15;
}

function scoreGradRate(college: College, minRate: number): number {
  if (minRate <= 0) return 0.5;
  if (college.graduationRate6yr >= minRate) return 1;
  const shortfall = minRate - college.graduationRate6yr;
  if (shortfall < 10) return 0.6;
  if (shortfall < 20) return 0.3;
  return 0.1;
}

function scoreEarnings(college: College, minEarnings: number): number {
  if (minEarnings <= 0) return 0.5;
  if (college.medianEarnings10yr >= minEarnings) return 1;
  const ratio = college.medianEarnings10yr / minEarnings;
  if (ratio >= 0.8) return 0.7;
  if (ratio >= 0.5) return 0.4;
  return 0.15;
}

function scoreCampusSize(college: College, pref: string): number {
  if (pref === "any") return 0.5;
  const enrollment = college.totalEnrollment;
  if (pref === "small") return enrollment < 5000 ? 1 : enrollment < 10000 ? 0.5 : 0.2;
  if (pref === "medium") return enrollment >= 5000 && enrollment <= 15000 ? 1 : enrollment > 15000 ? 0.5 : 0.3;
  if (pref === "large") return enrollment > 15000 ? 1 : enrollment > 10000 ? 0.6 : 0.2;
  return 0.5;
}

// ─── Weights for each preference dimension ──────────────────────

interface WeightMap {
  size: number;
  type: number;
  locale: number;
  selectivity: number;
  tuition: number;
  program: number;
  state: number;
  gradRate: number;
  earnings: number;
  campusSize: number;
}

function getWeights(prefs: QuizPreferences): WeightMap {
  return {
    size: prefs.size !== "any" ? 1.5 : 0.5,
    type: prefs.type !== "any" ? 1.2 : 0.3,
    locale: prefs.locale !== "any" ? 1.0 : 0.3,
    selectivity: prefs.selectivity !== "any" ? 2.0 : 0.5,
    tuition: prefs.maxTuition > 0 ? 1.8 : 0.5,
    program: prefs.program ? 1.5 : 0.3,
    state: prefs.state ? 1.2 : 0.2,
    gradRate: prefs.minGraduationRate > 0 ? 1.0 : 0.3,
    earnings: prefs.minEarnings > 0 ? 0.8 : 0.3,
    campusSize: prefs.campusSize !== "any" ? 0.8 : 0.3,
  };
}

// ─── Main API ──────────────────────────────────────────────────

export function findMatches(prefs: QuizPreferences): MatchResult[] {
  const weights = getWeights(prefs);
  const maxPossible = Object.values(weights).reduce((a, b) => a + b, 0);

  const scored = allColleges.map((c) => {
    const rawScore =
      weights.size * scoreSize(c, prefs.size) +
      weights.type * scoreType(c, prefs.type) +
      weights.locale * scoreLocale(c, prefs.locale) +
      weights.selectivity * scoreSelectivity(c, prefs.selectivity) +
      weights.tuition * scoreTuition(c, prefs.maxTuition) +
      weights.program * scoreProgram(c, prefs.program) +
      weights.state * scoreState(c, prefs.state) +
      weights.gradRate * scoreGradRate(c, prefs.minGraduationRate) +
      weights.earnings * scoreEarnings(c, prefs.minEarnings) +
      weights.campusSize * scoreCampusSize(c, prefs.campusSize);

    const matchScore = Math.round((rawScore / maxPossible) * 100);

    return {
      id: c.id,
      name: c.name,
      city: c.city,
      state: c.state,
      type: c.type,
      locale: c.locale,
      size: c.size,
      acceptanceRate: c.acceptanceRate,
      tuitionInState: c.tuitionInState,
      avgNetPrice: c.avgNetPrice,
      graduationRate6yr: c.graduationRate6yr,
      totalEnrollment: c.totalEnrollment,
      medianEarnings10yr: c.medianEarnings10yr,
      primaryColor: c.primaryColor,
      matchScore,
      selectivityTag: getSelectivityTag(c.acceptanceRate),
    };
  });

  // Filter out very poor matches (below 15%) to keep results meaningful
  const filtered = scored.filter((s) => s.matchScore >= 15);

  // Sort by match score descending
  filtered.sort((a, b) => b.matchScore - a.matchScore);

  return filtered;
}

// ─── Preset Questions for the Quiz UI ──────────────────────────

export interface QuizQuestion {
  id: string;
  question: string;
  subtext?: string;
  options: { value: string; label: string; emoji?: string }[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "size",
    question: "What size school are you looking for?",
    subtext: "Small schools feel intimate; large schools have more resources.",
    options: [
      { value: "any", label: "No preference", emoji: "🤷" },
      { value: "small", label: "Small (< 2k students)", emoji: "🏘️" },
      { value: "medium", label: "Medium (2k–10k)", emoji: "🏙️" },
      { value: "large", label: "Large (10k–20k)", emoji: "🌆" },
      { value: "very-large", label: "Very Large (20k+)", emoji: "🌃" },
    ],
  },
  {
    id: "type",
    question: "Public or private?",
    subtext: "Public schools are typically lower cost in-state; private schools often have more aid.",
    options: [
      { value: "any", label: "No preference", emoji: "🤷" },
      { value: "public", label: "Public", emoji: "🏛️" },
      { value: "private", label: "Private", emoji: "🎓" },
    ],
  },
  {
    id: "locale",
    question: "What setting do you prefer?",
    subtext: "Urban schools put you in the city; rural schools offer a quieter campus life.",
    options: [
      { value: "any", label: "No preference", emoji: "🤷" },
      { value: "urban", label: "Urban (city)", emoji: "🏙️" },
      { value: "suburban", label: "Suburban", emoji: "🏡" },
      { value: "rural", label: "Rural", emoji: "🌲" },
    ],
  },
  {
    id: "selectivity",
    question: "How selective should the school be?",
    subtext: "This helps us find safety, target, or reach schools for you.",
    options: [
      { value: "any", label: "No preference", emoji: "🤷" },
      { value: "safety", label: "Safety (≥70% acceptance)", emoji: "🛡️" },
      { value: "target", label: "Target (35–70%)", emoji: "🎯" },
      { value: "reach", label: "Reach (<35%)", emoji: "⭐" },
    ],
  },
  {
    id: "state",
    question: "Any state preference?",
    subtext: "Only shows schools in your preferred state.",
    options: [
      { value: "", label: "Any state", emoji: "🇺🇸" },
      { value: "TX", label: "Texas", emoji: "⭐" },
      { value: "CA", label: "California", emoji: "🌊" },
      { value: "NY", label: "New York", emoji: "🗽" },
      { value: "FL", label: "Florida", emoji: "☀️" },
      { value: "IL", label: "Illinois", emoji: "🌽" },
      { value: "MA", label: "Massachusetts", emoji: "📚" },
      { value: "other", label: "Other state", emoji: "🗺️" },
    ],
  },
  {
    id: "program",
    question: "What do you want to study?",
    subtext: "Enter a major or field of study, or skip if undecided.",
    options: [
      { value: "", label: "Undecided / Any", emoji: "🤷" },
      { value: "Engineering", label: "Engineering", emoji: "⚙️" },
      { value: "Computer Science", label: "Computer Science", emoji: "💻" },
      { value: "Business", label: "Business", emoji: "💼" },
      { value: "Biology", label: "Biology / Pre-Med", emoji: "🧬" },
      { value: "Psychology", label: "Psychology", emoji: "🧠" },
      { value: "Art", label: "Art / Design", emoji: "🎨" },
      { value: "Nursing", label: "Nursing", emoji: "🏥" },
      { value: "custom", label: "Other (type it in)", emoji: "✏️" },
    ],
  },
  {
    id: "tuition",
    question: "What's your annual budget for tuition?",
    subtext: "This helps filter by in-state tuition cost.",
    options: [
      { value: "0", label: "No limit", emoji: "🤷" },
      { value: "5000", label: "Under $5k", emoji: "💰" },
      { value: "10000", label: "Under $10k", emoji: "💰💰" },
      { value: "20000", label: "Under $20k", emoji: "💰💰💰" },
      { value: "40000", label: "Under $40k", emoji: "💎" },
    ],
  },
];
