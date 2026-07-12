// ─── College Types ───────────────────────────────────────────────

export type StandardizedTestPolicy =
  | "required"
  | "recommended"
  | "optional"
  | "considered-if-submitted"
  | "not-considered"
  | "test-flexible";

export type InterviewPolicy =
  | "required"
  | "recommended"
  | "optional"
  | "not-offered"
  | "informational";

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

  // Admissions (null = not reported)
  acceptanceRate: number | null; // 0-100
  satMath25th: number | null;
  satMath75th: number | null;
  satReading25th: number | null;
  satReading75th: number | null;
  actComposite25th: number | null;
  actComposite75th: number | null;
  applicationFee: number;
  applicationDeadline: string; // e.g. "January 15"

  // Admissions Requirements (US News style)
  admissionInterview: InterviewPolicy;
  standardizedTestPolicy: StandardizedTestPolicy;
  satActScoresMustBeReceivedBy: string; // deadline for test scores

  // Application Details
  earlyDecisionDeadline: string;
  earlyActionDeadline: string;
  commonApplicationAccepted: boolean;
  housingDepositDeadline: string;
  priorityApplicationDeadline: string;
  notificationDate: string;

  // Entering Class Stats (null = not reported)
  earlyDecisionAcceptanceRate: number | null; // 0-100
  studentsSubmittingSatPct: number | null; // 0-100
  studentsSubmittingActPct: number | null; // 0-100

  // Cost (null = not reported)
  tuitionInState: number | null;
  tuitionOutOfState: number | null;
  feesInState: number;
  feesOutOfState: number;
  roomBoardOnCampus: number | null;
  avgNetPrice: number | null; // avg net price after aid
  booksAndSupplies: number | null;

  // Financial Aid (null = not reported)
  pctReceivingGrants: number;
  avgGrantAid: number;
  pctReceivingPellGrants: number | null;
  avgPellGrant: number;
  pctReceivingFederalLoans: number | null;
  avgFederalLoan: number;

  // Outcomes (null = not reported)
  graduationRate4yr: number | null;
  graduationRate6yr: number | null;
  retentionRate: number | null;
  medianEarnings10yr: number | null; // 10 years after entry
  medianEarnings6yr: number | null; // 6 years after entry
  repaymentRate: number | null;

  // Demographics (null = not reported)
  totalEnrollment: number | null;
  undergraduateEnrollment: number | null;
  malePct: number | null;
  femalePct: number | null;
  diversityIndex: number;
  internationalPct: number;

  // Programs / Majors
  programs: string[];

  // Branding
  primaryColor: string;
  secondaryColor: string;
}

export interface CollegeSummary {
  id: string;
  name: string;
  city: string;
  state: string;
  type: College["type"];
  acceptanceRate: number | null;
  tuitionInState: number | null;
  tuitionOutOfState: number | null;
  avgNetPrice: number | null;
  graduationRate4yr: number | null;
  graduationRate6yr: number | null;
  totalEnrollment: number | null;
  medianEarnings10yr: number | null;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  programs: string[];
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
  collegeId?: string; // specific college this scholarship belongs to
}

export interface HonorsProgram {
  id: string;
  name: string;
  collegeId: string;
  description: string;
  features: string[];
  eligibility: string[];
  website: string;
}

// ─── Degree Plan Types ────────────────────────────────────────────

export interface Course {
  code: string;
  name: string;
  credits: number;
  prerequisites?: string[];
  description?: string;
}

export interface Semester {
  name: string; // e.g. "Fall Year 1"
  courses: Course[];
}

export interface DegreePlan {
  id: string;
  collegeId: string;
  collegeName: string;
  program: string;
  degree: string; // e.g. "Bachelor of Science"
  totalCredits: number;
  semesters: Semester[];
}

// ─── Degree Offering Types ────────────────────────────────────────

export interface DegreeOffering {
  program: string;
  degreeType: string;
  department: string;
  description: string;
  sampleCourses: Course[];
  totalCredits: number;
}

export interface ProgramCatalogEntry {
  degreeTypes: string[];
  commonCourses: Course[];
  description: string;
  typicalCredits: number;
}

// ─── Search / Filter Types ───────────────────────────────────────

export interface CollegeFilters {
  query?: string;
  state?: string;
  type?: College["type"];
  locale?: College["locale"];
  size?: College["size"];
  program?: string;
  maxTuition?: number;
  minAcceptanceRate?: number;
  maxAcceptanceRate?: number;
  sortBy?: "name" | "acceptanceRate" | "tuitionInState" | "graduationRate4yr" | "graduationRate6yr" | "medianEarnings10yr";
  sortOrder?: "asc" | "desc";
  page?: number;
}
