"use client";

import { useEffect, useRef } from "react";

interface AdSenseProps {
  /** Google AdSense ad slot ID */
  slot: string;
  /** Ad format: "auto" (responsive), "rectangle", "horizontal", "vertical" */
  format?: string;
  /** Full width responsive */
  fullWidthResponsive?: boolean;
  /** Ad label text (shown above ad) */
  label?: string;
  /** Custom className for the wrapper */
  className?: string;
}

/**
 * Google AdSense ad unit component.
 *
 * Usage:
 *   <AdSense slot="1234567890" format="auto" />
 *
 * To get your publisher ID and slot IDs:
 *   1. Sign up at https://www.google.com/adsense
 *   2. Create ad units in your AdSense dashboard
 *   3. Replace ca-pub-XXXXX in layout.tsx with your publisher ID
 *   4. Replace the slot prop with your ad unit slot ID
 */
export default function AdSense({
  slot,
  format = "auto",
  fullWidthResponsive = true,
  label,
  className = "",
}: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Only push once per mount
    if (pushed.current) return;
    if (!adRef.current) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
      pushed.current = true;
    } catch (e) {
      // AdSense not loaded yet or blocked — fail silently
    }
  }, []);

  return (
    <div className={`my-6 ${className}`}>
      {label && (
        <p className="mb-1 text-center text-xs text-gray-400 dark:text-gray-500">
          {label}
        </p>
      )}
      <ins
        ref={adRef}
        className="adsbygoogle block text-center"
        data-ad-client="ca-pub-6833582243561020"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
        style={{
          display: "block",
          overflow: "hidden",
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
}
