// ─── Student Graph — Core Data Model ─────────────────────────────

export type Track = "college" | "career" | "research" | "startup" | "undecided";
export type GradeLevel =
  | "8th"
  | "freshman"
  | "sophomore"
  | "junior"
  | "senior"
  | "gap-year"
  | "college";

export type OnboardingStage =
  | "welcome"
  | "goal-selection"
  | "grade-selection"
  | "dream-school"
  | "ai-conversation"
  | "dashboard";

export type UserRole = "student" | "parent" | "counselor";

// ─── Sub-types ────────────────────────────────────────────────────

export interface Extracurricular {
  id: string;
  name: string;
  type: "club" | "sport" | "volunteer" | "work" | "research" | "art" | "other";
  years: number;
  hoursPerWeek: number;
  leadership: boolean;
  description: string;
}

export interface Award {
  id: string;
  name: string;
  level: "school" | "regional" | "state" | "national" | "international";
  year: number;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
}

export interface Research {
  id: string;
  title: string;
  field: string;
  description: string;
  supervisor?: string;
  institution?: string;
  publicationUrl?: string;
  startDate: string;
  endDate?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expires?: string;
  url?: string;
}

export interface Skill {
  name: string;
  category: "technical" | "language" | "soft" | "creative";
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface Essay {
  id: string;
  title: string;
  prompt: string;
  content: string;
  wordCount: number;
  collegeId?: string;
  status: "draft" | "in-progress" | "review" | "final";
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  id: string;
  name: string;
  target: string; // e.g. "Software Engineering"
  content: string; // JSON structured resume
  createdAt: string;
}

export interface PortfolioLink {
  id: string;
  title: string;
  url: string;
  type: "github" | "website" | "behance" | "dribbble" | "other";
}

export interface CollegeApplication {
  id: string;
  collegeId: string;
  collegeName: string;
  status:
    | "researching"
    | "planning"
    | "in-progress"
    | "submitted"
    | "deferred"
    | "accepted"
    | "waitlisted"
    | "rejected"
    | "enrolled";
  deadline: string;
  essays: string[]; // essay IDs
  recommendationStatus: "not-started" | "requested" | "submitted";
  interviewStatus: "not-scheduled" | "scheduled" | "completed" | "waived";
  notes: string;
}

export interface ScholarshipApplication {
  id: string;
  name: string;
  provider: string;
  amount: number;
  deadline: string;
  status: "saved" | "applying" | "submitted" | "awarded" | "rejected";
  essayRequired: boolean;
}

export interface Milestone {
  id: string;
  label: string;
  category:
    | "profile"
    | "academics"
    | "activities"
    | "essays"
    | "applications"
    | "scholarships";
  completed: boolean;
  completedAt?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "deadline" | "test" | "event" | "task" | "milestone";
  completed: boolean;
  expanded?: boolean;
  subtasks?: TimelineSubtask[];
}

export interface TimelineSubtask {
  id: string;
  label: string;
  completed: boolean;
}

export interface AIMemory {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  context?: string; // what prompted this conversation
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: "missing" | "deadline" | "suggestion" | "milestone" | "reminder";
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface NotificationPrefs {
  pushEnabled: boolean;
  emailEnabled: boolean;
  types: {
    missing: boolean;
    deadline: boolean;
    suggestion: boolean;
    milestone: boolean;
    reminder: boolean;
  };
}

export interface ImportSource {
  source: "common-app" | "transcript" | "resume" | "linkedin" | "github";
  importedAt: string;
  status: "pending" | "completed" | "failed";
}

// ─── Student Graph ────────────────────────────────────────────────

export interface StudentGraph {
  // Identity
  id: string;
  firstName: string;
  lastName: string;
  email: string;

  // Onboarding
  onboardingStage: OnboardingStage;
  hasCompletedOnboarding: boolean;
  track: Track;

  // Academics
  gradeLevel: GradeLevel;
  gradYear: number;
  gpa: number;
  gpaScale: 4.0 | 5.0 | 100;
  satMath: number;
  satReading: number;
  actComposite: number;
  classRank: number;
  classSize: number;
  apCourses: string[];
  ibCourses: string[];
  honorsCourses: string[];
  currentCourses: string[];

  // Interests & Goals
  intendedMajor: string;
  careerGoal: string;
  interests: string[];
  dreamSchools: string[];

  // Activities
  extracurriculars: Extracurricular[];
  awards: Award[];

  // Portfolio
  projects: Project[];
  research: Research[];
  certifications: Certification[];
  skills: Skill[];
  essays: Essay[];
  resumeVersions: Resume[];
  portfolioLinks: PortfolioLink[];

  // Applications
  colleges: CollegeApplication[];
  scholarships: ScholarshipApplication[];

  // AI Memory
  aiConversations: AIMemory[];

  // Progress
  milestones: Milestone[];
  timelineEvents: TimelineEvent[];

  // Daily
  dailyGoal: string;
  dailyGoalCompleted: boolean;
  dailyGoalDate: string;
  lastActiveDate: string;

  // Notifications
  notificationPreferences: NotificationPrefs;
  notifications: Notification[];

  // Access
  parents: string[];
  counselors: string[];
  role: UserRole;

  // Imports
  importSources: ImportSource[];

  // Meta
  createdAt: string;
  updatedAt: string;
}

// ─── Defaults ─────────────────────────────────────────────────────

export const EMPTY_STUDENT_GRAPH: StudentGraph = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",

  onboardingStage: "welcome",
  hasCompletedOnboarding: false,
  track: "undecided",

  gradeLevel: "freshman",
  gradYear: new Date().getFullYear() + 4,
  gpa: 0,
  gpaScale: 4.0,
  satMath: 0,
  satReading: 0,
  actComposite: 0,
  classRank: 0,
  classSize: 0,
  apCourses: [],
  ibCourses: [],
  honorsCourses: [],
  currentCourses: [],

  intendedMajor: "",
  careerGoal: "",
  interests: [],
  dreamSchools: [],

  extracurriculars: [],
  awards: [],

  projects: [],
  research: [],
  certifications: [],
  skills: [],
  essays: [],
  resumeVersions: [],
  portfolioLinks: [],

  colleges: [],
  scholarships: [],

  aiConversations: [],

  milestones: [],
  timelineEvents: [],

  dailyGoal: "",
  dailyGoalCompleted: false,
  dailyGoalDate: "",
  lastActiveDate: "",

  notificationPreferences: {
    pushEnabled: false,
    emailEnabled: false,
    types: {
      missing: true,
      deadline: true,
      suggestion: true,
      milestone: true,
      reminder: true,
    },
  },
  notifications: [],

  parents: [],
  counselors: [],
  role: "student",

  importSources: [],

  createdAt: "",
  updatedAt: "",
};
