// ─── College Types ───────────────────────────────────────────────

export interface College {
  id: string;
  name: string;
  city: string;
  state: string;
  zip: string;
  website: string;
  applicationUrl: string;
  type: "public" | "private" | "for-profit";
  locale: "urban" | "suburban" | "rural";
  size: "small" | "medium" | "large" | "very-large";

  // Admissions
  acceptanceRate: number; // 0-100
  satMath25th: number;
  satMath75th: number;
  satReading25th: number;
  satReading75th: number;
  actComposite25th: number;
  actComposite75th: number;
  applicationFee: number;
  applicationDeadline: string; // e.g. "January 15"

  // Cost
  tuitionInState: number;
  tuitionOutOfState: number;
  feesInState: number;
  feesOutOfState: number;
  roomBoardOnCampus: number;
  avgNetPrice: number; // avg net price after aid
  booksAndSupplies: number;

  // Financial Aid
  pctReceivingGrants: number;
  avgGrantAid: number;
  pctReceivingPellGrants: number;
  avgPellGrant: number;
  pctReceivingFederalLoans: number;
  avgFederalLoan: number;

  // Outcomes
  graduationRate4yr: number;
  graduationRate6yr: number;
  retentionRate: number;
  medianEarnings10yr: number; // 10 years after entry
  medianEarnings6yr: number; // 6 years after entry
  repaymentRate: number;

  // Demographics
  totalEnrollment: number;
  undergraduateEnrollment: number;
  malePct: number;
  femalePct: number;
  diversityIndex: number;
  internationalPct: number;
}

export interface CollegeSummary {
  id: string;
  name: string;
  city: string;
  state: string;
  type: College["type"];
  acceptanceRate: number;
  tuitionInState: number;
  tuitionOutOfState: number;
  avgNetPrice: number;
  graduationRate6yr: number;
  totalEnrollment: number;
  medianEarnings10yr: number;
}

// ─── Financial Aid Types ─────────────────────────────────────────

export type GrantSource = "federal" | "state" | "institutional" | "private";
export type LoanType = "federal-subsidized" | "federal-unsubsidized" | "federal-plus" | "private";
export type ScholarshipType = "merit" | "need-based" | "athletic" | "departmental" | "external";

export interface Grant {
  id: string;
  name: string;
  source: GrantSource;
  description: string;
  maxAmount: number;
  eligibility: string[];
  applicationRequired: boolean;
  deadline: string;
  website: string;
  renewable: boolean;
}

export interface Loan {
  id: string;
  name: string;
  type: LoanType;
  description: string;
  interestRate: string; // e.g. "5.50%"
  originationFee: string; // e.g. "1.057%"
  maxAmount: number;
  eligibility: string[];
  repaymentInfo: string;
  subsidized: boolean;
}

export interface Scholarship {
  id: string;
  name: string;
  type: ScholarshipType;
  provider: string;
  description: string;
  amount: number;
  eligibility: string[];
  deadline: string;
  website: string;
  essayRequired: boolean;
  renewable: boolean;
  national: boolean; // open to students nationwide
}

// ─── Search / Filter Types ───────────────────────────────────────

export interface CollegeFilters {
  query?: string;
  state?: string;
  type?: College["type"];
  locale?: College["locale"];
  size?: College["size"];
  maxTuition?: number;
  minAcceptanceRate?: number;
  maxAcceptanceRate?: number;
  sortBy?: "name" | "acceptanceRate" | "tuitionInState" | "graduationRate6yr" | "medianEarnings10yr";
  sortOrder?: "asc" | "desc";
  page?: number;
}
