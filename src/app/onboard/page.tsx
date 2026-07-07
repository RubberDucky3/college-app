"use client";

import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

export default function OnboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900">
      <OnboardingWizard />
    </div>
  );
}
