import type { College, CollegeFilters, CollegeSummary } from "@/types";
import { texasUniversities, texasUniversityMap } from "@/lib/texas-data";
import { ITEMS_PER_PAGE } from "@/lib/constants";

// ─── College Search ─────────────────────────────────────────────

export function searchColleges(filters: CollegeFilters): {
  colleges: CollegeSummary[];
  total: number;
  page: number;
  totalPages: number;
} {
  let results = [...texasUniversities];

  // Text search (name, city)
  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
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
    const aVal = a[sortBy as keyof CollegeSummary] ?? 0;
    const bVal = b[sortBy as keyof CollegeSummary] ?? 0;
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
  return texasUniversityMap.get(id);
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
    .map((id) => texasUniversityMap.get(id))
    .filter(Boolean) as College[];
}

export function getCollegesByState(state: string): CollegeSummary[] {
  return texasUniversities
    .filter((c) => c.state === state)
    .map(toSummary);
}

// ─── Stats helpers ──────────────────────────────────────────────

export function getStatewideStats() {
  const colleges = texasUniversities;
  return {
    totalColleges: colleges.length,
    publicColleges: colleges.filter((c) => c.type === "public").length,
    privateColleges: colleges.filter((c) => c.type === "private").length,
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

function toSummary(c: College): CollegeSummary {
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
    graduationRate6yr: c.graduationRate6yr,
    totalEnrollment: c.totalEnrollment,
    medianEarnings10yr: c.medianEarnings10yr,
  };
}
