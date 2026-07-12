// ─── Formatters ──────────────────────────────────────────────────

export function formatCurrency(amount: number | null): string {
  if (amount == null) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number | null, decimals = 1): string {
  if (value == null) return "N/A";
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number | null): string {
  if (value == null) return "N/A";
  return new Intl.NumberFormat("en-US").format(value);
}

/** SAT range is 200-800 per section; any 0 means no data was reported. */
export function formatSAT(scores: {
  math25th: number | null;
  math75th: number | null;
  reading25th: number | null;
  reading75th: number | null;
}): string {
  const m25 = scores.math25th ?? 0;
  const m75 = scores.math75th ?? 0;
  const r25 = scores.reading25th ?? 0;
  const r75 = scores.reading75th ?? 0;
  if (m25 + m75 + r25 + r75 === 0) return "N/A";
  return `${m25 + r25}-${m75 + r75}`;
}

export function formatACT(act25th: number | null, act75th: number | null): string {
  if (act25th == null || act75th == null) return "N/A";
  return `${act25th}-${act75th}`;
}

// ─── Admissions Policy Formatters ───────────────────────────────

export function formatTestPolicy(policy: string): string {
  const map: Record<string, string> = {
    required: "Required",
    recommended: "Recommended",
    optional: "Optional",
    "considered-if-submitted": "Considered if Submitted",
    "not-considered": "Not Considered for Admission",
    "test-flexible": "Test Flexible",
  };
  return map[policy] || policy;
}

export function formatInterviewPolicy(policy: string): string {
  const map: Record<string, string> = {
    required: "Required",
    recommended: "Recommended",
    optional: "Optional",
    "not-offered": "Not Offered",
    informational: "Informational Only",
  };
  return map[policy] || policy;
}

export function testPolicyColor(policy: string): string {
  if (policy === "required") return "text-red-600";
  if (policy === "not-considered") return "text-green-600";
  if (policy === "optional") return "text-yellow-600";
  return "text-gray-700";
}

export function formatCommonApp(accepted: boolean): string {
  return accepted ? "Accepted ✓" : "Not Accepted";
}

export function formatYesNo(value: boolean | string): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value || "N/A";
}

// ─── Logo ──────────────────────────────────────────────────────────

/** Extract domain from a college website URL. */
function extractDomain(website: string): string {
  return website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, "");
}

/**
 * Return Clearbit logo URL for the college's domain.
 * Clearbit has a generous free tier (no API key needed for basic usage).
 * Falls back on the browser to a generated SVG-initials data URI via
 * the onError handler in the <img> tag.
 */
export function getCollegeLogoUrl(website: string): string {
  if (!website) return "";
  const domain = extractDomain(website);
  return `https://logo.clearbit.com/${domain}`;
}

/**
 * Generate an SVG data URI with the school's initials on a colored circle.
 * Used as an img src fallback when the Clearbit logo fails to load.
 *
 * @param name  - Full school name (e.g. "University of Texas at Austin")
 * @param color - CSS color string for the background circle
 */
export function getCollegeInitialsLogo(name: string, color: string): string {
  // Extract initials (first letter of each significant word)
  const skipWords = new Set([
    "the", "a", "an", "of", "at", "in", "on", "for", "to", "and",
    "university", "college", "institute", "school", "system",
  ]);
  const words = name.split(/\s+/);
  let initials = "";
  for (const w of words) {
    const clean = w.replace(/[^a-zA-Z]/g, "");
    if (clean.length > 0) {
      const lower = clean.toLowerCase();
      // Skip "University of X" pattern words, take the last significant word
      if (!skipWords.has(lower)) {
        initials += clean[0].toUpperCase();
      }
    }
  }
  // If initials are too long, take first 3 chars
  if (initials.length > 3) initials = initials.slice(0, 3);
  // If no initials extracted, use first letter of name
  if (!initials) initials = name[0]?.toUpperCase() || "U";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="12" fill="${color}"/>
    <text x="32" y="32" text-anchor="middle" dominant-baseline="central"
          font-family="system-ui, sans-serif" font-size="24" font-weight="700" fill="white">${initials}</text>
  </svg>`.trim();

  return `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString("base64")}`;
}

// ─── Color Helpers ───────────────────────────────────────────────

export function acceptanceRateColor(rate: number | null): string {
  if (rate == null) return "text-gray-400";
  if (rate < 20) return "text-red-600";
  if (rate < 40) return "text-orange-500";
  if (rate < 65) return "text-yellow-600";
  return "text-green-600";
}

export function graduationRateColor(rate: number | null): string {
  if (rate == null) return "text-gray-400";
  if (rate < 20) return "text-red-600";
  if (rate < 40) return "text-yellow-600";
  if (rate < 60) return "text-blue-600";
  return "text-green-600";
}

export function costColor(cost: number | null): string {
  if (cost == null) return "text-gray-400";
  if (cost < 15000) return "text-green-600";
  if (cost < 30000) return "text-yellow-600";
  return "text-red-600";
}

// ─── Debounce ────────────────────────────────────────────────────

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ─── Slug / ID helpers ──────────────────────────────────────────

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
