"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  type StudentGraph,
  type OnboardingStage,
  type Track,
  type GradeLevel,
  type Milestone,
  type TimelineEvent,
  type Notification,
  type AIMemory,
  type Extracurricular,
  type Award,
  EMPTY_STUDENT_GRAPH,
} from "@/types/student-graph";

const STORAGE_KEY = "collegehub-student-graph";

// ─── Helpers ──────────────────────────────────────────────────────

function readGraph(): StudentGraph {
  if (typeof window === "undefined") return EMPTY_STUDENT_GRAPH;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StudentGraph) : EMPTY_STUDENT_GRAPH;
  } catch {
    return EMPTY_STUDENT_GRAPH;
  }
}

function writeGraph(graph: StudentGraph) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(graph));
  } catch {
    // localStorage full or unavailable
  }
}

// ─── Context ──────────────────────────────────────────────────────

export interface StudentGraphContextValue {
  graph: StudentGraph;
  hydrated: boolean;

  // Onboarding
  isOnboarded: boolean;
  onboardingStage: OnboardingStage;
  setOnboardingStage: (stage: OnboardingStage) => void;
  completeOnboarding: () => void;

  // Identity
  setIdentity: (data: { firstName: string; lastName?: string; email?: string }) => void;

  // Academics
  setAcademics: (data: {
    gradeLevel?: GradeLevel;
    gradYear?: number;
    gpa?: number;
    satMath?: number;
    satReading?: number;
    actComposite?: number;
    apCourses?: string[];
    intendedMajor?: string;
  }) => void;

  // Goals
  setTrack: (track: Track) => void;
  setDreamSchools: (schools: string[]) => void;
  setInterests: (interests: string[]) => void;

  // Profile completeness (0-100)
  getProfileCompleteness: () => number;

  // Daily
  dailyGoal: string;
  setDailyGoal: (goal: string) => void;
  completeDailyGoal: () => void;

  // Milestones
  getMilestones: () => Milestone[];
  completeMilestone: (id: string) => void;

  // Notifications
  getUnreadNotifications: () => Notification[];
  markNotificationRead: (id: string) => void;
  addNotification: (n: Omit<Notification, "id" | "read" | "createdAt">) => void;

  // AI Memory
  addConversationEntry: (entry: Omit<AIMemory, "id" | "timestamp">) => void;
  getRecentConversations: (limit?: number) => AIMemory[];
  clearConversations: () => void;

  // Activities
  addExtracurricular: (ec: Extracurricular) => void;
  removeExtracurricular: (id: string) => void;
  addAward: (award: Award) => void;

  // Reset
  resetGraph: () => void;
}

const StudentGraphContext = createContext<StudentGraphContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────

