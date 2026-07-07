"use client";

import { useEffect, useRef } from "react";
import { useStudentGraph } from "@/contexts/StudentGraph";
import type { Notification } from "@/types/student-graph";

export function useNotifications() {
  const { graph, addNotification } = useStudentGraph();
  const prevGraph = useRef({
    extracurricularsLength: 0,
    awardsLength: 0,
    milestonesCompleted: 0,
  });

  useEffect(() => {
    const prev = prevGraph.current;

    // Detect when activities were added
    if (graph.extracurriculars.length > prev.extracurricularsLength && prev.extracurricularsLength > 0) {
      addNotification({
        title: "Activity Added",
        body: `You added "${graph.extracurriculars.at(-1)?.name}". Great job!`,
        type: "milestone",
      });
    }

    // Detect when awards were added
    if (graph.awards.length > prev.awardsLength && prev.awardsLength > 0) {
      addNotification({
        title: "Award Recorded",
        body: `"${graph.awards.at(-1)?.name}" added to your profile.`,
        type: "milestone",
      });
    }

    // Detect milestones completed
    const currentCompleted = graph.milestones.filter((m) => m.completed).length;
    if (currentCompleted > prev.milestonesCompleted) {
      const justCompleted = graph.milestones.filter((m) => m.completed).at(-1);
      if (justCompleted) {
        addNotification({
          title: "Milestone Completed",
          body: `You completed "${justCompleted.label}". Keep going!`,
          type: "milestone",
        });
      }
    }

    prevGraph.current = {
      extracurricularsLength: graph.extracurriculars.length,
      awardsLength: graph.awards.length,
      milestonesCompleted: currentCompleted,
    };
  }, [graph.extracurriculars, graph.awards, graph.milestones, addNotification]);

  // Generate context-aware suggestions
  function getActionableNotifications(): Notification[] {
    const suggestions: Omit<Notification, "id" | "read" | "createdAt">[] = [];

    if (graph.extracurriculars.length < 3 && graph.track !== "undecided") {
      suggestions.push({
        title: "Add More Activities",
        body: "You have fewer than 3 activities. Colleges look for depth and breadth.",
        type: "suggestion",
      });
    }

    if (!graph.intendedMajor) {
      suggestions.push({
        title: "Choose a Major",
        body: "Selecting an intended major helps us tailor recommendations.",
        type: "suggestion",
      });
    }

    if (graph.gradeLevel === "junior" || graph.gradeLevel === "senior") {
      if (graph.satMath === 0 && graph.satReading === 0 && graph.actComposite === 0) {
        suggestions.push({
          title: "Add Test Scores",
          body: "Many colleges still consider SAT/ACT scores. Add yours to see how you compare.",
          type: "missing",
        });
      }

      if (graph.awards.length === 0) {
        suggestions.push({
          title: "Add Awards & Honors",
          body: "Scholarships and selective programs want to see your achievements.",
          type: "missing",
        });
      }
    }

    return suggestions as Notification[];
  }

  return {
    notifications: graph.notifications,
    unreadCount: graph.notifications.filter((n) => !n.read).length,
    getActionableNotifications,
  };
}
