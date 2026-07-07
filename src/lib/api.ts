import type { College, CollegeFilters, CollegeSummary } from "@/types";
import { allColleges, collegeMap } from "@/lib/college-data";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { getCollegeLogoUrl } from "@/lib/utils";

// ─── College Search ─────────────────────────────────────────────

export function searchColleges(filters: CollegeFilters): {
  colleges: CollegeSummary[];
  total: number;
  page: number;
  totalPages: number;
} {
  let results = [...allColleges];

  // Text search (name, city, programs)
  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.programs.some((p) => p.toLowerCase().includes(q))
    );
  }

  // State filter
  if (filters.state) {
    results = results.filter((c) => c.state === filters.state);
  }

  // Type filter
  if (filters.type) {
    results = results.filter((c) => c.type === filters.type);
  }

  // Locale filter
  if (filters.locale) {
    results = results.filter((c) => c.locale === filters.locale);
  }

  // Size filter
  if (filters.size) {
    results = results.filter((c) => c.size === filters.size);
  }

  // Program filter
  if (filters.program) {
    results = results.filter((c) =>
      c.programs.some((p) => p === filters.program)
    );
  }

  // Tuition filter
  if (filters.maxTuition) {
    results = results.filter(
      (c) => c.tuitionInState <= filters.maxTuition!
    );
  }

  // Acceptance rate range
  if (filters.minAcceptanceRate !== undefined) {
    results = results.filter(
      (c) => c.acceptanceRate >= filters.minAcceptanceRate!
    );
  }
  if (filters.maxAcceptanceRate !== undefined) {
    results = results.filter(
      (c) => c.acceptanceRate <= filters.maxAcceptanceRate!
    );
  }

  // Sort
  const sortBy = filters.sortBy || "name";
  const sortOrder = filters.sortOrder || "asc";

  results.sort((a, b) => {
    const aVal = (a as unknown as Record<string, unknown>)[sortBy] ?? 0;
    const bVal = (b as unknown as Record<string, unknown>)[sortBy] ?? 0;
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return sortOrder === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  const total = results.length;
  const page = filters.page || 1;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paged = results.slice(start, start + ITEMS_PER_PAGE);

  return {
    colleges: paged.map(toSummary),
    total,
    page,
    totalPages,
  };
}

// ─── Get Single College ──────────────────────────────────────────

export function getCollegeById(id: string): College | undefined {
  return collegeMap.get(id);
}

// ─── Get Featured / Random Colleges ──────────────────────────────

export function getFeaturedColleges(count = 6): CollegeSummary[] {
  // Return a mix of well-known Texas schools
  const featured = [
    "ut-austin",
    "texas-am",
    "rice",
    "baylor",
    "tcu",
    "smu",
  ];
  return featured
    .map((id) => collegeMap.get(id))
    .filter((c): c is College => c !== undefined)
    .map(toSummary);
}

export function getCollegesByState(state: string): CollegeSummary[] {
  return allColleges
    .filter((c) => c.state === state)
    .map(toSummary);
}

// ─── Degree / Course Info ──────────────────────────────────────

import { getDegreesForCollege, getDegreePlan, getCollegeSourceUrl } from "@/lib/degree-data";
import { collegeHonors, collegeScholarships } from "@/lib/college-enrichment-data";
import type { DegreeOffering, DegreePlan, HonorsProgram, Scholarship } from "@/types";

export { getCollegeSourceUrl };

export function getCollegeDegrees(id: string): DegreeOffering[] {
  const college = collegeMap.get(id);
  if (!college) return [];
  return getDegreesForCollege(college);
}

export function getCollegePlan(
  collegeId: string,
  programName: string
): DegreePlan | null {
  const college = collegeMap.get(collegeId);
  if (!college) return null;
  return getDegreePlan(college, programName);
}

export function getDegreesOverview(): {
  program: string;
  collegeIds: { id: string; name: string }[];
}[] {
  const programMap = new Map<string, { id: string; name: string }[]>();
  for (const college of allColleges) {
    for (const program of college.programs) {
      if (!programMap.has(program)) {
        programMap.set(program, []);
      }
      programMap.get(program)!.push({ id: college.id, name: college.name });
    }
  }
  return Array.from(programMap.entries())
    .map(([program, colleges]) => ({ program, collegeIds: colleges.sort((a, b) => a.name.localeCompare(b.name)) }))
    .sort((a, b) => a.program.localeCompare(b.program));
}

// ─── Honors & Scholarships ──────────────────────────────────────

export function getCollegeHonors(collegeId: string): HonorsProgram[] {
  return collegeHonors[collegeId] ?? [];
}

export function getCollegeScholarships(collegeId: string): Scholarship[] {
  return collegeScholarships[collegeId] ?? [];
}

// ─── Stats helpers ──────────────────────────────────────────────

export function getStatewideStats() {
  const colleges = allColleges;
  const totalStudents = colleges.reduce((sum, c) => sum + c.totalEnrollment, 0);
  return {
    totalColleges: colleges.length,
    publicColleges: colleges.filter((c) => c.type === "public").length,
    privateColleges: colleges.filter((c) => c.type === "private").length,
    totalStudents,
    avgInStateTuition: Math.round(
      colleges.reduce((sum, c) => sum + c.tuitionInState, 0) /
        colleges.length
    ),
    avgAcceptanceRate: Math.round(
      colleges.reduce((sum, c) => sum + c.acceptanceRate, 0) /
        colleges.length
    ),
    avgGraduationRate6yr: Math.round(
      colleges.reduce((sum, c) => sum + c.graduationRate6yr, 0) /
        colleges.length
    ),
    avgNetPrice: Math.round(
      colleges.reduce((sum, c) => sum + c.avgNetPrice, 0) /
        colleges.length
    ),
  };
}

// ─── Helpers ────────────────────────────────────────────────────

export function toSummary(c: College): CollegeSummary {
  return {
    id: c.id,
    name: c.name,
    city: c.city,
    state: c.state,
    type: c.type,
    acceptanceRate: c.acceptanceRate,
    tuitionInState: c.tuitionInState,
    tuitionOutOfState: c.tuitionOutOfState,
    avgNetPrice: c.avgNetPrice,
    graduationRate4yr: c.graduationRate4yr,
    graduationRate6yr: c.graduationRate6yr,
    totalEnrollment: c.totalEnrollment,
    medianEarnings10yr: c.medianEarnings10yr,
    primaryColor: c.primaryColor,
    secondaryColor: c.secondaryColor,
    logoUrl: getCollegeLogoUrl(c.website),
    programs: c.programs,
  };
}
