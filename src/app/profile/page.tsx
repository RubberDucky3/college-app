"use client";

import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import type { Extracurricular, Award } from "@/hooks/useProfile";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN",
  "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV",
  "NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN",
  "TX","UT","VT","VA","WA","WV","WI","WY",
];

const EC_TYPES: Extracurricular["type"][] = [
  "club","sport","volunteer","work","research","art","other",
];

let ecCounter = 0;
let awardCounter = 0;

export default function ProfilePage() {
  const { profile, setProfile, resetProfile, hasProfile, getAdmissionsStrength } = useProfile();
  const [activeTab, setActiveTab] = useState<"basics" | "scores" | "activities" | "goals">("basics");
  const [saved, setSaved] = useState(false);

  const strength = getAdmissionsStrength();

  const notifySaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setProfile({ [field]: value });
  };

  // ─── Extracurriculars ──────────────────────────────

  const addEC = () => {
    ecCounter++;
    const ec: Extracurricular = {
      id: `ec-${ecCounter}-${Date.now()}`,
      name: "",
      type: "club",
      years: 1,
      hoursPerWeek: 1,
      leadership: false,
      description: "",
    };
    setProfile({ extracurriculars: [...profile.extracurriculars, ec] });
  };

  const updateEC = (id: string, updates: Partial<Extracurricular>) => {
    setProfile({
      extracurriculars: profile.extracurriculars.map((ec) =>
        ec.id === id ? { ...ec, ...updates } : ec
      ),
    });
  };

  const removeEC = (id: string) => {
    setProfile({
      extracurriculars: profile.extracurriculars.filter((ec) => ec.id !== id),
    });
  };

  // ─── Awards ─────────────────────────────────────────

  const addAward = () => {
    awardCounter++;
    const award: Award = {
      id: `award-${awardCounter}-${Date.now()}`,
      name: "",
      level: "school",
      year: new Date().getFullYear(),
      description: "",
    };
    setProfile({ awards: [...profile.awards, award] });
  };

  const updateAward = (id: string, updates: Partial<Award>) => {
    setProfile({
      awards: profile.awards.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    });
  };

  const removeAward = (id: string) => {
    setProfile({
      awards: profile.awards.filter((a) => a.id !== id),
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Student Profile
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Your data stays on your device. Used for personalized matches and
            admissions insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              Saved ✓
            </span>
          )}
          {hasProfile && (
            <button
              onClick={() => {
                if (confirm("Clear all profile data?")) resetProfile();
              }}
              className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Admissions Strength Bar */}
      {hasProfile && strength > 0 && (
        <div className="mb-8 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-white p-5 dark:border-indigo-800 dark:from-indigo-950/30 dark:to-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                Admissions Profile Strength
              </span>
              <p className="text-xs text-indigo-500 dark:text-indigo-400">
                Estimated composite based on your GPA, scores, and activities.
                Not an official admissions guarantee.
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">
                {strength}/100
              </span>
            </div>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-indigo-200 dark:bg-indigo-900/50">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${strength}%` }}
            />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
        {[
          { id: "basics", label: "Basics" },
          { id: "scores", label: "Scores & Courses" },
          { id: "activities", label: "Activities" },
          { id: "goals", label: "Goals" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? "bg-white text-blue-700 shadow-sm dark:bg-gray-700 dark:text-blue-300"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Tab: Basics ─────────────────────────────── */}
      {activeTab === "basics" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
              Personal Info
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => {
                    handleChange("firstName", e.target.value);
                    notifySaved();
                  }}
                  placeholder="Your first name"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => {
                    handleChange("lastName", e.target.value);
                    notifySaved();
                  }}
                  placeholder="Your last name"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Graduation Year
                </label>
                <select
                  value={profile.gradYear}
                  onChange={(e) => {
                    handleChange("gradYear", parseInt(e.target.value));
                    notifySaved();
                  }}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                >
                  {[2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  State
                </label>
                <select
                  value={profile.state}
                  onChange={(e) => {
                    handleChange("state", e.target.value);
                    notifySaved();
                  }}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="">Select state</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Financial Info */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
              Financial Context
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Estimated Family Income
                </label>
                <input
                  type="number"
                  value={profile.familyIncome || ""}
                  onChange={(e) => {
                    handleChange("familyIncome", parseInt(e.target.value) || 0);
                    notifySaved();
                  }}
                  placeholder="$0"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="inline-flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.pellEligible}
                    onChange={(e) => {
                      handleChange("pellEligible", e.target.checked);
                      notifySaved();
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Likely Pell Grant eligible
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab: Scores & Courses ───────────────────── */}
      {activeTab === "scores" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
              GPA & Class Rank
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  GPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={profile.gpa || ""}
                  onChange={(e) => {
                    handleChange("gpa", parseFloat(e.target.value) || 0);
                    notifySaved();
                  }}
                  placeholder="3.5"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  GPA Scale
                </label>
                <select
                  value={profile.gpaScale}
                  onChange={(e) => {
                    handleChange("gpaScale", parseInt(e.target.value));
                    notifySaved();
                  }}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value={4.0}>4.0 (Unweighted)</option>
                  <option value={5.0}>5.0 (Weighted)</option>
                  <option value={100}>100-Point Scale</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Class Rank (optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={profile.classRank || ""}
                    onChange={(e) => {
                      handleChange("classRank", parseInt(e.target.value) || 0);
                      notifySaved();
                    }}
                    placeholder="Top"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  />
                  <span className="mt-2 text-sm text-gray-400">/</span>
                  <input
                    type="number"
                    min="1"
                    value={profile.classSize || ""}
                    onChange={(e) => {
                      handleChange("classSize", parseInt(e.target.value) || 0);
                      notifySaved();
                    }}
                    placeholder="500"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
              Standardized Tests
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  SAT Math (200–800)
                </label>
                <input
                  type="number"
                  min="200"
                  max="800"
                  step="10"
                  value={profile.satMath || ""}
                  onChange={(e) => {
                    handleChange("satMath", parseInt(e.target.value) || 0);
                    notifySaved();
                  }}
                  placeholder="650"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  SAT Reading (200–800)
                </label>
                <input
                  type="number"
                  min="200"
                  max="800"
                  step="10"
                  value={profile.satReading || ""}
                  onChange={(e) => {
                    handleChange("satReading", parseInt(e.target.value) || 0);
                    notifySaved();
                  }}
                  placeholder="650"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ACT Composite (1–36)
                </label>
                <input
                  type="number"
                  min="1"
                  max="36"
                  step="0.5"
                  value={profile.actComposite || ""}
                  onChange={(e) => {
                    handleChange("actComposite", parseFloat(e.target.value) || 0);
                    notifySaved();
                  }}
                  placeholder="28"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
            {profile.satMath > 0 && profile.satReading > 0 && (
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Total SAT: <strong>{profile.satMath + profile.satReading}</strong>
              </p>
            )}
          </div>

          {/* Advanced Courses */}
          {(["apCourses", "ibCourses", "honorsCourses"] as const).map(
            (field) => (
              <div
                key={field}
                className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
              >
                <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
                  {field === "apCourses"
                    ? "AP Courses"
                    : field === "ibCourses"
                      ? "IB Courses"
                      : "Honors Courses"}
                </h2>
                {profile[field].length === 0 ? (
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    No courses added yet.
                  </p>
                ) : (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {profile[field].map((course, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                      >
                        {course}
                        <button
                          onClick={() => {
                            setProfile({
                              [field]: profile[field].filter(
                                (_: string, j: number) => j !== i
                              ),
                            });
                            notifySaved();
                          }}
                          className="text-blue-400 hover:text-blue-600"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={
                      field === "apCourses"
                        ? "e.g., AP Calculus BC"
                        : field === "ibCourses"
                          ? "e.g., IB Biology HL"
                          : "e.g., Honors English"
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value.trim()) {
                        setProfile({
                          [field]: [...profile[field], e.currentTarget.value.trim()],
                        });
                        e.currentTarget.value = "";
                        notifySaved();
                      }
                    }}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  />
                  <button
                    onClick={() => notifySaved()}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    type="button"
                  >
                    Add
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* ─── Tab: Activities ──────────────────────────── */}
      {activeTab === "activities" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Extracurriculars
              </h2>
              <button
                onClick={() => {
                  addEC();
                  notifySaved();
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                + Add Activity
              </button>
            </div>
            {profile.extracurriculars.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">
                No activities yet. Add your clubs, sports, volunteer work, and
                more.
              </p>
            ) : (
              <div className="space-y-4">
                {profile.extracurriculars.map((ec) => (
                  <div
                    key={ec.id}
                    className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        value={ec.name}
                        onChange={(e) => {
                          updateEC(ec.id, { name: e.target.value });
                          notifySaved();
                        }}
                        placeholder="Activity name"
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      />
                      <select
                        value={ec.type}
                        onChange={(e) => {
                          updateEC(ec.id, {
                            type: e.target.value as Extracurricular["type"],
                          });
                          notifySaved();
                        }}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      >
                        {EC_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">
                            Years
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="4"
                            value={ec.years}
                            onChange={(e) => {
                              updateEC(ec.id, {
                                years: parseInt(e.target.value) || 1,
                              });
                              notifySaved();
                            }}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">
                            Hours/Week
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="40"
                            value={ec.hoursPerWeek}
                            onChange={(e) => {
                              updateEC(ec.id, {
                                hoursPerWeek: parseInt(e.target.value) || 1,
                              });
                              notifySaved();
                            }}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={ec.leadership}
                            onChange={(e) => {
                              updateEC(ec.id, { leadership: e.target.checked });
                              notifySaved();
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Leadership
                          </span>
                        </label>
                        <button
                          onClick={() => {
                            removeEC(ec.id);
                            notifySaved();
                          }}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={ec.description}
                      onChange={(e) => {
                        updateEC(ec.id, { description: e.target.value });
                        notifySaved();
                      }}
                      placeholder="Brief description of your role and impact..."
                      rows={2}
                      className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Awards */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Awards & Honors
              </h2>
              <button
                onClick={() => {
                  addAward();
                  notifySaved();
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                + Add Award
              </button>
            </div>
            {profile.awards.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">
                No awards yet. Add honors, competitions, recognitions.
              </p>
            ) : (
              <div className="space-y-3">
                {profile.awards.map((award) => (
                  <div
                    key={award.id}
                    className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                  >
                    <input
                      type="text"
                      value={award.name}
                      onChange={(e) => {
                        updateAward(award.id, { name: e.target.value });
                        notifySaved();
                      }}
                      placeholder="Award name"
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    />
                    <select
                      value={award.level}
                      onChange={(e) => {
                        updateAward(award.id, {
                          level: e.target.value as Award["level"],
                        });
                        notifySaved();
                      }}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    >
                      {(["school","regional","state","national","international"] as const).map(
                        (l) => (
                          <option key={l} value={l}>
                            {l.charAt(0).toUpperCase() + l.slice(1)}
                          </option>
                        )
                      )}
                    </select>
                    <input
                      type="number"
                      value={award.year}
                      onChange={(e) => {
                        updateAward(award.id, {
                          year: parseInt(e.target.value) || 2026,
                        });
                        notifySaved();
                      }}
                      className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    />
                    <button
                      onClick={() => {
                        removeAward(award.id);
                        notifySaved();
                      }}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Tab: Goals ───────────────────────────────── */}
      {activeTab === "goals" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
              Academic & Career Goals
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Intended Major / Field of Study
                </label>
                <input
                  type="text"
                  value={profile.intendedMajor}
                  onChange={(e) => {
                    handleChange("intendedMajor", e.target.value);
                    notifySaved();
                  }}
                  placeholder="e.g., Computer Science, Biology, Economics..."
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Career Goal
                </label>
                <input
                  type="text"
                  value={profile.careerGoal}
                  onChange={(e) => {
                    handleChange("careerGoal", e.target.value);
                    notifySaved();
                  }}
                  placeholder="e.g., Software Engineer, Doctor, Researcher..."
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          {hasProfile && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/50 dark:bg-blue-950/30">
              <h2 className="text-lg font-bold text-blue-900 dark:text-blue-100">
                Ready to find your match?
              </h2>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                Use your profile data to get personalized college matches.
              </p>
              <Link
                href="/match"
                className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition"
              >
                Take the Match Quiz →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
