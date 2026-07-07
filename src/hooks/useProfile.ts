"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "collegehub-profile";

export interface Extracurricular {
  id: string;
  name: string;
  type: "club" | "sport" | "volunteer" | "work" | "research" | "art" | "other";
  years: number; // 1-4
  hoursPerWeek: number;
  leadership: boolean;
  description: string;
}

export interface Award {
  id: string;
  name: string;
  level: "school" | "regional" | "state" | "national" | "international";
  year: number;
  description: string;
}

export interface StudentProfile {
  // Academics
  gpa: number; // 0.0 - 4.0
  gpaScale: 4.0 | 5.0 | 100; // 4.0 unweighted, 5.0 weighted, 100 scale
  satMath: number; // 200-800
  satReading: number; // 200-800
  actComposite: number; // 1-36
  classRank: number; // e.g. 15 (meaning top 15)
  classSize: number; // total class size

  // Coursework
  apCourses: string[];
  ibCourses: string[];
  honorsCourses: string[];

  // Activities
  extracurriculars: Extracurricular[];
  awards: Award[];

  // Goals
  intendedMajor: string;
  careerGoal: string;
  gradYear: number;

  // Demographics
  state: string;
  firstName: string;
  lastName: string;

  // Financial
  familyIncome: number; // 0 = unknown
  pellEligible: boolean;
}

export const EMPTY_PROFILE: StudentProfile = {
  gpa: 0,
  gpaScale: 4.0,
  satMath: 0,
  satReading: 0,
  actComposite: 0,
  classRank: 0,
  classSize: 0,
  apCourses: [],
  ibCourses: [],
  honorsCourses: [],
  extracurriculars: [],
  awards: [],
  intendedMajor: "",
  careerGoal: "",
  gradYear: new Date().getFullYear() + 1,
  state: "",
  firstName: "",
  lastName: "",
  familyIncome: 0,
  pellEligible: false,
};

function readProfile(): StudentProfile {
  if (typeof window === "undefined") return EMPTY_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StudentProfile) : EMPTY_PROFILE;
  } catch {
    return EMPTY_PROFILE;
  }
}

export function useProfile() {
  const [profile, setProfile] = useState<StudentProfile>(EMPTY_PROFILE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProfile(readProfile());
    setHydrated(true);
  }, []);

  const updateProfile = useCallback(
    (updates: Partial<StudentProfile>) => {
      setProfile((prev) => {
        const next = { ...prev, ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const resetProfile = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(EMPTY_PROFILE);
  }, []);

  const hasProfile = hydrated && profile.firstName !== "";

  const getSatTotal = useCallback(() => {
    return profile.satMath + profile.satReading;
  }, [profile.satMath, profile.satReading]);

  const getAdmissionsStrength = useCallback(() => {
    // Rough composite 0-100 based on profile data
    let score = 0;
    let maxScore = 0;

    // GPA component (up to 35 points)
    if (profile.gpa > 0) {
      maxScore += 35;
      const gpaNorm =
        profile.gpaScale === 100
          ? profile.gpa / 25
          : profile.gpa / (profile.gpaScale / 25);
      score += Math.min(gpaNorm * 35, 35);
    }

    // SAT component (up to 25 points)
    if (profile.satMath > 0 && profile.satReading > 0) {
      maxScore += 25;
      const satTotal = profile.satMath + profile.satReading;
      const satNorm = (satTotal - 400) / (1600 - 400);
      score += satNorm * 25;
    }

    // ACT component (up to 25 points, if no SAT)
    if (
      (profile.satMath === 0 || profile.satReading === 0) &&
      profile.actComposite > 0
    ) {
      maxScore += 25;
      const actNorm = (profile.actComposite - 1) / (36 - 1);
      score += actNorm * 25;
    }

    // ECs component (up to 20 points)
    if (profile.extracurriculars.length > 0) {
      maxScore += 20;
      const ecScore = Math.min(
        profile.extracurriculars.reduce((sum, ec) => {
          return sum + (ec.leadership ? 2 : 1) * Math.min(ec.years, 4);
        }, 0),
        20
      );
      score += Math.min(ecScore, 20);
    }

    // AP/IB/Honors component (up to 20 points)
    const totalAdvanced =
      profile.apCourses.length +
      profile.ibCourses.length +
      profile.honorsCourses.length;
    if (totalAdvanced > 0) {
      maxScore += 20;
      score += Math.min(totalAdvanced * 2, 20);
    }

    if (maxScore === 0) return 0;
    return Math.round((score / maxScore) * 100);
  }, [profile]);

  return {
    profile,
    hydrated,
    hasProfile,
    setProfile: updateProfile,
    resetProfile,
    getSatTotal,
    getAdmissionsStrength,
  };
}
