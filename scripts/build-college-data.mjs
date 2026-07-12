/**
 * ETL: College Scorecard CSV → src/data/colleges/<state>.json
 *
 * Reads Most-Recent-Cohorts-Institution.csv (6,273 rows, 3,308 columns),
 * filters to degree-granting institutions (HIGHDEG >= 3),
 * maps Scorecard columns to our College type,
 * derives programs (majors) from PCIP CIP-code percentage fields,
 * generates deterministic brand colors from school name,
 * and writes per-state JSON files + a master index.
 */

import { createReadStream, writeFileSync, mkdirSync } from "node:fs";
import { parse } from "csv-parse";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ── Config ────────────────────────────────────────────────────────────

const CSV_PATH = path.resolve(
  fileURLToPath(import.meta.url),
  "../../College_Scorecard_Raw_Data_06032026",
  "Most-Recent-Cohorts-Institution.csv",
);
const OUT_DIR = path.resolve(
  fileURLToPath(import.meta.url),
  "../../src/data/colleges",
);

// ── CIP → Program Category mapping ────────────────────────────────────
// PCIP fields = % of degrees awarded by 2-digit CIP code.
// We include a program in a college's list when its PCIP value >= THRESHOLD.

const PCIP_THRESHOLD = 5; // percent

const CIP_TO_PROGRAM = {
  PCIP01: "Agriculture",
  PCIP03: "Science & Research",
  PCIP04: "Architecture",
  PCIP05: "Liberal Arts",
  PCIP09: "Communication",
  PCIP10: "Computer Science",
  PCIP11: "Computer Science",
  PCIP12: "Liberal Arts",
  PCIP13: "Education",
  PCIP14: "Engineering",
  PCIP15: "Engineering",
  PCIP16: "Liberal Arts",
  PCIP19: "Liberal Arts",
  PCIP22: "Law",
  PCIP23: "Liberal Arts",
  PCIP24: "Liberal Arts",
  PCIP25: "Liberal Arts",
  PCIP26: "Biology",
  PCIP27: "Science & Research",
  PCIP29: "Liberal Arts",
  PCIP30: "Liberal Arts",
  PCIP31: "Liberal Arts",
  PCIP38: "Liberal Arts",
  PCIP39: "Theology",
  PCIP40: "Science & Research",
  PCIP41: "Science & Research",
  PCIP42: "Liberal Arts",
  PCIP43: "Criminal Justice",
  PCIP44: "Liberal Arts",
  PCIP45: "Liberal Arts",
  PCIP46: "Engineering",
  PCIP47: "Engineering",
  PCIP48: "Engineering",
  PCIP49: "Liberal Arts",
  PCIP50: "Arts",
  PCIP51: "Health & Nursing",
  PCIP52: "Business",
  PCIP54: "Liberal Arts",
};

// ── Code mapping helpers ──────────────────────────────────────────────

const CONTROL_MAP = {
  "1": "public",
  "2": "private",
  "3": "for-profit",
};

function localeToCategory(localeCode) {
  const code = parseInt(localeCode, 10);
  if (code >= 11 && code <= 13) return "urban";
  if (code >= 21 && code <= 23) return "suburban";
  if (code >= 31 && code <= 33) return "rural";
  if (code >= 41 && code <= 43) return "rural";
  return "suburban";
}

function classifySize(ugds) {
  if (ugds == null || ugds <= 0) return "small";
  if (ugds < 2000) return "small";
  if (ugds < 7500) return "medium";
  if (ugds < 15000) return "large";
  return "very-large";
}

function parseNum(val) {
  if (val == null || val === "" || val === "NA" || val === "NULL") return null;
  const n = Number(val);
  return isNaN(n) ? null : n;
}

function parsePct(val) {
  // Scorecard stores percentages as decimals (0.2664 = 26.64%)
  const n = parseNum(val);
  if (n == null) return null;
  return Math.round(n * 100);
}

function parseDollars(val) {
  return parseNum(val);
}

function parseBool(val) {
  if (val == null || val === "NA") return false;
  if (val === "1" || val === "true" || val === "TRUE") return true;
  return false;
}

// ── ID / Slug generation ─────────────────────────────────────────────

