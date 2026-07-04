// ─── Formatters ──────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatSAT(scores: { math25th: number; math75th: number; reading25th: number; reading75th: number }): string {
  const total25th = scores.math25th + scores.reading25th;
  const total75th = scores.math75th + scores.reading75th;
  return `${total25th}-${total75th}`;
}

export function formatACT(act25th: number, act75th: number): string {
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

export function getCollegeLogoUrl(website: string): string {
  const domain = website.replace(/^https?:\/\/(www\.)?/, "");
  return `https://logos.hunter.io/${domain}`;
}

// ─── Color Helpers ───────────────────────────────────────────────

export function acceptanceRateColor(rate: number): string {
  if (rate < 20) return "text-red-600";
  if (rate < 40) return "text-orange-500";
  if (rate < 65) return "text-yellow-600";
  return "text-green-600";
}

export function graduationRateColor(rate: number): string {
  if (rate < 20) return "text-red-600";
  if (rate < 40) return "text-yellow-600";
  if (rate < 60) return "text-blue-600";
  return "text-green-600";
}

export function costColor(cost: number): string {
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
