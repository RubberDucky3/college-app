"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Don't register in development — SW's skipWaiting + clients.claim
    // causes infinite reload loops with dev HMR/compilation cycles.
    if (process.env.NODE_ENV === "development") return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch(() => {
          // SW registration failed silently — app works without it
        });
    }
  }, []);

  return null;
}
