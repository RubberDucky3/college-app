// ─── National College Data ──────────────────────────────────────
//
// Backward-compatible re-export from the Scorecard-based data loader.
// All consumers should now import directly from @/lib/college-data.

export {
  allColleges as nationalUniversities,
  collegeMap as nationalUniversityMap,
  nationalStats,
} from "@/lib/college-data";
