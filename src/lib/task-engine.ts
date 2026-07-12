// ─── Task Engine — Generates prioritized actions from student state ──

import type { StudentGraph, CollegeApplication } from "@/types/student-graph";

// ─── Types ───────────────────────────────────────────────────────

export type TaskUrgency = "critical" | "high" | "medium" | "low" | "suggestion";

export type TaskCategory =
  | "deadline"
  | "essay"
  | "recommendation"
  | "profile"
  | "fafsa"
  | "scholarship"
  | "test-prep"
  | "general";

export interface Task {
  id: string;
  title: string;
  description: string;
  urgency: TaskUrgency;
  category: TaskCategory;
  /** Days until deadline (null = no deadline) */
  daysUntilDeadline: number | null;
  /** Estimated minutes to complete */
  estimatedMinutes: number;
  /** Where this task links to */
  href: string;
  /** College this task relates to (null = general) */
  collegeId: string | null;
  collegeName: string | null;
}

export interface TaskSummary {
  tasks: Task[];
  /** Tasks due this week */
  dueThisWeek: Task[];
  /** Overall application progress 0-100 */
  overallProgress: number;
  /** Per-college progress */
  collegeProgress: { collegeId: string; collegeName: string; progress: number; deadline: string }[];
  /** Next deadline info */
  nextDeadline: { collegeName: string; daysLeft: number } | null;
}

// ─── Constants ───────────────────────────────────────────────────

const MS_PER_DAY = 86_400_000;

/** FAFSA opens October 1 each year */
const FAFSA_OPEN_MONTH = 9; // 0-indexed: October = 9
const FAFSA_OPEN_DAY = 1;

/** CSSFA (Texas) priority deadline is typically January 15 */
const CSSFA_PRIORITY_MONTH = 0; // January
const CSSFA_PRIORITY_DAY = 15;

// ─── Helpers ─────────────────────────────────────────────────────

function daysBetween(a: Date, b: Date): number {
  return Math.ceil((b.getTime() - a.getTime()) / MS_PER_DAY);
}

function parseDeadline(deadline: string, referenceYear: number): Date | null {
  if (!deadline) return null;
  // Handle formats like "January 15", "December 1", "Rolling", "N/A"
  if (/rolling|n\/a|none/i.test(deadline)) return null;

  const date = new Date(`${deadline} ${referenceYear}`);
  if (isNaN(date.getTime())) return null;

  // If the date is more than 3 months in the past, try next year
  if (daysBetween(date, new Date()) > 90) {
    const nextYear = new Date(`${deadline} ${referenceYear + 1}`);
    if (!isNaN(nextYear.getTime())) return nextYear;
  }

  return date;
}

function urgencyFromDays(days: number): TaskUrgency {
  if (days <= 0) return "critical";
  if (days <= 7) return "critical";
  if (days <= 21) return "high";
  if (days <= 60) return "medium";
  return "low";
}

function urgencyLabel(urgency: TaskUrgency): string {
  switch (urgency) {
    case "critical": return "⚠️";
    case "high": return "🔴";
    case "medium": return "🟡";
    case "low": return "🟢";
    case "suggestion": return "💡";
  }
}

/** Estimate completion percentage for a college application */
function collegeApplicationProgress(college: CollegeApplication): number {
  let score = 0;
  let max = 0;

  // Status contributes (0-30 points)
  max += 30;
  const statusScores: Record<string, number> = {
    "researching": 5,
    "planning": 10,
    "in-progress": 20,
    "ready-to-submit": 30,
    "submitted": 30,
    "deferred": 30,
    "accepted": 30,
    "waitlisted": 30,
    "rejected": 30,
    "enrolled": 30,
  };
  score += statusScores[college.status] ?? 0;

  // Essays (0-30 points)
  max += 30;
  if (college.essays.length > 0) {
    score += Math.min(college.essays.length * 10, 30);
  }

  // Recommendation (0-20 points)
  max += 20;
  if (college.recommendationStatus === "submitted") {
    score += 20;
  } else if (college.recommendationStatus === "requested") {
    score += 10;
  }

  // Interview (0-10 points)
  max += 10;
  if (college.interviewStatus === "completed" || college.interviewStatus === "waived") {
    score += 10;
  } else if (college.interviewStatus === "scheduled") {
    score += 5;
  }

  // Notes (0-10 points — indicates engagement)
  max += 10;
  if (college.notes && college.notes.length > 10) {
    score += 10;
  }

  return max === 0 ? 0 : Math.round((score / max) * 100);
}

