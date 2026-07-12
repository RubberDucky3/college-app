// ─── Similar Colleges ─────────────────────────────────────────
// Computes similarity between colleges using normalized Euclidean distance
// on key features: size, locale, type, selectivity, cost, enrollment, outcomes.

import { allColleges } from "@/lib/college-data";
import type { College } from "@/types";

// ─── Feature Normalization ─────────────────────────────────────

type NumericFeatures = {
  sizeScore: number; // 0-1 (small→large)
  localeScore: number; // 0-1 (rural→urban)
  typeScore: number; // 0-1 (for-profit→private)
  acceptanceRate: number; // 0-1
  tuitionCost: number; // 0-1 (normalized)
  netPrice: number; // 0-1 (normalized)
  enrollment: number; // 0-1 (log-normalized)
  graduationRate: number; // 0-1
  medianEarnings: number; // 0-1 (normalized)
  satMidpoint: number; // 0-1 (normalized)
};

const SIZE_MAP: Record<string, number> = {
  small: 0,
  medium: 1,
  large: 2,
  "very-large": 3,
};

const LOCALE_MAP: Record<string, number> = {
  rural: 0,
  suburban: 1,
  urban: 2,
};

const TYPE_MAP: Record<string, number> = {
  "for-profit": 0,
  public: 1,
  private: 2,
};

// Precompute global min/max for normalization
function computeRanges(): Record<string, { min: number; max: number }> {
  const keys = [
    "acceptanceRate",
    "tuitionInState",
    "avgNetPrice",
    "totalEnrollment",
    "graduationRate6yr",
    "medianEarnings10yr",
    "satMath25th",
    "satReading25th",
    "satMath75th",
    "satReading75th",
  ] as const;
  const ranges: Record<string, { min: number; max: number }> = {};
  for (const key of keys) {
    let min = Infinity;
    let max = -Infinity;
    for (const c of allColleges) {
      const v = c[key] ?? 0;
      if (v < min) min = v;
      if (v > max) max = v;
    }
    ranges[key] = { min, max };
  }
  let satMin = Infinity;
  let satMax = -Infinity;
  for (const c of allColleges) {
    const m25 = c.satMath25th;
    const m75 = c.satMath75th;
    const r25 = c.satReading25th;
    const r75 = c.satReading75th;
    if (m25 == null || m75 == null || r25 == null || r75 == null) continue;
    const mid = (m25 + r25 + m75 + r75) / 2;
    if (mid < satMin) satMin = mid;
    if (mid > satMax) satMax = mid;
  }
  ranges.satMidpoint = { min: satMin, max: satMax };
  return ranges;
}

const RANGES = computeRanges();

function normalize(value: number, key: string): number {
  const r = RANGES[key];
  if (!r || r.max === r.min) return 0.5;
  return (value - r.min) / (r.max - r.min);
}

function extractFeatures(college: College): NumericFeatures {
  // For null values, use 0.5 (neutral) so the college isn't penalized for missing data
  const safe = (v: number | null, key: string) =>
    v != null ? normalize(v, key) : 0.5;

  const m25 = college.satMath25th;
  const m75 = college.satMath75th;
  const r25 = college.satReading25th;
  const r75 = college.satReading75th;
  const satMid =
    m25 != null && m75 != null && r25 != null && r75 != null
      ? normalize((m25 + r25 + m75 + r75) / 2, "satMidpoint")
      : 0.5;

  const logEnroll =
    college.totalEnrollment != null
      ? normalize(Math.log10(college.totalEnrollment + 1), "totalEnrollment")
      : 0.5;

  return {
    sizeScore: (SIZE_MAP[college.size] ?? 1) / 3,
    localeScore: (LOCALE_MAP[college.locale] ?? 1) / 2,
    typeScore: (TYPE_MAP[college.type] ?? 1) / 2,
    acceptanceRate: safe(college.acceptanceRate, "acceptanceRate"),
    tuitionCost: safe(college.tuitionInState, "tuitionInState"),
    netPrice: safe(college.avgNetPrice, "avgNetPrice"),
    enrollment: logEnroll,
    graduationRate: safe(college.graduationRate6yr, "graduationRate6yr"),
    medianEarnings: safe(college.medianEarnings10yr, "medianEarnings10yr"),
    satMidpoint: satMid,
  };
}

// Feature weights — tune to prioritize what matters most
const WEIGHTS: Record<keyof NumericFeatures, number> = {
  sizeScore: 1.0,
  localeScore: 1.0,
  typeScore: 0.8,
  acceptanceRate: 1.5,
  tuitionCost: 1.2,
  netPrice: 0.8,
  enrollment: 0.6,
  graduationRate: 1.0,
  medianEarnings: 0.8,
  satMidpoint: 1.2,
};

function euclideanDistance(a: NumericFeatures, b: NumericFeatures): number {
  let sum = 0;
  for (const key of Object.keys(WEIGHTS) as (keyof NumericFeatures)[]) {
    const diff = a[key] - b[key];
    sum += WEIGHTS[key] * diff * diff;
  }
  return Math.sqrt(sum);
}

// ─── Main API ──────────────────────────────────────────────────

const featureCache = new Map<string, NumericFeatures>();

function getFeatures(college: College): NumericFeatures {
  let f = featureCache.get(college.id);
  if (!f) {
    f = extractFeatures(college);
    featureCache.set(college.id, f);
  }
  return f;
}

export interface SimilarCollegeResult {
  id: string;
  name: string;
  city: string;
  state: string;
  type: "public" | "private" | "for-profit";
  locale: "urban" | "suburban" | "rural";
  size: "small" | "medium" | "large" | "very-large";
  acceptanceRate: number | null;
  tuitionInState: number | null;
  avgNetPrice: number | null;
  graduationRate6yr: number | null;
  totalEnrollment: number | null;
  medianEarnings10yr: number | null;
  primaryColor: string;
  similarityScore: number; // 0 = identical, higher = less similar
  matchPercent: number; // 0-100, higher = more similar
}

/**
 * Get colleges most similar to the given college.
 * Excludes the college itself.
 */
export function getSimilarColleges(
  collegeId: string,
  count = 5
): SimilarCollegeResult[] {
  const college = allColleges.find((c) => c.id === collegeId);
  if (!college) return [];

  const targetFeatures = getFeatures(college);

  const scored = allColleges
    .filter((c) => c.id !== collegeId)
    .map((c) => ({
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
      similarityScore: euclideanDistance(targetFeatures, getFeatures(c)),
    }));

  scored.sort((a, b) => a.similarityScore - b.similarityScore);

  const maxScore = scored.length > count ? scored[count].similarityScore : 1;
  const minScore = scored[0]?.similarityScore ?? 0;
  const range = Math.max(maxScore - minScore, 0.01);

  return scored.slice(0, count).map((s) => ({
    ...s,
    matchPercent: Math.round((1 - (s.similarityScore - minScore) / range) * 100),
  }));
}