function makeId(name) {
  // Remove "The" prefix, lowercase, keep alphanumeric + spaces, collapse
  let slug = name
    .replace(/^(The|An)\s+/i, "")
    .replace(/['']/g, "")
    .trim();
  slug = slug.toLowerCase();
  // Replace special chars with hyphens
  slug = slug.replace(/[^a-z0-9\s-]/g, "");
  slug = slug.replace(/\s+/g, "-");
  slug = slug.replace(/-+/g, "-");
  slug = slug.replace(/^-|-$/g, "");
  return slug;
}

// ── Deterministic brand colors from name ────────────────────────────
// Curated palette of 60 professional colors that look good as accent bars.
// Each is distinct from its neighbors and works on white backgrounds.

const BRAND_PALETTE = [
  "#1a56db", "#7c3aed", "#db2777", "#dc2626", "#ea580c",
  "#ca8a04", "#16a34a", "#0891b2", "#4f46e5", "#be185d",
  "#b45309", "#65a30d", "#0d9488", "#4338ca", "#c026d3",
  "#d97706", "#059669", "#2563eb", "#9333ea", "#e11d48",
  "#d45211", "#a16207", "#15803d", "#0e7490", "#6366f1",
  "#a21caf", "#ea580c", "#4d7c0f", "#0f766e", "#3b82f6",
  "#7e22ce", "#db2777", "#c2410c", "#854d0e", "#166534",
  "#155e75", "#4338ca", "#86198f", "#b45309", "#4d7c0f",
  "#115e59", "#1d4ed8", "#6b21a8", "#9d174d", "#9a3412",
  "#713f12", "#14532d", "#164e63", "#3730a3", "#701a75",
  "#92400e", "#3f6212", "#0f766e", "#1e40af", "#581c87",
  "#831843", "#7c2d12", "#78350f", "#134e4a", "#1e3a5f",
];

function hashColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  const idx = Math.abs(hash) % BRAND_PALETTE.length;
  return BRAND_PALETTE[idx];
}

// ── Derive programs from PCIP fields ──────────────────────────────────

function derivePrograms(row) {
  const programs = [];
  for (const [pcip, program] of Object.entries(CIP_TO_PROGRAM)) {
    const pct = parseNum(row[pcip]);
    if (pct != null && pct * 100 >= PCIP_THRESHOLD) {
      if (!programs.includes(program)) {
        programs.push(program);
      }
    }
  }
  // Ensure at least one program so the filter doesn't break
  if (programs.length === 0) {
    programs.push("Liberal Arts");
  }
  return programs.sort();
}

// ── MAIN ──────────────────────────────────────────────────────────────