/** Calculate overall application progress across all colleges */
function overallProgress(graph: StudentGraph): number {
  if (graph.colleges.length === 0) {
    // No colleges yet — base on profile completeness
    return profileProgress(graph);
  }

  const collegeProgresses = graph.colleges.map(collegeApplicationProgress);
  const avgCollegeProgress = collegeProgresses.reduce((a, b) => a + b, 0) / collegeProgresses.length;

  // Blend: 40% profile, 60% college applications
  return Math.round(profileProgress(graph) * 0.4 + avgCollegeProgress * 0.6);
}

function profileProgress(graph: StudentGraph): number {
  let score = 0;
  let max = 0;

  // Identity
  max += 10;
  if (graph.firstName) score += 10;

  // Track
  max += 5;
  if (graph.track && graph.track !== "undecided") score += 5;

  // GPA
  max += 10;
  if (graph.gpa > 0) score += 10;

  // Test scores
  max += 10;
  if (graph.satMath > 0 || graph.satReading > 0 || graph.actComposite > 0) score += 10;

  // Intended major
  max += 10;
  if (graph.intendedMajor) score += 10;

  // Activities
  max += 15;
  score += Math.min(graph.extracurriculars.length * 5, 15);

  // Awards
  max += 10;
  score += Math.min(graph.awards.length * 5, 10);

  // AP/IB courses
  max += 10;
  const advancedCount = graph.apCourses.length + graph.ibCourses.length + graph.honorsCourses.length;
  score += Math.min(advancedCount * 3, 10);

  // Dream schools
  max += 10;
  if (graph.dreamSchools.length > 0) score += 10;

  // Interests
  max += 10;
  if (graph.interests.length > 0) score += 10;

  return max === 0 ? 0 : Math.round((score / max) * 100);
}

// ─── Task Generators ─────────────────────────────────────────────

function generateDeadlineTasks(graph: StudentGraph, now: Date): Task[] {
  const tasks: Task[] = [];

  for (const college of graph.colleges) {
    const deadline = parseDeadline(college.deadline, now.getFullYear());
    if (!deadline) continue;

    const daysLeft = daysBetween(now, deadline);
    if (daysLeft < 0) continue; // Past deadline

    const progress = collegeApplicationProgress(college);

    // Urgent if deadline is close and application is incomplete
    if (daysLeft <= 21 && progress < 80) {
      const urgency = urgencyFromDays(daysLeft);
      tasks.push({
        id: `deadline-${college.id}`,
        title: `${college.collegeName} deadline in ${daysLeft} days`,
        description: `Your ${college.collegeName} application is ${progress}% complete. Focus on finishing remaining requirements before the deadline.`,
        urgency,
        category: "deadline",
        daysUntilDeadline: daysLeft,
        estimatedMinutes: daysLeft <= 7 ? 60 : 30,
        href: `/saved`,
        collegeId: college.collegeId,
        collegeName: college.collegeName,
      });
    }
  }

  return tasks;
}

