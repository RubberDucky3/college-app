"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "collegehub-compare";
const SYNC_EVENT = "collegehub-compare-sync";
export const MAX_COMPARE = 5;

function readCompare(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function broadcast() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SYNC_EVENT));
  }
}

export function useCompare() {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCompareIds(readCompare());
    setHydrated(true);
  }, []);

  useEffect(() => {
    const handler = () => setCompareIds(readCompare());
    window.addEventListener(SYNC_EVENT, handler);
    return () => window.removeEventListener(SYNC_EVENT, handler);
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : prev.length >= MAX_COMPARE
          ? prev
          : [...prev, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      broadcast();
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCompareIds([]);
    broadcast();
  }, []);

  const isCompare = useCallback(
    (id: string) => compareIds.includes(id),
    [compareIds],
  );

  const canAdd = compareIds.length < MAX_COMPARE;

  return { compareIds, hydrated, toggleCompare, clearCompare, isCompare, canAdd };
}
