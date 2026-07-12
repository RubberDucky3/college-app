"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          for (const reg of regs) {
            reg.unregister();
          }
        });
      }
      caches.keys().then((keys) => {
        for (const k of keys) {
          caches.delete(k);
        }
      });
      return;
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch(() => {});
    }
  }, []);

  return null;
}