function generateEssayTasks(graph: StudentGraph, now: Date): Task[] {
  const tasks: Task[] = [];

  for (const college of graph.colleges) {
    const deadline = parseDeadline(college.deadline, now.getFullYear());
    const daysLeft = deadline ? daysBetween(now, deadline) : null;

    // Skip if deadline passed or is very far away
    if (daysLeft !== null && (daysLeft < 0 || daysLeft > 90)) continue;

    const hasEssays = college.essays.length > 0;
    const hasInProgress = graph.essays.some(
      (e) => college.essays.includes(e.id) && (e.status === "in-progress" || e.status === "draft")
    );

    if (!hasEssays) {
      tasks.push({
        id: `essay-start-${college.id}`,
        title: `Start essay for ${college.collegeName}`,
        description: `Begin drafting your ${college.collegeName} supplemental essay. Most students spend 2-3 hours on a strong draft.`,
        urgency: daysLeft !== null && daysLeft <= 30 ? "high" : "medium",
        category: "essay",
        daysUntilDeadline: daysLeft,
        estimatedMinutes: 45,
        href: `/saved`,
        collegeId: college.collegeId,
        collegeName: college.collegeName,
      });
    } else if (!hasInProgress && college.essays.length > 0) {
      // Has essays but none in progress — might need revision
      const allFinal = college.essays.every((eid) => {
        const essay = graph.essays.find((e) => e.id === eid);
        return essay?.status === "final";
      });

      if (!allFinal) {
        tasks.push({
          id: `essay-review-${college.id}`,
          title: `Review ${college.collegeName} essay`,
          description: `Review and polish your ${college.collegeName} essay draft. Check for clarity, authenticity, and prompt alignment.`,
          urgency: daysLeft !== null && daysLeft <= 14 ? "high" : "medium",
          category: "essay",
          daysUntilDeadline: daysLeft,
          estimatedMinutes: 30,
          href: `/saved`,
          collegeId: college.collegeId,
          collegeName: college.collegeName,
        });
      }
    }
  }

  // Personal statement check
  const hasPersonalStatement = graph.essays.some(
    (e) => !e.collegeId && (e.status === "in-progress" || e.status === "draft" || e.status === "final")
  );
  if (!hasPersonalStatement && graph.colleges.length > 0) {
    const nearestDeadline = graph.colleges
      .map((c) => parseDeadline(c.deadline, now.getFullYear()))
      .filter((d): d is Date => d !== null)
      .sort((a, b) => a.getTime() - b.getTime())[0];

    const daysToNearest = nearestDeadline ? daysBetween(now, nearestDeadline) : null;

    if (daysToNearest === null || daysToNearest > 14) {
      tasks.push({
        id: "essay-personal-statement",
        title: "Start your personal statement",
        description: "The Common App personal statement is used by almost every college. Start brainstorming and drafting early.",
        urgency: "medium",
        category: "essay",
        daysUntilDeadline: daysToNearest,
        estimatedMinutes: 60,
        href: `/saved`,
        collegeId: null,
        collegeName: null,
      });
    }
  }

  return tasks;
}

function generateRecommendationTasks(graph: StudentGraph, now: Date): Task[] {
  const tasks: Task[] = [];

  for (const college of graph.colleges) {
    if (college.recommendationStatus === "submitted") continue;

    const deadline = parseDeadline(college.deadline, now.getFullYear());
    const daysLeft = deadline ? daysBetween(now, deadline) : null;

    // Don't generate if deadline is far away
    if (daysLeft !== null && daysLeft > 60) continue;

    if (college.recommendationStatus === "not-started") {
      tasks.push({
        id: `rec-request-${college.id}`,
        title: `Request recommendation for ${college.collegeName}`,
        description: `Ask a teacher or counselor for a recommendation letter. Give them at least 3-4 weeks before the deadline.`,
        urgency: daysLeft !== null && daysLeft <= 30 ? "high" : "medium",
        category: "recommendation",
        daysUntilDeadline: daysLeft,
        estimatedMinutes: 10,
        href: `/saved`,
        collegeId: college.collegeId,
        collegeName: college.collegeName,
      });
    } else if (college.recommendationStatus === "requested") {
      tasks.push({
        id: `rec-followup-${college.id}`,
        title: `Follow up on recommendation for ${college.collegeName}`,
        description: `Check in with your recommender to ensure they're on track to submit before the deadline.`,
        urgency: daysLeft !== null && daysLeft <= 14 ? "high" : "medium",
        category: "recommendation",
        daysUntilDeadline: daysLeft,
        estimatedMinutes: 5,
        href: `/saved`,
        collegeId: college.collegeId,
        collegeName: college.collegeName,
      });
    }
  }

  return tasks;
}