async function main() {
  console.log(`Reading CSV: ${CSV_PATH}`);

  const records = [];
  const parser = createReadStream(CSV_PATH).pipe(
    parse({
      columns: true,
      relax_quotes: true,
      relax_column_count: true,
      skip_records_with_error: true,
    }),
  );

  for await (const row of parser) {
    records.push(row);
  }
  console.log(`  Total CSV rows: ${records.length}`);

  // Filter to degree-granting institutions (HIGHDEG >= 3 = at least bachelor's)
  const degreeGranting = records.filter(
    (r) => parseInt(r.HIGHDEG, 10) >= 3,
  );
  console.log(`  Degree-granting (HIGHDEG>=3): ${degreeGranting.length}`);

  // Transform each row into our College type
  const colleges = degreeGranting.map((r) => {
    const name = r.INSTNM?.trim() || "Unknown";
    const city = r.CITY?.trim() || "";
    const ugds = parseNum(r.UGDS);
    const programs = derivePrograms(r);

    return {
      id: makeId(name) || `college-${r.UNITID}`,
      name,
      city,
      state: r.STABBR?.trim() || "",
      zip: r.ZIP?.trim() || "",
      website: r.INSTURL?.trim() || "",
      applicationUrl: "", // not in Scorecard
      type: CONTROL_MAP[r.CONTROL] || "private",
      locale: localeToCategory(r.LOCALE),
      size: classifySize(ugds),

      // Admissions (null = not reported by the college)
      acceptanceRate: parsePct(r.ADM_RATE), // null = not reported
      satMath25th: parseNum(r.SATMT25),
      satMath75th: parseNum(r.SATMT75),
      satReading25th: parseNum(r.SATVR25),
      satReading75th: parseNum(r.SATVR75),
      actComposite25th: parseNum(r.ACTCM25),
      actComposite75th: parseNum(r.ACTCM75),
      applicationFee: 0, // not in Scorecard
      applicationDeadline: "Check website",

      // Admissions requirements (not in Scorecard)
      admissionInterview: "not-offered",
      standardizedTestPolicy: "optional",
      satActScoresMustBeReceivedBy: "Check website",

      // Application details (not in Scorecard)
      earlyDecisionDeadline: "N/A",
      earlyActionDeadline: "N/A",
      commonApplicationAccepted: false,
      housingDepositDeadline: "N/A",
      priorityApplicationDeadline: "N/A",
      notificationDate: "Rolling",

      // Entering class stats (limited in Scorecard)
      earlyDecisionAcceptanceRate: null,
      studentsSubmittingSatPct: null,
      studentsSubmittingActPct: null,

      // Cost (null = not reported)
      tuitionInState: parseDollars(r.TUITIONFEE_IN),
      tuitionOutOfState: parseDollars(r.TUITIONFEE_OUT),
      feesInState: 0, // not directly available
      feesOutOfState: 0,
      roomBoardOnCampus: parseDollars(r.ROOMBOARD_ON),
      avgNetPrice: parseDollars(r.NPT4_PUB || r.NPT4_PRIV),
      booksAndSupplies: parseDollars(r.BOOKSUPPLY),

      // Financial aid (null = not reported)
      pctReceivingGrants: 0, // not directly in Scorecard
      avgGrantAid: 0,
      pctReceivingPellGrants: parsePct(r.PCTPELL),
      avgPellGrant: 0,
      pctReceivingFederalLoans: parsePct(r.PCTFLOAN),
      avgFederalLoan: 0,

      // Outcomes (null = not reported)
      graduationRate4yr: parsePct(r.C100_4),
      graduationRate6yr: parsePct(r.C150_4),
      retentionRate: parsePct(r.RET_FT4),
      medianEarnings10yr: parseDollars(r.MD_EARN_WNE_P10),
      medianEarnings6yr: parseDollars(r.MD_EARN_WNE_P6),
      repaymentRate: parsePct(r.RPY_3YR_RT),

      // Demographics (null = not reported)
      totalEnrollment: parseNum(r.UGDS),
      undergraduateEnrollment: parseNum(r.UGDS),
      malePct: parsePct(r.UGDS_MEN),
      femalePct: parsePct(r.UGDS_WOMEN),
      diversityIndex: 0, // not computed
      internationalPct: 0,

      // Programs
      programs,

      // Branding
      primaryColor: hashColor(name),
      secondaryColor: "#FFFFFF",

      // Hidden Scorecard metadata (useful for debugging)
      _unitId: r.UNITID,
    };
  });

  console.log(`  Transformed colleges: ${colleges.length}`);

  // Group by state
  const byState = {};
  for (const c of colleges) {
    const state = c.state || "ZZ";
    if (!byState[state]) byState[state] = [];
    byState[state].push(c);
  }

  // Write per-state files
  mkdirSync(OUT_DIR, { recursive: true });
  const stateList = [];
  for (const [state, list] of Object.entries(byState)) {
    const filePath = path.join(OUT_DIR, `${state}.json`);
    writeFileSync(filePath, JSON.stringify(list, null, 2));
    stateList.push({ state, count: list.length, file: `${state}.json` });
    console.log(`  Wrote ${filePath} (${list.length} colleges)`);
  }

  // Write index
  const index = {
    generated: new Date().toISOString(),
    source: "College Scorecard (Most-Recent-Cohorts-Institution.csv)",
    totalColleges: colleges.length,
    states: stateList.sort((a, b) => a.state.localeCompare(b.state)),
  };
  writeFileSync(
    path.join(OUT_DIR, "index.json"),
    JSON.stringify(index, null, 2),
  );
  console.log(`  Wrote index.json`);

  // Write merged colleges.json (single file for easy import)
  const mergedPath = path.join(OUT_DIR, "colleges.json");
  writeFileSync(mergedPath, JSON.stringify(colleges, null, 2));
  console.log(`  Wrote ${mergedPath} (${colleges.length} colleges)`);

  console.log(`\n✅ Done. ${colleges.length} colleges across ${stateList.length} states.`);
}

main().catch((err) => {
  console.error("ETL failed:", err);
  process.exit(1);
});
