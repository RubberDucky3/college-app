"use client";

import Lik from "next/link";
import { useStudentGraph } from "@/contexts/StudentGraph";

interface PriorityAction {
  title: string;
  description: string;
  action: string;
  href: string;
  emoji: string;
}

function getPriority(graph: ReturnType<typeof useStudentGraph>["graph"]): PriorityAction {
  // Figure out the single highest-impact action
  if (!graph.firstName) {
    return {
      title: "Complete your profile",
      description: "Let us know who you are so we can personalize your experience.",
      action: "Update Profile",
      href: "/onboard",
      emoji: "👤",
    };
  }
  if (!graph.track || graph.track === "undecided") {
    return {
      title: "Choose your path",
      description: "Select your goal after high school so we can tailor recommendations.",
      action: "Set Goal",
      href: "/onboard",
      emoji: "🎯",
    };
  }
  if (graph.gradeLevel === "junior" || graph.gradeLevel === "senior") {
    if (graph.colleges.length === 0) {
      return {
        title: "Build your college list",
        description: "Start researching colleges that match your interests and goals.",
        action: "Explore Colleges",
        href: "/colleges",
        emoji: "🏛️",
      };
    }
    if (graph.essays.length === 0) {
      return {
        title: "Start your personal statement",
        description: "The essay is one of the most important parts of your application.",
        action: "Write Essay",
        href: "/dashboard",
        emoji: "✍️",
      };
    }
  }
  if (graph.extracurriculars.length < 3) {
    return {
      title: "Add your activities",
      description: "Colleges want to see what you do outside the classroom.",
      action: "Add Activity",
      href: "/tracker",
      emoji: "⚡",
    };
  }
  if (!graph.intendedMajor) {
    return {
      title: "Choose a major",
      description: "Selecting a field of study helps us recommend relevant opportunities.",
      action: "Set Major",
      href: "/degrees",
      emoji: "📚",
    };
  }
  if (!graph.satMath && !graph.actComposite) {
    return {
      title: "Plan for standardized tests",
      description: "Many colleges require SAT or ACT scores — start preparing early.",
      action: "View Requirements",
      href: "/colleges",
      emoji: "📝",
    };
  }

  // Default fallback
  return {
    title: "Explore opportunities",
    description: "Discover scholarships, programs, and events matched to your profile.",
    action: "Discover",
    href: "/dashboard",
    emoji: "🔍",
  };
}

export default function NextPriority() {
  const { graph } = useStudentGraph();
  const priority = getPriority(graph);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Next Priority
      </h3>
      <div className="mt-2 flex items-start gap-3">
        <span className="mt-1 text-2xl">{priority.emoji}</span>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
            {priority.title}
          </h4>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {priority.description}
          </p>
          <Lik
            href={priority.href}
            className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            {priority.action} →
          </Lik>
        </div>
      </div>
    </div>
  );
}