function generateProfileTasks(graph: StudentGraph): Task[] {
  const tasks: Task[] = [];

  if (!graph.firstName) {
    tasks.push({
      id: "profile-name",
      title: "Complete your name",
      description: "Add your first and last name to personalize your experience.",
      urgency: "high",
      category: "profile",
      daysUntilDeadline: null,
      estimatedMinutes: 2,
      href: `/profile`,
      collegeId: null,
      collegeName: null,
    });
  }

  if (graph.gpa === 0) {
    tasks.push({
      id: "profile-gpa",
      title: "Add your GPA",
      description: "Your GPA helps us recommend colleges that match your academic profile.",
      urgency: "high",
      category: "profile",
      daysUntilDeadline: null,
      estimatedMinutes: 2,
      href: `/profile`,
      collegeId: null,
      collegeName: null,
    });
  }

  if (graph.satMath === 0 && graph.satReading === 0 && graph.actComposite === 0) {
    tasks.push({
      id: "profile-scores",
      title: "Add test scores",
      description: "Enter your SAT or ACT scores. Many colleges consider these in admissions.",
      urgency: "medium",
      category: "test-prep",
      daysUntilDeadline: null,
      estimatedMinutes: 2,
      href: `/profile`,
      collegeId: null,
      collegeName: null,
    });
  }

  if (graph.extracurriculars.length === 0) {
    tasks.push({
      id: "profile-activities",
      title: "Add your activities",
      description: "Clubs, sports, volunteer work, jobs — colleges want to see what you do outside class.",
      urgency: "medium",
      category: "profile",
      daysUntilDeadline: null,
      estimatedMinutes: 15,
      href: `/profile`,
      collegeId: null,
      collegeName: null,
    });
  }

  if (!graph.intendedMajor) {
    tasks.push({
      id: "profile-major",
      title: "Choose an intended major",
      description: "Selecting a field of study helps us recommend relevant colleges and opportunities.",
      urgency: "low",
      category: "general",
      daysUntilDeadline: null,
      estimatedMinutes: 3,
      href: `/degrees`,
      collegeId: null,
      collegeName: null,
    });
  }

  return tasks;
}

function generateFAFSATasks(graph: StudentGraph, now: Date): Task[] {
  const tasks: Task[] = [];

  const currentMonth = now.getMonth();
  const currentDay = now.getDate();

  // FAFSA opens October 1 — start generating prep tasks in September
  const isPrepWindow = currentMonth === 8; // September
  const isOpenWindow = currentMonth >= 9; // October or later
  const isUrgentWindow = currentMonth === 10 || currentMonth === 11; // Nov-Dec

  if (isPrepWindow) {
    tasks.push({
      id: "fafsa-prep",
      title: "Prepare for FAFSA",
      description: "FAFSA opens October 1. Gather tax documents, FSA IDs, and financial info now.",
      urgency: "high",
      category: "fafsa",
      daysUntilDeadline: 30 - currentDay,
      estimatedMinutes: 30,
      href: `/financial`,
      collegeId: null,
      collegeName: null,
    });
  }

  if (isOpenWindow && !isPrepWindow) {
    // Check if student has any FAFSA-related tasks completed
    const hasFAFSATask = graph.timelineEvents.some(
      (e) => e.title.toLowerCase().includes("fafsa") && e.completed
    );

    if (!hasFAFSATask) {
      tasks.push({
        id: "fafsa-complete",
        title: "Complete FAFSA",
        description: "The FAFSA determines your eligibility for federal financial aid. Complete it as soon as possible after October 1.",
        urgency: isUrgentWindow ? "high" : "medium",
        category: "fafsa",
        daysUntilDeadline: null,
        estimatedMinutes: 60,
        href: `/financial`,
        collegeId: null,
        collegeName: null,
      });
    }
  }

  // Texas CSSFA priority deadline (Jan 15)
  if (currentMonth >= 9) {
    const cssfaDeadline = new Date(now.getFullYear() + 1, CSSFA_PRIORITY_MONTH, CSSFA_PRIORITY_DAY);
    const daysToCSSFA = daysBetween(now, cssfaDeadline);

    if (daysToCSSFA > 0 && daysToCSSFA <= 120) {
      const hasCSSFA = graph.timelineEvents.some(
        (e) => e.title.toLowerCase().includes("cssfa") && e.completed
      );

      if (!hasCSSFA) {
        tasks.push({
          id: "cssfa-priority",
          title: "Texas CSSFA priority deadline",
          description: "The Texas Application for State Financial Aid priority deadline is January 15. Apply early for maximum aid consideration.",
          urgency: daysToCSSFA <= 30 ? "high" : "medium",
          category: "fafsa",
          daysUntilDeadline: daysToCSSFA,
          estimatedMinutes: 45,
          href: `/financial`,
          collegeId: null,
          collegeName: null,
        });
      }
    }
  }

  return tasks;
}

