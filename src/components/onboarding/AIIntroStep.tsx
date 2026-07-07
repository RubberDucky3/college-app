"use client";

import { useState } from "react";

interface ExtractedData {
  gpa?: number;
  intendedMajor?: string;
  interests?: string[];
  gradeLevel?: string;
  currentActivities?: { name: string; type: string; leadership: boolean }[];
  careerGoal?: string;
  apCourses?: string[];
}

interface AIIntroStepProps {
  onComplete: (data: ExtractedData) => void;
  onSkip: () => void;
}

export default function AIIntroStep({ onComplete, onSkip }: AIIntroStepProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedData | null>(null);
  const [error, setError] = useState("");

  async function handleExtract() {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/extract-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Extraction failed");
      }
      const data: ExtractedData = await res.json();
      setExtracted(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleConfirm() {
    onComplete(extracted ?? {});
  }

  if (extracted) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl dark:bg-green-900/30">
          ✅
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Does this look right?
        </h2>
        <p className="mb-6 text-gray-500 dark:text-gray-400">
          I&apos;ve extracted the following from what you shared. You can edit
          these later in your profile.
        </p>

        <div className="mb-8 space-y-3 text-left">
          {extracted.gpa !== undefined && extracted.gpa > 0 && (
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
              <span className="text-sm text-gray-500 dark:text-gray-400">GPA</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {extracted.gpa.toFixed(1)}
              </span>
            </div>
          )}
          {extracted.intendedMajor && (
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
              <span className="text-sm text-gray-500 dark:text-gray-400">Intended Major</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {extracted.intendedMajor}
              </span>
            </div>
          )}
          {extracted.gradeLevel && (
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
              <span className="text-sm text-gray-500 dark:text-gray-400">Grade</span>
              <span className="font-semibold capitalize text-gray-900 dark:text-gray-100">
                {extracted.gradeLevel}
              </span>
            </div>
          )}
          {extracted.interests && extracted.interests.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
              <span className="text-sm text-gray-500 dark:text-gray-400">Interests</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {extracted.interests.map((i) => (
                  <span
                    key={i}
                    className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          )}
          {extracted.careerGoal && (
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
              <span className="text-sm text-gray-500 dark:text-gray-400">Career Goal</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {extracted.careerGoal}
              </span>
            </div>
          )}
          {extracted.currentActivities && extracted.currentActivities.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
              <span className="text-sm text-gray-500 dark:text-gray-400">Activities</span>
              <div className="mt-2 space-y-1">
                {extracted.currentActivities.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span>{a.leadership ? "⭐" : "•"}</span>
                    <span>{a.name}</span>
                    <span className="text-xs capitalize text-gray-400">({a.type})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Looks good!
          </button>
          <button
            onClick={() => {
              setExtracted(null);
              setText("");
            }}
            className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl dark:bg-blue-900/30">
        💬
      </div>
      <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
        Tell me a little about yourself
      </h2>
      <p className="mb-2 text-gray-500 dark:text-gray-400">
        Share your academics, interests, and goals — I&apos;ll fill in your
        profile automatically.
      </p>
      <p className="mb-8 text-sm text-gray-400 dark:text-gray-500">
        Example: &ldquo;I&apos;m a junior with a 3.8 GPA who loves programming
        and robotics. I&apos;m hoping to study computer science.&rdquo;
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tell me about yourself..."
        rows={5}
        className="mb-4 w-full resize-none rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
      />

      {error && (
        <p className="mb-4 text-sm text-red-500">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleExtract}
          disabled={!text.trim() || loading}
          className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Analyzing...
            </span>
          ) : (
            "Analyze my profile"
          )}
        </button>
        <button
          onClick={onSkip}
          className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-500 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          Skip
        </button>
      </div>
      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
        Your data is stored locally and never shared.
      </p>
    </div>
  );
}
