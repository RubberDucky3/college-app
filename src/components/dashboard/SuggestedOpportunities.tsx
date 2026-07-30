"use client";

import Link from "next/link";
import { useStudentGraph } from "@/contexts/StudentGraph";

interface Opportunity {
  title: string;
  description: string;
  href: string;
  emoji: string;
}

function getSuggestions(
  graph: ReturnType<typeof useStudentGraph>["graph"],
): Opportunity[] {
  const suggestions: Opportunity[] = [];

  if (graph.interests.length > 0) {
    suggestions.push({
      title: "Find programs matching your interests",
      description: `Based on your interest in ${graph.interests.slice(0, 2).join(" & ")}`,
      href: "/colleges",
      emoji: "🎯",
    });
  }

  if (graph.track === "college" || !graph.track) {
    suggestions.push({
      title: "Compare financial aid options",
      description: "Explore grants, scholarships, and net price calculators",
      href: "/financial",
      emoji: "💰",
    });
  }

  if (graph.gradeLevel === "junior" || graph.gradeLevel === "senior") {
    suggestions.push({
      title: "Track your applications",
      description: "Stay on top of deadlines and requirements",
      href: "/deadlines",
      emoji: "📊",
    });
  }

  if (graph.gradeLevel === "freshman" || graph.gradeLevel === "sophomore") {
    suggestions.push({
      title: "Explore degree paths",
      description: "See what courses and majors align with your goals",
      href: "/degrees",
      emoji: "🎓",
    });
  }

  // Default suggestions if nothing matches
  if (suggestions.length === 0) {
    suggestions.push({
      title: "Explore Texas colleges",
      description: "Browse universities, compare stats, and find your match",
      href: "/colleges",
      emoji: "🏛️",
    });
    suggestions.push({
      title: "Plan your finances",
      description: "Understand costs and find financial aid options",
      href: "/financial",
      emoji: "💵",
    });
  }

  return suggestions.slice(0, 3);
}

export default function SuggestedOpportunities() {
  const { graph } = useStudentGraph();
  const suggestions = getSuggestions(graph);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Suggested for You
      </h3>
      <div className="mt-2 space-y-3">
        {suggestions.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="group flex items-start gap-3 rounded-lg p-2 transition hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <span className="mt-0.5 text-lg">{item.emoji}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                {item.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