function generateScholarshipTasks(graph: StudentGraph, now: Date): Task[] {
  const tasks: Task[] = [];

  for (const scholarship of graph.scholarships) {
    if (scholarship.status === "submitted" || scholarship.status === "awarded" || scholarship.status === "rejected") {
      continue;
    }

    const deadline = parseDeadline(scholarship.deadline, now.getFullYear());
    if (!deadline) continue;

    const daysLeft = daysBetween(now, deadline);
    if (daysLeft < 0 || daysLeft > 60) continue;

    tasks.push({
      id: `scholarship-${scholarship.id}`,
      title: `${scholarship.name} — ${daysLeft} days left`,
      description: `${scholarship.provider} scholarship ($${scholarship.amount.toLocaleString()}). ${scholarship.essayRequired ? "Essay required." : "No essay required."}`,
      urgency: urgencyFromDays(daysLeft),
      category: "scholarship",
      daysUntilDeadline: daysLeft,
      estimatedMinutes: scholarship.essayRequired ? 60 : 20,
      href: `/financial`,
      collegeId: null,
      collegeName: null,
    });
  }

  return tasks;
}

function generateGeneralTasks(graph: StudentGraph): Task[] {
  const tasks: Task[] = [];

  if (graph.colleges.length === 0 && graph.hasCompletedOnboarding) {
    tasks.push({
      id: "general-explore",
      title: "Add your first colleges",
      description: "Start building your college list. Search for schools that match your interests and goals.",
      urgency: "medium",
      category: "general",
      daysUntilDeadline: null,
      estimatedMinutes: 10,
      href: `/colleges`,
      collegeId: null,
      collegeName: null,
    });
  }

  if (graph.colleges.length > 0 && graph.colleges.length < 5) {
    tasks.push({
      id: "general-more-colleges",
      title: "Expand your college list",
      description: `You have ${graph.colleges.length} colleges. Most students apply to 6-10 schools across reach, match, and safety categories.`,
      urgency: "low",
      category: "general",
      daysUntilDeadline: null,
      estimatedMinutes: 15,
      href: `/colleges`,
      collegeId: null,
      collegeName: null,
    });
  }

  return tasks;
}

// ─── Main Engine ─────────────────────────────────────────────────