export function StudentGraphProvider({ children }: { children: ReactNode }) {
  const [graph, setGraph] = useState<StudentGraph>(EMPTY_STUDENT_GRAPH);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setGraph(readGraph());
    setHydrated(true);
  }, []);

  const update = useCallback((updates: Partial<StudentGraph>) => {
    setGraph((prev) => {
      const next = { ...prev, ...updates, updatedAt: new Date().toISOString() };
      writeGraph(next);
      return next;
    });
  }, []);

  // ─── Derived ──────────────────────────────────────────────────

  const isOnboarded = hydrated && graph.hasCompletedOnboarding;

  const getProfileCompleteness = useCallback((): number => {
    if (!hydrated) return 0;
    let score = 0;
    let max = 0;

    // Name (5)
    if (graph.firstName) { score += 5; }
    max += 5;

    // Track (5)
    if (graph.track !== "undecided") { score += 5; }
    max += 5;

    // Grade level (5)
    if (graph.gradeLevel) { score += 5; }
    max += 5;

    // Dream schools (5)
    if (graph.dreamSchools.length > 0) { score += 5; }
    max += 5;

    // GPA (10)
    if (graph.gpa > 0) { score += 10; }
    max += 10;

    // Interests (10)
    if (graph.interests.length > 0) { score += 10; }
    max += 10;

    // Intended major (10)
    if (graph.intendedMajor) { score += 10; }
    max += 10;

    // Extracurriculars (15)
    const ecScore = Math.min(graph.extracurriculars.length * 5, 15);
    score += ecScore;
    max += 15;

    // Awards (10)
    const awardScore = Math.min(graph.awards.length * 5, 10);
    score += awardScore;
    max += 10;

    // Test scores (10)
    if (graph.satMath > 0 || graph.satReading > 0 || graph.actComposite > 0) {
      score += 10;
    }
    max += 10;

    // AP/IB/Honors (10)
    const totalAdvanced =
      graph.apCourses.length + graph.ibCourses.length + graph.honorsCourses.length;
    if (totalAdvanced > 0) { score += Math.min(totalAdvanced * 2, 10); }
    max += 10;

    return max === 0 ? 0 : Math.round((score / max) * 100);
  }, [graph, hydrated]);

  // ─── Onboarding ────────────────────────────────────────────────

  const setOnboardingStage = useCallback(
    (stage: OnboardingStage) => update({ onboardingStage: stage }),
    [update]
  );

  const completeOnboarding = useCallback(
    () => update({ hasCompletedOnboarding: true, onboardingStage: "dashboard" }),
    [update]
  );

  // ─── Identity ─────────────────────────────────────────────────

  const setIdentity = useCallback(
    (data: { firstName: string; lastName?: string; email?: string }) =>
      update(data),
    [update]
  );

  // ─── Academics ─────────────────────────────────────────────────

  const setAcademics = useCallback(
    (data: {
      gradeLevel?: GradeLevel;
      gradYear?: number;
      gpa?: number;
      satMath?: number;
      satReading?: number;
      actComposite?: number;
      apCourses?: string[];
      intendedMajor?: string;
    }) => update(data),
    [update]
  );

  // ─── Goals ─────────────────────────────────────────────────────

  const setTrack = useCallback((track: Track) => update({ track }), [update]);
  const setDreamSchools = useCallback(
    (dreamSchools: string[]) => update({ dreamSchools }),
    [update]
  );
  const setInterests = useCallback(
    (interests: string[]) => update({ interests }),
    [update]
  );

  // ─── Daily ─────────────────────────────────────────────────────

  const setDailyGoal = useCallback(
    (dailyGoal: string) =>
      update({ dailyGoal, dailyGoalCompleted: false, dailyGoalDate: new Date().toISOString().split("T")[0] }),
    [update]
  );

  const completeDailyGoal = useCallback(
    () => update({ dailyGoalCompleted: true }),
    [update]
  );

  // ─── Milestones ────────────────────────────────────────────────

  const getMilestones = useCallback(() => graph.milestones, [graph.milestones]);

  const completeMilestone = useCallback(
    (id: string) => {
      setGraph((prev) => {
        const next = {
          ...prev,
          milestones: prev.milestones.map((m) =>
            m.id === id
              ? { ...m, completed: true, completedAt: new Date().toISOString() }
              : m
          ),
          updatedAt: new Date().toISOString(),
        };
        writeGraph(next);
        return next;
      });
    },
    []
  );

  // ─── Notifications ─────────────────────────────────────────────

  const getUnreadNotifications = useCallback(
    () => graph.notifications.filter((n) => !n.read),
    [graph.notifications]
  );

  const markNotificationRead = useCallback((id: string) => {
    setGraph((prev) => {
      const next = {
        ...prev,
        notifications: prev.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
        updatedAt: new Date().toISOString(),
      };
      writeGraph(next);
      return next;
    });
  }, []);

  const addNotification = useCallback(
    (n: Omit<Notification, "id" | "read" | "createdAt">) => {
      const notification: Notification = {
        ...n,
        id: crypto.randomUUID(),
        read: false,
        createdAt: new Date().toISOString(),
      };
      setGraph((prev) => {
        const next = {
          ...prev,
          notifications: [notification, ...prev.notifications].slice(0, 100),
          updatedAt: new Date().toISOString(),
        };
        writeGraph(next);
        return next;
      });
    },
    []
  );

  // ─── AI Memory ─────────────────────────────────────────────────

  const addConversationEntry = useCallback(
    (entry: Omit<AIMemory, "id" | "timestamp">) => {
      const memory: AIMemory = {
        ...entry,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      };
      setGraph((prev) => {
        const next = {
          ...prev,
          aiConversations: [...prev.aiConversations, memory].slice(-200),
          updatedAt: new Date().toISOString(),
        };
        writeGraph(next);
        return next;
      });
    },
    []
  );

  const getRecentConversations = useCallback(
    (limit = 20) => graph.aiConversations.slice(-limit),
    [graph.aiConversations]
  );

  const clearConversations = useCallback(
    () => update({ aiConversations: [] }),
    [update]
  );

  // ─── Activities ────────────────────────────────────────────────

  const addExtracurricular = useCallback(
    (ec: Extracurricular) => {
      setGraph((prev) => {
        const next = {
          ...prev,
          extracurriculars: [...prev.extracurriculars, ec],
          updatedAt: new Date().toISOString(),
        };
        writeGraph(next);
        return next;
      });
    },
    []
  );

  const removeExtracurricular = useCallback((id: string) => {
    setGraph((prev) => {
      const next = {
        ...prev,
        extracurriculars: prev.extracurriculars.filter((ec) => ec.id !== id),
        updatedAt: new Date().toISOString(),
      };
      writeGraph(next);
      return next;
    });
  }, []);

  const addAward = useCallback((award: Award) => {
    setGraph((prev) => {
      const next = {
        ...prev,
        awards: [...prev.awards, award],
        updatedAt: new Date().toISOString(),
      };
      writeGraph(next);
      return next;
    });
  }, []);

  // ─── Reset ─────────────────────────────────────────────────────

  const resetGraph = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setGraph(EMPTY_STUDENT_GRAPH);
  }, []);

  // ─── Exposed Value ────────────────────────────────────────────

  const value: StudentGraphContextValue = {
    graph,
    hydrated,
    isOnboarded,
    onboardingStage: graph.onboardingStage,
    setOnboardingStage,
    completeOnboarding,
    setIdentity,
    setAcademics,
    setTrack,
    setDreamSchools,
    setInterests,
    getProfileCompleteness,
    dailyGoal: graph.dailyGoal,
    setDailyGoal,
    completeDailyGoal,
    getMilestones,
    completeMilestone,
    getUnreadNotifications,
    markNotificationRead,
    addNotification,
    addConversationEntry,
    getRecentConversations,
    clearConversations,
    addExtracurricular,
    removeExtracurricular,
    addAward,
    resetGraph,
  };

  return (
    <StudentGraphContext.Provider value={value}>
      {children}
    </StudentGraphContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────

export function useStudentGraph(): StudentGraphContextValue {
  const ctx = useContext(StudentGraphContext);
  if (!ctx) {
    throw new Error("useStudentGraph must be used within a StudentGraphProvider");
  }
  return ctx;
}
