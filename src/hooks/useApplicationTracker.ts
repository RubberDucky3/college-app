"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "collegehub-tracker";

export type ApplicationStatus =
  | "interested"
  | "researching"
  | "applying"
  | "submitted"
  | "interviewing"
  | "accepted"
  | "rejected"
  | "waitlisted"
  | "enrolled"
  | "declined";

export interface ApplicationEntry {
  collegeId: string;
  status: ApplicationStatus;
  notes: string;
  deadline: string;
  applicationUrl: string;
  essayDraftUrl: string;
  recommenders: string[];
  updatedAt: string; // ISO date
}

const STATUS_ORDER: Record<ApplicationStatus, number> = {
  interested: 0,
  researching: 1,
  applying: 2,
  submitted: 3,
  interviewing: 4,
  accepted: 5,
  rejected: 5,
  waitlisted: 5,
  enrolled: 6,
  declined: 6,
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  interested: "Interested",
  researching: "Researching",
  applying: "Applying",
  submitted: "Submitted",
  interviewing: "Interviewing",
  accepted: "Accepted",
  rejected: "Rejected",
  waitlisted: "Waitlisted",
  enrolled: "Enrolled",
  declined: "Declined",
};

export const PIPELINE_STATUSES: ApplicationStatus[] = [
  "interested",
  "researching",
  "applying",
  "submitted",
  "interviewing",
  "accepted",
  "enrolled",
];

const TERMINAL_STATUSES: ApplicationStatus[] = [
  "accepted",
  "rejected",
  "waitlisted",
  "enrolled",
  "declined",
];

function readEntries(): ApplicationEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ApplicationEntry[]) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: ApplicationEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useApplicationTracker() {
  const [entries, setEntries] = useState<ApplicationEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEntries(readEntries());
    setHydrated(true);
  }, []);

  const getEntry = useCallback(
    (collegeId: string): ApplicationEntry | undefined => {
      return entries.find((e) => e.collegeId === collegeId);
    },
    [entries]
  );

  const setStatus = useCallback(
    (collegeId: string, status: ApplicationStatus) => {
      setEntries((prev) => {
        const existing = prev.findIndex((e) => e.collegeId === collegeId);
        const entry: ApplicationEntry = {
          collegeId,
          status,
          notes: existing >= 0 ? prev[existing].notes : "",
          deadline: existing >= 0 ? prev[existing].deadline : "",
          applicationUrl: existing >= 0 ? prev[existing].applicationUrl : "",
          essayDraftUrl: existing >= 0 ? prev[existing].essayDraftUrl : "",
          recommenders: existing >= 0 ? prev[existing].recommenders : [],
          updatedAt: new Date().toISOString(),
        };
        const next =
          existing >= 0
            ? prev.map((e, i) => (i === existing ? entry : e))
            : [...prev, entry];
        saveEntries(next);
        return next;
      });
    },
    []
  );

  const updateEntry = useCallback(
    (
      collegeId: string,
      updates: Partial<Omit<ApplicationEntry, "collegeId">>
    ) => {
      setEntries((prev) => {
        const existing = prev.findIndex((e) => e.collegeId === collegeId);
        if (existing < 0) return prev;
        const next = prev.map((e, i) =>
          i === existing
            ? { ...e, ...updates, updatedAt: new Date().toISOString() }
            : e
        );
        saveEntries(next);
        return next;
      });
    },
    []
  );

  const removeEntry = useCallback((collegeId: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.collegeId !== collegeId);
      saveEntries(next);
      return next;
    });
  }, []);

  const getCollegesByStatus = useCallback(
    (status: ApplicationStatus): ApplicationEntry[] => {
      return entries.filter((e) => e.status === status);
    },
    [entries]
  );

  const getActiveCount = useCallback(() => {
    return entries.filter(
      (e) => !TERMINAL_STATUSES.includes(e.status)
    ).length;
  }, [entries]);

  return {
    entries,
    hydrated,
    getEntry,
    setStatus,
    updateEntry,
    removeEntry,
    getCollegesByStatus,
    getActiveCount,
  };
}