export function generateTasks(graph: StudentGraph, now: Date = new Date()): TaskSummary {
  const allTasks: Task[] = [
    ...generateDeadlineTasks(graph, now),
    ...generateEssayTasks(graph, now),
    ...generateRecommendationTasks(graph, now),
    ...generateProfileTasks(graph),
    ...generateFAFSATasks(graph, now),
    ...generateScholarshipTasks(graph, now),
    ...generateGeneralTasks(graph),
  ];

  // Deduplicate by ID (prefer higher urgency)
  const urgencyOrder: Record<TaskUrgency, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
    suggestion: 4,
  };

  const deduped = new Map<string, Task>();
  for (const task of allTasks) {
    const existing = deduped.get(task.id);
    if (!existing || urgencyOrder[task.urgency] < urgencyOrder[existing.urgency]) {
      deduped.set(task.id, task);
    }
  }

  // Sort: critical first, then by days until deadline (soonest first), then by category
  const sorted = Array.from(deduped.values()).sort((a, b) => {
    // Urgency first
    const urgDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    if (urgDiff !== 0) return urgDiff;

    // Then by days until deadline (null = last)
    const aDays = a.daysUntilDeadline ?? 9999;
    const bDays = b.daysUntilDeadline ?? 9999;
    return aDays - bDays;
  });

  // Due this week (7 days)
  const dueThisWeek = sorted.filter(
    (t) => t.daysUntilDeadline !== null && t.daysUntilDeadline <= 7 && t.daysUntilDeadline >= 0
  );

  // Per-college progress
  const collegeProgress = graph.colleges.map((c) => ({
    collegeId: c.collegeId,
    collegeName: c.collegeName,
    progress: collegeApplicationProgress(c),
    deadline: c.deadline,
  }));

  // Next deadline
  const withDeadlines = graph.colleges
    .map((c) => {
      const d = parseDeadline(c.deadline, now.getFullYear());
      return d ? { collegeName: c.collegeName, daysLeft: daysBetween(now, d) } : null;
    })
    .filter((d): d is { collegeName: string; daysLeft: number } => d !== null && d.daysLeft > 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return {
    tasks: sorted,
    dueThisWeek,
    overallProgress: overallProgress(graph),
    collegeProgress,
    nextDeadline: withDeadlines[0] ?? null,
  };
}

// ─── Formatting Helpers ──────────────────────────────────────────

export function urgencyColor(urgency: TaskUrgency): string {
  switch (urgency) {
    case "critical": return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20";
    case "high": return "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20";
    case "medium": return "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20";
    case "low": return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20";
    case "suggestion": return "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20";
  }
}

export function categoryIcon(category: TaskCategory): string {
  switch (category) {
    case "deadline": return "⏰";
    case "essay": return "✍️";
    case "recommendation": return "📬";
    case "profile": return "👤";
    case "fafsa": return "💰";
    case "scholarship": return "🏆";
    case "test-prep": return "📝";
    case "general": return "🔍";
  }
}

export function categoryLabel(category: TaskCategory): string {
  switch (category) {
    case "deadline": return "Deadline";
    case "essay": return "Essay";
    case "recommendation": return "Recommendation";
    case "profile": return "Profile";
    case "fafsa": return "Financial Aid";
    case "scholarship": return "Scholarship";
    case "test-prep": return "Test Prep";
    case "general": return "General";
  }
}

/** Generate a plain-text summary for the AI mentor context */
export function tasksToAIContext(summary: TaskSummary): string {
  const lines: string[] = [];

  lines.push(`Overall application progress: ${summary.overallProgress}%`);

  if (summary.nextDeadline) {
    lines.push(`Next deadline: ${summary.nextDeadline.collegeName} in ${summary.nextDeadline.daysLeft} days`);
  }

  if (summary.collegeProgress.length > 0) {
    lines.push("\nCollege progress:");
    for (const cp of summary.collegeProgress) {
      lines.push(`  - ${cp.collegeName}: ${cp.progress}% complete (deadline: ${cp.deadline})`);
    }
  }

  if (summary.tasks.length > 0) {
    lines.push(`\nTop priorities (${summary.tasks.length} tasks total):`);
    for (const task of summary.tasks.slice(0, 5)) {
      const deadlineNote = task.daysUntilDeadline !== null
        ? ` [${task.daysUntilDeadline} days left]`
        : "";
      lines.push(`  - [${task.urgency}] ${task.title}${deadlineNote} (~${task.estimatedMinutes} min)`);
    }
  }

  if (summary.dueThisWeek.length > 0) {
    lines.push(`\n${summary.dueThisWeek.length} task(s) due this week!`);
  }

  return lines.join("\n");
}
