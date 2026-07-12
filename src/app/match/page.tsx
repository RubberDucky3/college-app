"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { QUIZ_QUESTIONS, findMatches } from "@/lib/college-match";
import type { QuizPreferences, MatchResult } from "@/lib/college-match";
import { formatCurrency, formatPercent, getCollegeInitialsLogo } from "@/lib/utils";
import AdSense from "@/components/AdSense";

type Step = "intro" | "quiz" | "results";

const STATE_OPTIONS = [
  { value: "", label: "Any state" },
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

export default function MatchPage() {
  const [step, setStep] = useState<Step>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [customProgram, setCustomProgram] = useState("");
  const [showStatePicker, setShowStatePicker] = useState(false);

  const [prefs, setPrefs] = useState<QuizPreferences>({
    size: "any",
    type: "any",
    locale: "any",
    selectivity: "any",
    maxTuition: 0,
    program: "",
    state: "",
    minGraduationRate: 0,
    minEarnings: 0,
    campusSize: "any",
  });

  const results = useMemo(() => {
    if (step !== "results") return [];
    return findMatches(prefs);
  }, [step, prefs]);

  const [visibleCount, setVisibleCount] = useState(25);

  const updatePref = (key: keyof QuizPreferences, value: string) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const handleAnswer = (questionId: string, value: string) => {
    if (questionId === "state" && value === "other") {
      setShowStatePicker(true);
      return;
    }
    if (questionId === "program" && value === "custom") {
      return;
    }

    // Map question IDs to preference keys (tuition question stores as maxTuition number)
    if (questionId === "tuition") {
      setPrefs((prev) => ({ ...prev, maxTuition: Number(value) }));
    } else {
      updatePref(questionId as keyof QuizPreferences, value);
    }

    // Advance to next question or finish
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep("results");
      setVisibleCount(25);
    }
  };

  const handleCustomProgramSubmit = () => {
    if (customProgram.trim()) {
      updatePref("program", customProgram.trim());
      if (currentQ < QUIZ_QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        setStep("results");
        setVisibleCount(25);
      }
    }
  };

  const handleStateSelect = (state: string) => {
    updatePref("state", state);
    setShowStatePicker(false);
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep("results");
      setVisibleCount(25);
    }
  };

  const restartQuiz = () => {
    setStep("intro");
    setCurrentQ(0);
    setPrefs({
      size: "any",
      type: "any",
      locale: "any",
      selectivity: "any",
      maxTuition: 0,
      program: "",
      state: "",
      minGraduationRate: 0,
      minEarnings: 0,
      campusSize: "any",
    });
    setCustomProgram("");
    setShowStatePicker(false);
    setVisibleCount(25);
  };

  const progressPct = ((currentQ) / QUIZ_QUESTIONS.length) * 100;

  const currentQuestion = QUIZ_QUESTIONS[currentQ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ─── Intro Step ────────────────────────────────── */}
      {step === "intro" && (
        <div className="text-center">
          <div className="mb-6 text-6xl">🎯</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            College Match Quiz
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-gray-600 dark:text-gray-400">
            Answer a few quick questions and we&apos;ll find the best colleges
            for you from our database of 2,600+ national universities.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setStep("quiz")}
              className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl active:scale-[0.98]"
            >
              Start the Quiz →
            </button>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { icon: "⚡", title: "Fast", desc: "7 quick questions, 2 minutes" },
              { icon: "🎯", title: "Personalized", desc: "Matched to your preferences" },
              { icon: "📊", title: "Data-Driven", desc: "Real Scorecard data, not opinions" },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-2 text-2xl">{feature.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Quiz Step ─────────────────────────────────── */}
      {step === "quiz" && (
        <div className="mx-auto max-w-2xl">
          {/* Progress bar */}
          <div className="mb-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>
              Question {currentQ + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <span>{Math.round(progressPct)}%</span>
          </div>
          <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Question card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {currentQuestion.question}
            </h2>
            {currentQuestion.subtext && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {currentQuestion.subtext}
              </p>
            )}

            {/* Custom program input */}
            {currentQuestion.id === "program" && prefs.program === "custom" && (
              <div className="mt-6 flex gap-2">
                <input
                  type="text"
                  value={customProgram}
                  onChange={(e) => setCustomProgram(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCustomProgramSubmit();
                  }}
                  placeholder="e.g., Political Science, Nursing, Economics..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-blue-400"
                  autoFocus
                />
                <button
                  onClick={handleCustomProgramSubmit}
                  disabled={!customProgram.trim()}
                  className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            )}

            {/* State picker grid */}
            {showStatePicker && (
              <div className="mt-6">
                <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {STATE_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => handleStateSelect(s.value)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                        prefs.state === s.value
                          ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-300"
                          : "border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowStatePicker(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ← Back
                </button>
              </div>
            )}

            {/* Standard options */}
            {!showStatePicker &&
              !(currentQuestion.id === "program" && prefs.program === "custom") && (
                <div className="mt-6 grid gap-3">
                  {currentQuestion.options
                    .filter((o) => o.value !== "custom" || currentQuestion.id !== "program")
                    .map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          handleAnswer(currentQuestion.id, option.value)
                        }
                        className={`flex items-center gap-3 rounded-xl border-2 px-5 py-4 text-left transition hover:border-blue-400 hover:bg-blue-50 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 ${
                          prefs[
                            currentQuestion.id as keyof QuizPreferences
                          ] === option.value
                            ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30"
                            : "border-gray-200 dark:border-gray-600"
                        }`}
                      >
                        {option.emoji && (
                          <span className="text-xl">{option.emoji}</span>
                        )}
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {option.label}
                        </span>
                      </button>
                    ))}
                </div>
              )}
          </div>

          {/* Back button */}
          {currentQ > 0 && !showStatePicker && !(currentQuestion.id === "program" && prefs.program === "custom") && (
            <button
              onClick={() => setCurrentQ(currentQ - 1)}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ← Previous question
            </button>
          )}
        </div>
      )}

      {/* ─── Results Step ──────────────────────────────── */}
      {step === "results" && (
        <div>
          <div className="mb-8 text-center">
            <div className="mb-4 text-5xl">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Your College Matches
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              We found{" "}
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {results.length}
              </span>{" "}
              colleges matching your preferences
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={restartQuiz}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                ← Retake Quiz
              </button>
              <Link
                href="/colleges"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Browse All Colleges
              </Link>
            </div>
          </div>

          {/* Match breakdown */}
          <div className="mb-6 flex flex-wrap gap-3">
            {prefs.size !== "any" && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                Size: {prefs.size}
              </span>
            )}
            {prefs.type !== "any" && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">
                Type: {prefs.type}
              </span>
            )}
            {prefs.locale !== "any" && (
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                Setting: {prefs.locale}
              </span>
            )}
            {prefs.selectivity !== "any" && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                Selectivity: {prefs.selectivity}
              </span>
            )}
            {prefs.state && (
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                State: {prefs.state}
              </span>
            )}
            {prefs.program && (
              <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700 dark:bg-pink-900/40 dark:text-pink-300">
                Program: {prefs.program}
              </span>
            )}
            {prefs.maxTuition > 0 && (
              <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                Budget: {formatCurrency(prefs.maxTuition)}/yr
              </span>
            )}
          </div>

          {/* Results list */}
          {results.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-600">
              <div className="mb-3 text-4xl">😕</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                No matches found
              </h2>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Try broadening your preferences — set more options to &ldquo;No
                preference&rdquo; and try again.
              </p>
              <button
                onClick={restartQuiz}
                className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Retake Quiz
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {results.slice(0, visibleCount).map((college, index) => (
                  <CollegeMatchCard
                    key={college.id}
                    college={college}
                    rank={index + 1}
                    prefs={prefs}
                  />
                ))}
              </div>

              {visibleCount < results.length && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setVisibleCount(visibleCount + 25)}
                    className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Show More ({results.length - visibleCount} remaining)
                  </button>
                </div>
              )}

              {/* Ad — after match results */}
              <AdSense slot="0000000004" format="auto" label="Sponsored" />
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── College Match Card ────────────────────────────────────────

