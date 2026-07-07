"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { nationalUniversities } from "@/lib/national-data";
import { US_CITY_COORDS } from "@/lib/us-coords";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";
import type { College } from "@/types";

// Texas map SVG viewport — project lat/lng to pixel coords
// Texas approximate bounds: lat 25.8-36.5, lng -106.6- -93.5
const MAP_PADDING = 40;
const MAP_WIDTH = 700;
const MAP_HEIGHT = 650;
const TX_MIN_LAT = 25.8;
const TX_MAX_LAT = 36.5;
const TX_MIN_LNG = -106.6;
const TX_MAX_LNG = -93.5;

function project(lat: number, lng: number): { x: number; y: number } {
  const x =
    MAP_PADDING +
    ((lng - TX_MIN_LNG) / (TX_MAX_LNG - TX_MIN_LNG)) *
      (MAP_WIDTH - 2 * MAP_PADDING);
  const y =
    MAP_PADDING +
    ((TX_MAX_LAT - lat) / (TX_MAX_LAT - TX_MIN_LAT)) *
      (MAP_HEIGHT - 2 * MAP_PADDING);
  return { x, y };
}

function getCityCoords(city: string): { lat: number; lng: number } | null {
  return US_CITY_COORDS[city] ?? null;
}

export default function MapPage() {
  const { favorites } = useFavorites();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"all" | "public" | "private">(
    "all"
  );
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const colleges = useMemo(() => {
    let list = [...nationalUniversities];
    if (filterType !== "all")
      list = list.filter((c) => c.type === filterType);
    if (showSavedOnly) list = list.filter((c) => favorites.includes(c.id));
    return list;
  }, [filterType, showSavedOnly, favorites]);

  // Group colleges by city for the map
  const cityGroups = useMemo(() => {
    const groups = new Map<
      string,
      { college: College; coords: { lat: number; lng: number } }[]
    >();
    for (const c of colleges) {
      const coords = getCityCoords(c.city);
      if (!coords) continue;
      const key = `${coords.lat.toFixed(2)}-${coords.lng.toFixed(2)}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push({ college: c, coords });
    }
    return groups;
  }, [colleges]);

  const selected = useMemo(
    () => (selectedId ? nationalUniversities.find((c) => c.id === selectedId) : null),
    [selectedId]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/colleges" className="text-sm text-blue-600 hover:underline">
        ← Back to colleges
      </Link>
      <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
        College Map
      </h1>
      <p className="mt-1 text-gray-600 dark:text-gray-400">
        Explore colleges by location. Click a marker for details.
      </p>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
          {(["all", "public", "private"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 text-sm font-medium ${
                filterType === t
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              } transition-colors first:rounded-l-lg last:rounded-r-lg`}
            >
              {t === "all" ? "All" : t === "public" ? "Public" : "Private"}
            </button>
          ))}
        </div>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showSavedOnly}
            onChange={(e) => setShowSavedOnly(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Saved only
          </span>
        </label>
        <span className="text-sm text-gray-500">
          {colleges.length} college{colleges.length !== 1 ? "s" : ""} shown
        </span>
      </div>

      {/* Map + Detail Panel */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Map */}
        <div className="lg:col-span-2 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="w-full"
            style={{ minHeight: 450 }}
          >
            {/* Texas outline (simplified) */}
            <polygon
              points={[
                [106, 68], // NW panhandle
                [125, 62],
                [145, 55],
                [170, 60],
                [185, 58],
                [200, 50],
                [218, 55],
                [230, 70],
                [240, 80],
                [250, 95],
                [270, 100],
                [285, 110],
                [300, 115],
                [315, 110],
                [330, 105],
                [345, 108],
                [360, 115],
                [385, 120],
                [400, 125],
                [415, 130],
                [430, 140],
                [450, 135],
                [470, 140],
                [485, 145],
                [500, 155],
                [510, 165],
                [525, 170],
                [535, 175],
                [545, 185],
                [555, 195],
                [560, 205],
                [565, 215],
                [570, 225],
                [575, 235],
                [580, 245],
                [585, 255],
                [590, 265],
                [595, 275],
                [600, 285],
                [605, 295],
                [610, 305],
                [615, 315],
                [618, 325],
                [620, 335],
                [622, 345],
                [625, 355],
                [628, 365],
                [630, 375],
                [632, 385],
                [634, 395],
                [636, 405],
                [638, 415],
                [640, 425],
                [642, 435],
                [644, 445],
                [646, 455],
                [648, 465],
                [650, 475],
                [652, 485],
                [654, 495],
                [656, 505],
                [658, 515],
                [660, 525],
                [662, 535],
                [664, 545],
                [666, 555],
                [668, 565],
                [670, 575],
                [672, 585],
                // Turn west along the bottom
                [665, 590],
                [655, 595],
                [640, 600],
                [620, 605],
                [595, 610],
                [570, 612],
                [540, 614],
                [510, 615],
                [480, 614],
                [450, 613],
                [420, 612],
                [390, 610],
                [360, 608],
                [330, 606],
                [300, 604],
                [270, 602],
                [240, 600],
                [220, 598],
                [200, 596],
                [180, 594],
                [160, 590],
                [140, 585],
                [120, 580],
                [100, 575],
                // Go up left side
                [90, 565],
                [80, 550],
                [72, 535],
                [65, 520],
                [60, 505],
                [55, 490],
                [52, 475],
                [50, 460],
                [48, 445],
                [46, 430],
                [44, 415],
                [42, 400],
                [41, 385],
                [40, 370],
                [39, 355],
                [38, 340],
                [37, 325],
                [36, 310],
                [36, 295],
                [36, 280],
                [37, 265],
                [38, 250],
                [40, 235],
                [42, 220],
                [44, 205],
                [47, 190],
                [50, 175],
                [54, 160],
                [58, 145],
                [62, 130],
                [68, 115],
                [76, 100],
                [86, 85],
                [96, 75],
              ]
                .map((p) => p.join(","))
                .join(" ")}
              className="fill-blue-50 stroke-blue-200 dark:fill-blue-950/40 dark:stroke-blue-800"
              strokeWidth="1.5"
            />

            {/* City markers */}
            {Array.from(cityGroups.entries()).map(([key, entries]) => {
              const { coords } = entries[0];
              const { x, y } = project(coords.lat, coords.lng);
              const isSelected = entries.some((e) => e.college.id === selectedId);
              const hasFav = entries.some((e) => favorites.includes(e.college.id));

              return (
                <g
                  key={key}
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedId(
                      selectedId === entries[0].college.id
                        ? null
                        : entries[0].college.id
                    )
                  }
                >
                  {/* Glow for selected */}
                  {isSelected && (
                    <circle cx={x} cy={y} r="14" fill="none" stroke="#3b82f6" strokeWidth="2" opacity={0.5}>
                      <animate
                        attributeName="r"
                        from="14"
                        to="20"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        from="0.5"
                        to="0"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  {/* Marker dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 8 : entries.length === 1 ? 6 : 5}
                    fill={
                      entries.length > 1
                        ? "#8b5cf6"
                        : entries[0].college.type === "public"
                          ? "#22c55e"
                          : "#f59e0b"
                    }
                    stroke={
                      hasFav ? "#3b82f6" : isSelected ? "#1e40af" : "#fff"
                    }
                    strokeWidth={hasFav ? 3 : isSelected ? 2.5 : 1.5}
                    opacity={0.9}
                  />
                  {/* City label */}
                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    className="text-[10px] fill-gray-600 dark:fill-gray-400 font-medium"
                  >
                    {entries.length > 1
                      ? `${entries[0].college.city} (${entries.length})`
                      : entries[0].college.city}
                  </text>
                </g>
              );
            })}

            {/* Legend */}
            <g transform="translate(14, 14)">
              <rect
                x="0"
                y="0"
                width="130"
                height="70"
                rx="6"
                fill="white"
                stroke="#e5e7eb"
                strokeWidth="1"
                opacity={0.9}
              />
              <circle cx="16" cy="18" r="5" fill="#22c55e" stroke="#fff" strokeWidth="1" />
              <text x="28" y="22" className="text-[10px] fill-gray-600">
                Public
              </text>
              <circle cx="16" cy="36" r="5" fill="#f59e0b" stroke="#fff" strokeWidth="1" />
              <text x="28" y="40" className="text-[10px] fill-gray-600">
                Private
              </text>
              <circle cx="16" cy="54" r="5" fill="#8b5cf6" stroke="#fff" strokeWidth="1" />
              <text x="28" y="58" className="text-[10px] fill-gray-600">
                Multiple
              </text>
            </g>
          </svg>
        </div>

        {/* Detail Panel */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          {selected ? (
            <div>
              <div
                className="mb-3 h-1.5 w-12 rounded-full"
                style={{ backgroundColor: selected.primaryColor }}
              />
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {selected.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selected.city}, {selected.state}
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Type</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {selected.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Size
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {selected.size.replace("-", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Acceptance Rate
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatPercent(selected.acceptanceRate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    In-State Tuition
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(selected.tuitionInState)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Enrollment
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {selected.totalEnrollment.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    4-Yr Grad Rate
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatPercent(selected.graduationRate4yr)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Median Earnings (10yr)
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(selected.medianEarnings10yr)}
                  </span>
                </div>
              </div>
              <Link
                href={`/colleges/${selected.id}`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                View Full Profile →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-4xl">🗺️</div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Click a marker on the map to see college details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
