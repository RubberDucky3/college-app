import { describe, it, expect } from "vitest";
import {
  generateTasks,
  tasksToAIContext,
  urgencyColor,
  categoryIcon,
  type TaskSummary,
} from "../task-engine";
import { EMPTY_STUDENT_GRAPH, type StudentGraph } from "@/types/student-graph";

// ─── Test Helpers ────────────────────────────────────────────────

function makeGraph(overrides: Partial<StudentGraph> = {}): StudentGraph {
  return { ...EMPTY_STUDENT_GRAPH, ...overrides };
}

function dateFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(days: number): string {
  const d = dateFromNow(days);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

// ─── Profile Tasks ───────────────────────────────────────────────

describe("profile tasks", () => {
  it("generates profile tasks when student has no data", () => {
    const graph = makeGraph({ hasCompletedOnboarding: true });
    const summary = generateTasks(graph);

    const profileTasks = summary.tasks.filter((t) => t.category === "profile");
    expect(profileTasks.length).toBeGreaterThan(0);

    // Should include name, GPA, scores, activities
    const titles = profileTasks.map((t) => t.title);
    expect(titles.some((t) => t.includes("name"))).toBe(true);
    expect(titles.some((t) => t.includes("GPA"))).toBe(true);
  });

  it("does not generate profile tasks when profile is complete", () => {
    const graph = makeGraph({
      firstName: "Jerome",
      gpa: 3.8,
      satMath: 700,
      satReading: 680,
      intendedMajor: "Computer Science",
      extracurriculars: [
        {
          id: "ec1",
          name: "Robotics Club",
          type: "club",
          years: 2,
          hoursPerWeek: 5,
          leadership: true,
          description: "Team lead",
        },
      ],
    });

    const summary = generateTasks(graph);
    const profileTasks = summary.tasks.filter(
      (t) => t.category === "profile" && t.id.startsWith("profile-")
    );
    expect(profileTasks.length).toBe(0);
  });
});

// ─── Deadline Tasks ──────────────────────────────────────────────

describe("deadline tasks", () => {
  it("generates urgent task when deadline is within 7 days", () => {
    const deadline = formatDate(5);
    const graph = makeGraph({
      colleges: [
        {
          id: "c1",
          collegeId: "utd",
          collegeName: "UT Dallas",
          status: "in-progress",
          deadline,
          essays: [],
          recommendationStatus: "not-started",
          interviewStatus: "not-scheduled",
          notes: "",
        },
      ],
    });

    const summary = generateTasks(graph);
    const deadlineTask = summary.tasks.find((t) => t.id === "deadline-c1");

    expect(deadlineTask).toBeDefined();
    expect(deadlineTask!.urgency).toBe("critical");
    expect(deadlineTask!.daysUntilDeadline).toBe(5);
  });

  it("generates high-urgency task when deadline is within 21 days", () => {
    const deadline = formatDate(15);
    const graph = makeGraph({
      colleges: [
        {
          id: "c1",
          collegeId: "utd",
          collegeName: "UT Dallas",
          status: "planning",
          deadline,
          essays: [],
          recommendationStatus: "not-started",
          interviewStatus: "not-scheduled",
          notes: "",
        },
      ],
    });

    const summary = generateTasks(graph);
    const deadlineTask = summary.tasks.find((t) => t.id === "deadline-c1");

    expect(deadlineTask).toBeDefined();
    expect(deadlineTask!.urgency).toBe("high");
  });

  it("does not generate deadline task when application is 80%+ complete", () => {
    const deadline = formatDate(10);
    const graph = makeGraph({
      colleges: [
        {
          id: "c1",
          collegeId: "utd",
          collegeName: "UT Dallas",
          status: "in-progress",
          deadline,
          essays: ["essay-1", "essay-2", "essay-3"],
          recommendationStatus: "submitted",
          interviewStatus: "completed",
          notes: "All materials submitted and verified.",
        },
      ],
      essays: [
        {
          id: "essay-1",
          title: "Personal Statement",
          prompt: "Tell us about yourself",
          content: "I am passionate about...",
          wordCount: 650,
          status: "final",
          createdAt: "2026-06-01",
          updatedAt: "2026-06-15",
        },
        {
          id: "essay-2",
          title: "Why UTD",
          prompt: "Why do you want to attend UTD?",
          content: "UTD is my top choice because...",
          wordCount: 400,
          status: "final",
          createdAt: "2026-06-01",
          updatedAt: "2026-06-15",
        },
        {
          id: "essay-3",
          title: "Community Essay",
          prompt: "Describe your community",
          content: "Growing up in Texas...",
          wordCount: 350,
          status: "final",
          createdAt: "2026-06-01",
          updatedAt: "2026-06-15",
        },
      ],
    });

    const summary = generateTasks(graph);
    const deadlineTask = summary.tasks.find((t) => t.id === "deadline-c1");

    // Should not generate deadline task since application is highly complete
    expect(deadlineTask).toBeUndefined();
  });

  it("skips past deadlines", () => {
    const deadline = formatDate(-5);
    const graph = makeGraph({
      colleges: [
        {
          id: "c1",
          collegeId: "utd",
          collegeName: "UT Dallas",
          status: "in-progress",
          deadline,
          essays: [],
          recommendationStatus: "not-started",
          interviewStatus: "not-scheduled",
          notes: "",
        },
      ],
    });

    const summary = generateTasks(graph);
    const deadlineTask = summary.tasks.find((t) => t.id === "deadline-c1");
    expect(deadlineTask).toBeUndefined();
  });
});

// ─── Essay Tasks ─────────────────────────────────────────────────

describe("essay tasks", () => {
  it("generates essay start task when college has no essays", () => {
    const deadline = formatDate(30);
    const graph = makeGraph({
      colleges: [
        {
          id: "c1",
          collegeId: "utd",
          collegeName: "UT Dallas",
          status: "planning",
          deadline,
          essays: [],
          recommendationStatus: "not-started",
          interviewStatus: "not-scheduled",
          notes: "",
        },
      ],
    });

    const summary = generateTasks(graph);
    const essayTask = summary.tasks.find((t) => t.id === "essay-start-c1");

    expect(essayTask).toBeDefined();
    expect(essayTask!.category).toBe("essay");
    expect(essayTask!.title).toContain("UT Dallas");
  });

  it("generates personal statement task when no personal statement exists", () => {
    const deadline = formatDate(60);
    const graph = makeGraph({
      colleges: [
        {
          id: "c1",
          collegeId: "utd",
          collegeName: "UT Dallas",
          status: "planning",
          deadline,
          essays: ["essay-1"],
          recommendationStatus: "not-started",
          interviewStatus: "not-scheduled",
          notes: "",
        },
      ],
      essays: [
        {
          id: "essay-1",
          title: "Why UTD",
          prompt: "Why UTD?",
          content: "Because...",
          wordCount: 200,
          collegeId: "utd",
          status: "draft",
          createdAt: "2026-06-01",
          updatedAt: "2026-06-01",
        },
      ],
    });

    const summary = generateTasks(graph);
    const personalStatement = summary.tasks.find((t) => t.id === "essay-personal-statement");

    expect(personalStatement).toBeDefined();
    expect(personalStatement!.title).toContain("personal statement");
  });
});

// ─── Recommendation Tasks ────────────────────────────────────────

describe("recommendation tasks", () => {
  it("generates recommendation request task", () => {
    const deadline = formatDate(45);
    const graph = makeGraph({
      colleges: [
        {
          id: "c1",
          collegeId: "utd",
          collegeName: "UT Dallas",
          status: "in-progress",
          deadline,
          essays: [],
          recommendationStatus: "not-started",
          interviewStatus: "not-scheduled",
          notes: "",
        },
      ],
    });

    const summary = generateTasks(graph);
    const recTask = summary.tasks.find((t) => t.id === "rec-request-c1");

    expect(recTask).toBeDefined();
    expect(recTask!.category).toBe("recommendation");
    expect(recTask!.title).toContain("recommendation");
  });

  it("generates follow-up task when recommendation was requested", () => {
    const deadline = formatDate(20);
    const graph = makeGraph({
      colleges: [
        {
          id: "c1",
          collegeId: "utd",
          collegeName: "UT Dallas",
          status: "in-progress",
          deadline,
          essays: [],
          recommendationStatus: "requested",
          interviewStatus: "not-scheduled",
          notes: "",
        },
      ],
    });

    const summary = generateTasks(graph);
    const followupTask = summary.tasks.find((t) => t.id === "rec-followup-c1");

    expect(followupTask).toBeDefined();
    expect(followupTask!.title).toContain("Follow up");
  });

  it("does not generate recommendation task when already submitted", () => {
    const deadline = formatDate(30);
    const graph = makeGraph({
      colleges: [
        {
          id: "c1",
          collegeId: "utd",
          collegeName: "UT Dallas",
          status: "in-progress",
          deadline,
          essays: [],
          recommendationStatus: "submitted",
          interviewStatus: "not-scheduled",
          notes: "",
        },
      ],
    });

    const summary = generateTasks(graph);
    const recTasks = summary.tasks.filter(
      (t) => t.id.startsWith("rec-") && t.collegeId === "c1"
    );
    expect(recTasks.length).toBe(0);
  });
});

// ─── FAFSA Tasks ─────────────────────────────────────────────────

describe("FAFSA tasks", () => {
  it("generates FAFSA prep task in September", () => {
    // Mock September
    const september = new Date(2026, 8, 15); // September 15, 2026
    const graph = makeGraph({ hasCompletedOnboarding: true });

    const summary = generateTasks(graph, september);
    const fafsaTask = summary.tasks.find((t) => t.id === "fafsa-prep");

    expect(fafsaTask).toBeDefined();
    expect(fafsaTask!.category).toBe("fafsa");
  });

  it("generates FAFSA completion task in October+", () => {
    const october = new Date(2026, 9, 15); // October 15, 2026
    const graph = makeGraph({ hasCompletedOnboarding: true });

    const summary = generateTasks(graph, october);
    const fafsaTask = summary.tasks.find((t) => t.id === "fafsa-complete");

    expect(fafsaTask).toBeDefined();
    expect(fafsaTask!.title).toContain("FAFSA");
  });
});

// ─── General Tasks ───────────────────────────────────────────────

describe("general tasks", () => {
  it("suggests adding colleges when list is empty", () => {
    const graph = makeGraph({ hasCompletedOnboarding: true });
    const summary = generateTasks(graph);

    const exploreTask = summary.tasks.find((t) => t.id === "general-explore");
    expect(exploreTask).toBeDefined();
    expect(exploreTask!.href).toBe("/colleges");
  });

  it("suggests expanding list when under 5 colleges", () => {
    const graph = makeGraph({
      hasCompletedOnboarding: true,
      colleges: [
        {
          id: "c1",
          collegeId: "utd",
          collegeName: "UT Dallas",
          status: "researching",
          deadline: "January 15",
          essays: [],
          recommendationStatus: "not-started",
          interviewStatus: "not-scheduled",
          notes: "",
        },
      ],
    });

    const summary = generateTasks(graph);
    const expandTask = summary.tasks.find((t) => t.id === "general-more-colleges");
    expect(expandTask).toBeDefined();
  });
});

// ─── Sorting & Priority ─────────────────────────────────────────

describe("task sorting", () => {
  it("sorts critical tasks before high tasks", () => {
    const graph = makeGraph({
      colleges: [
        {
          id: "c1",
          collegeId: "utd",
          collegeName: "UT Dallas",
          status: "in-progress",
          deadline: formatDate(3), // critical
          essays: [],
          recommendationStatus: "not-started",
          interviewStatus: "not-scheduled",
          notes: "",
        },
        {
          id: "c2",
          collegeId: "tam",
          collegeName: "Texas A&M",
          status: "planning",
          deadline: formatDate(15), // high
          essays: [],
          recommendationStatus: "not-started",
          interviewStatus: "not-scheduled",
          notes: "",
        },
      ],
    });

    const summary = generateTasks(graph);
    const criticalIdx = summary.tasks.findIndex(
      (t) => t.urgency === "critical"
    );
    const highIdx = summary.tasks.findIndex((t) => t.urgency === "high");

    // Critical should come before high (or high might not exist if filtered)
    if (criticalIdx >= 0 && highIdx >= 0) {
      expect(criticalIdx).toBeLessThan(highIdx);
    }
  });
});

// ─── Progress Calculation ────────────────────────────────────────

describe("progress calculation", () => {
  it("calculates 0% for empty profile", () => {
    const graph = makeGraph();
    const summary = generateTasks(graph);
    expect(summary.overallProgress).toBe(0);
  });

  it("calculates higher progress with more data", () => {
    const emptyGraph = makeGraph();
    const emptySummary = generateTasks(emptyGraph);

    const fullGraph = makeGraph({
      firstName: "Jerome",
      track: "college",
      gpa: 3.8,
      satMath: 700,
      satReading: 680,
      intendedMajor: "CS",
      interests: ["programming"],
      dreamSchools: ["UT Austin"],
      extracurriculars: [
        {
          id: "ec1",
          name: "Robotics",
          type: "club",
          years: 2,
          hoursPerWeek: 5,
          leadership: true,
          description: "Lead",
        },
      ],
      awards: [
        {
          id: "a1",
          name: "State Fair",
          level: "state",
          year: 2026,
          description: "Winner",
        },
      ],
      colleges: [
        {
          id: "c1",
          collegeId: "utd",
          collegeName: "UT Dallas",
          status: "in-progress",
          deadline: "January 15",
          essays: ["essay-1"],
          recommendationStatus: "submitted",
          interviewStatus: "completed",
          notes: "Application materials ready for submission.",
        },
      ],
      essays: [
        {
          id: "essay-1",
          title: "PS",
          prompt: "Tell us",
          content: "I am...",
          wordCount: 650,
          status: "final",
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
      ],
    });

    const fullSummary = generateTasks(fullGraph);
    expect(fullSummary.overallProgress).toBeGreaterThan(emptySummary.overallProgress);
    expect(fullSummary.overallProgress).toBeGreaterThan(50);
  });
});

// ─── College Progress ────────────────────────────────────────────

describe("college progress", () => {
  it("reports per-college progress", () => {
    const graph = makeGraph({
      colleges: [
        {
          id: "c1",
          collegeId: "utd",
          collegeName: "UT Dallas",
          status: "in-progress",
          deadline: "January 15",
          essays: ["essay-1"],
          recommendationStatus: "requested",
          interviewStatus: "not-scheduled",
          notes: "Working on application.",
        },
      ],
    });

    const summary = generateTasks(graph);
    expect(summary.collegeProgress.length).toBe(1);
    expect(summary.collegeProgress[0].collegeName).toBe("UT Dallas");
    expect(summary.collegeProgress[0].progress).toBeGreaterThan(0);
  });
});

// ─── Next Deadline ───────────────────────────────────────────────

describe("next deadline", () => {
  it("finds the nearest upcoming deadline", () => {
    const graph = makeGraph({
      colleges: [
        {
          id: "c1",
          collegeId: "utd",
          collegeName: "UT Dallas",
          status: "planning",
          deadline: formatDate(30),
          essays: [],
          recommendationStatus: "not-started",
          interviewStatus: "not-scheduled",
          notes: "",
        },
        {
          id: "c2",
          collegeId: "tam",
          collegeName: "Texas A&M",
          status: "planning",
          deadline: formatDate(10),
          essays: [],
          recommendationStatus: "not-started",
          interviewStatus: "not-scheduled",
          notes: "",
        },
      ],
    });

    const summary = generateTasks(graph);
    expect(summary.nextDeadline).toBeDefined();
    expect(summary.nextDeadline!.collegeName).toBe("Texas A&M");
    expect(summary.nextDeadline!.daysLeft).toBe(10);
  });
});

// ─── Due This Week ───────────────────────────────────────────────

describe("due this week", () => {
  it("identifies tasks due within 7 days", () => {
    const graph = makeGraph({
      colleges: [
        {
          id: "c1",
          collegeId: "utd",
          collegeName: "UT Dallas",
          status: "in-progress",
          deadline: formatDate(5),
          essays: [],
          recommendationStatus: "not-started",
          interviewStatus: "not-scheduled",
          notes: "",
        },
      ],
    });

    const summary = generateTasks(graph);
    expect(summary.dueThisWeek.length).toBeGreaterThan(0);
  });
});

// ─── AI Context ──────────────────────────────────────────────────

describe("tasksToAIContext", () => {
  it("generates readable context string", () => {
    const graph = makeGraph({
      firstName: "Jerome",
      colleges: [
        {
          id: "c1",
          collegeId: "utd",
          collegeName: "UT Dallas",
          status: "in-progress",
          deadline: formatDate(10),
          essays: [],
          recommendationStatus: "not-started",
          interviewStatus: "not-scheduled",
          notes: "",
        },
      ],
    });

    const summary = generateTasks(graph);
    const context = tasksToAIContext(summary);

    expect(context).toContain("Overall application progress");
    expect(context).toContain("UT Dallas");
    expect(context).toContain("Top priorities");
  });
});

// ─── Helpers ─────────────────────────────────────────────────────

describe("formatting helpers", () => {
  it("urgencyColor returns valid CSS classes", () => {
    expect(urgencyColor("critical")).toContain("red");
    expect(urgencyColor("high")).toContain("orange");
    expect(urgencyColor("medium")).toContain("yellow");
    expect(urgencyColor("low")).toContain("green");
  });

  it("categoryIcon returns emoji", () => {
    expect(categoryIcon("deadline")).toBe("⏰");
    expect(categoryIcon("essay")).toBe("✍️");
    expect(categoryIcon("recommendation")).toBe("📬");
    expect(categoryIcon("fafsa")).toBe("💰");
  });
});
