"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStudentGraph } from "@/contexts/StudentGraph";

export default function OnboardingGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isOnboarded, hydrated } = useStudentGraph();

  useEffect(() => {
    if (!hydrated) return; // still loading from localStorage
    if (isOnboarded) {
      router.replace("/dashboard");
    } else {
      router.replace("/onboard");
    }
  }, [hydrated, isOnboarded, router]);

  // Show children (current home page) while checking / as fallback
  return <>{children}</>;
}