function CollegeMatchCard({
  college,
  rank,
  prefs,
}: {
  college: MatchResult;
  rank: number;
  prefs: QuizPreferences;
}) {
  const badgeColor =
    college.selectivityTag === "safety"
      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
      : college.selectivityTag === "target"
        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
        : "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300";

  const matchColor =
    college.matchScore >= 80
      ? "bg-green-500"
      : college.matchScore >= 60
        ? "bg-blue-500"
        : college.matchScore >= 40
          ? "bg-amber-500"
          : "bg-gray-400";

  return (
    <Link
      href={`/colleges/${college.id}`}
      className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
    >
      {/* Rank badge */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
        {rank}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
              {college.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {college.city}, {college.state} ·{" "}
              {college.type === "public" ? "Public" : "Private"} ·{" "}
              {college.size.replace("-", " ")}
            </p>
          </div>

          {/* Match score */}
          <div className="flex shrink-0 items-center gap-2">
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {college.matchScore}%
              </div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                Match
              </div>
            </div>
            <div className="relative h-12 w-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
              <div
                className={`absolute bottom-0 w-full rounded-full transition-all ${matchColor}`}
                style={{ height: `${college.matchScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
          <span>
            Acceptance:{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {college.acceptanceRate != null ? `${college.acceptanceRate.toFixed(0)}%` : "N/A"}
            </span>
          </span>
          <span>
            Tuition:{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {formatCurrency(college.tuitionInState)}
            </span>
          </span>
          <span>
            Grad rate:{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {college.graduationRate6yr != null ? `${college.graduationRate6yr.toFixed(0)}%` : "N/A"}
            </span>
          </span>
          <span>
            Earnings:{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {formatCurrency(college.medianEarnings10yr)}
            </span>
          </span>
        </div>

        {/* Tags */}
        <div className="mt-2 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badgeColor}`}
          >
            {college.selectivityTag}
          </span>
          {prefs.maxTuition > 0 && college.tuitionInState != null && college.tuitionInState <= prefs.maxTuition && (
            <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
              In Budget
            </span>
          )}
          {prefs.program &&
            college.name.toLowerCase().includes(prefs.program.toLowerCase()) && (
              <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-semibold text-pink-700 dark:bg-pink-900/40 dark:text-pink-300">
                Program Match
              </span>
            )}
        </div>
      </div>
    </Link>
  );
}
