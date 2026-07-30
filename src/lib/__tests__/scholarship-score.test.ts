import { describe, it, expect } from "vitest";
import {
  scoreScholarship,
  rankScholarships,
  normalizeGpa,
  fitLabel,
  type ScoreInput,
} from "../scholarship-score";
import type { Scholarship } from "@/types";

// ─── Test Helpers ────────────────────────────────────────────────

function makeScholarship(overrides: Partial<Scholarship> = {}): Scholarship {
  return {
    id: "test",
    name: "Test Scholarship",
    type: "merit",
    provider: "Test Provider",
    description: "A scholarship.",
    amount: 5000,
    eligibility: [],
    deadline: "January 1",
    website: "https://example.com",
    essayRequired: false,
    renewable: false,
    national: true,
    ...overrides,
  };
}

const BLANK: ScoreInput = {
  gpa: 0,
  gpaScale: 4.0,
  state: "",
  gradeLevel: "",
  pellEligible: false,
  hasLeadership: false,
  intendedMajor: "",
  satTotal: 0,
  actComposite: 0,
};

function input(overrides: Partial<ScoreInput> = {}): ScoreInput {
  return { ...BLANK, ...overrides };
}

// ─── GPA normalization ───────────────────────────────────────────

describe("normalizeGpa", () => {
  it("passes through a 4.0 scale", () => {
    expect(normalizeGpa(3.5, 4.0)).toBe(3.5);
  });

  it("converts a 5.0 weighted scale", () => {
    expect(normalizeGpa(5, 5.0)).toBe(4);
  });

  it("converts a 100-point scale", () => {
    expect(normalizeGpa(95, 100)).toBeCloseTo(3.8);
  });

  it("treats unset GPA as 0", () => {
    expect(normalizeGpa(0, 4.0)).toBe(0);
  });
});

// ─── Scoring ─────────────────────────────────────────────────────

describe("scoreScholarship", () => {
  it("returns neutral when nothing is known", () => {
    const fit = scoreScholarship(
      makeScholarship({ eligibility: ["Minimum 3.0 GPA"] }),
      BLANK
    );
    expect(fit.score).toBe(5);
    expect(fit.verify).toContain("Minimum 3.0 GPA");
  });

  it("rewards a met GPA minimum", () => {
    const fit = scoreScholarship(
      makeScholarship({ eligibility: ["Minimum 3.0 GPA"] }),
      input({ gpa: 3.8 })
    );
    expect(fit.score).toBeGreaterThan(5);
    expect(fit.reasons).toHaveLength(1);
    expect(fit.blockers).toHaveLength(0);
  });

  it("penalizes a missed GPA minimum", () => {
    const fit = scoreScholarship(
      makeScholarship({ eligibility: ["Minimum 3.3 GPA"] }),
      input({ gpa: 2.5 })
    );
    expect(fit.score).toBeLessThan(5);
    expect(fit.blockers).toHaveLength(1);
  });

  it("compares GPA on the student's own scale", () => {
    // 4.5 on a 5.0 scale = 3.6 on a 4.0 scale, which clears a 3.3 minimum.
    const fit = scoreScholarship(
      makeScholarship({ eligibility: ["Minimum 3.3 GPA"] }),
      input({ gpa: 4.5, gpaScale: 5.0 })
    );
    expect(fit.blockers).toHaveLength(0);
    expect(fit.reasons).toHaveLength(1);
  });

  it("blocks out-of-state students on a Texas residency requirement", () => {
    const s = makeScholarship({ eligibility: ["Texas resident"] });
    expect(scoreScholarship(s, input({ state: "CA" })).blockers).toHaveLength(1);
    expect(scoreScholarship(s, input({ state: "TX" })).reasons).toHaveLength(1);
    expect(scoreScholarship(s, input({ state: "Texas" })).reasons).toHaveLength(1);
    // Unknown residency must not count against the scholarship.
    expect(scoreScholarship(s, BLANK).blockers).toHaveLength(0);
  });

  it("never fails a student on financial need", () => {
    // An unchecked Pell box means "we don't know", not "not eligible".
    const s = makeScholarship({ eligibility: ["Pell-eligible"] });
    expect(scoreScholarship(s, BLANK).blockers).toHaveLength(0);
    expect(scoreScholarship(s, input({ pellEligible: true })).reasons).toHaveLength(1);
  });

  it("sends uncovered criteria to verify instead of scoring them", () => {
    const fit = scoreScholarship(
      makeScholarship({ eligibility: ["Hispanic heritage"] }),
      input({ gpa: 4.0 })
    );
    expect(fit.score).toBe(5);
    expect(fit.verify).toEqual(["Hispanic heritage"]);
  });

  it("blocks a non-senior on a senior-only scholarship", () => {
    const s = makeScholarship({ eligibility: ["U.S. high school senior"] });
    expect(scoreScholarship(s, input({ gradeLevel: "sophomore" })).blockers).toHaveLength(1);
    expect(scoreScholarship(s, input({ gradeLevel: "senior" })).reasons).toHaveLength(1);
  });

  it("does not read 'system' as STEM", () => {
    const fit = scoreScholarship(
      makeScholarship({
        eligibility: ["Plan to attend UT Austin or UT system school"],
      }),
      input({ intendedMajor: "English" })
    );
    expect(fit.reasons).toHaveLength(0);
    expect(fit.blockers).toHaveLength(0);
    expect(fit.verify).toHaveLength(1);
  });

  it("matches a real STEM requirement", () => {
    const s = makeScholarship({ eligibility: ["Pursuing a STEM degree"] });
    expect(scoreScholarship(s, input({ intendedMajor: "Computer Engineering" })).reasons)
      .toHaveLength(1);
    expect(scoreScholarship(s, input({ intendedMajor: "History" })).blockers)
      .toHaveLength(1);
  });

  it("clamps the score to 1-10", () => {
    const impossible = makeScholarship({
      eligibility: ["Texas resident", "Minimum 3.5 GPA", "U.S. high school senior"],
    });
    const fit = scoreScholarship(
      impossible,
      input({ state: "NY", gpa: 2.0, gradeLevel: "freshman" })
    );
    expect(fit.score).toBe(1);
  });
});

// ─── Ranking ─────────────────────────────────────────────────────

describe("rankScholarships", () => {
  it("sorts best fit first and breaks ties by amount", () => {
    const bad = makeScholarship({ id: "bad", eligibility: ["Texas resident"] });
    const good = makeScholarship({
      id: "good",
      amount: 1000,
      eligibility: ["Minimum 3.0 GPA"],
    });
    const goodRicher = makeScholarship({
      id: "rich",
      amount: 50000,
      eligibility: ["Minimum 3.0 GPA"],
    });

    const ranked = rankScholarships(
      [bad, good, goodRicher],
      input({ gpa: 4.0, state: "CA" })
    );
    expect(ranked.map((r) => r.scholarship.id)).toEqual(["rich", "good", "bad"]);
  });
});

describe("fitLabel", () => {
  it("maps scores to labels", () => {
    expect(fitLabel(9)).toBe("Strong fit");
    expect(fitLabel(5)).toBe("Possible fit");
    expect(fitLabel(2)).toBe("Unlikely");
  });
});
