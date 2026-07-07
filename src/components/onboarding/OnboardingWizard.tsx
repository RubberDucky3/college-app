"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStudentGraph } from "@/contexts/StudentGraph";
import type { Track, GradeLevel } from "@/types/student-graph";
import StepIndicator from "./StepIndicator";
import WelcomeStep from "./WelcomeStep";
import GoalStep from "./GoalStep";
import GradeStep from "./GradeStep";
import DreamSchoolStep from "./DreamSchoolStep";
import AIIntroStep from "./AIIntroStep";

interface ExtractedData {
  gpa?: number;
  intendedMajor?: string;
  interests?: string[];
  gradeLevel?: string;
  currentActivities?: { name: string; type: string; leadership: boolean }[];
  careerGoal?: string;
  apCourses?: string[];
}

export default function OnboardingWizard() {
  const router = useRouter();
  const {
    setIdentity,
    setTrack,
    setOnboardingStage,
    setDreamSchools,
    setInterests,
    setAcademics,
    completeOnboarding,
  } = useStudentGraph();

  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [track, localTrack] = useState<Track | null>(null);
  const [grade, localGrade] = useState<GradeLevel | null>(null);
  const [dreamSchools, localDreamSchools] = useState<string[]>([]);

  const totalSteps = 5;

  const advance = () => {
    if (step === 0 && firstName) {
      setIdentity({ firstName });
    }
    if (step === 1 && track) {
      setTrack(track);
      setOnboardingStage("goal-selection");
    }
    if (step === 2 && grade) {
      setAcademics({ gradeLevel: grade });
      setOnboardingStage("grade-selection");
    }

    if (step === 4) {
      setDreamSchools(dreamSchools);
      setOnboardingStage("dream-school");
      completeOnboarding();
      router.push("/dashboard");
    } else {
      setStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  function handleAIComplete(data: ExtractedData) {
    if (data.interests && data.interests.length > 0) {
      setInterests(data.interests);
    }
    if (data.intendedMajor || data.gpa) {
      setAcademics({
        intendedMajor: data.intendedMajor,
        gpa: data.gpa && data.gpa > 0 ? data.gpa : undefined,
      } as { intendedMajor?: string; gpa?: number });
    }
    setDreamSchools(dreamSchools);
    setOnboardingStage("dream-school");
    completeOnboarding();
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto min-h-[calc(100vh-8rem)] max-w-3xl px-4 py-12">
      {/* Step indicator */}
      <div className="mb-12">
        <StepIndicator currentStep={step} totalSteps={totalSteps} />
      </div>

      {/* Step content */}
      <div className="mb-8">
        {step === 0 && (
          <div className="flex flex-col items-center gap-4">
            <WelcomeStep onNext={() => setStep((s) => s + 1)} />
            <div className="mt-4 w-full max-w-xs">
              <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">
                Your first name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <GoalStep
            selected={track}
            onSelect={localTrack}
            onNext={advance}
          />
        )}

        {step === 2 && (
          <GradeStep
            selected={grade}
            onSelect={localGrade}
            onNext={advance}
          />
        )}

        {step === 3 && (
          <DreamSchoolStep
            selected={dreamSchools}
            onSelect={localDreamSchools}
            onNext={advance}
            onSkip={advance}
          />
        )}

        {step === 4 && (
          <AIIntroStep
            onComplete={handleAIComplete}
            onSkip={advance}
          />
        )}
      </div>

      {/* Back button */}
      {step > 0 && (
        <div className="flex justify-center">
          <button
            onClick={goBack}
            className="text-sm text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
