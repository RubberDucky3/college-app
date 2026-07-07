export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California",
  "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
  "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
] as const;

// State abbreviation → full name mapping (for filter dropdown)
export const STATE_ABBREVIATIONS: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

export const COLLEGE_TYPES = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "for-profit", label: "For-Profit" },
] as const;

export const COLLEGE_LOCALES = [
  { value: "urban", label: "Urban" },
  { value: "suburban", label: "Suburban" },
  { value: "rural", label: "Rural" },
] as const;

export const COLLEGE_SIZES = [
  { value: "small", label: "Small (< 2,000)" },
  { value: "medium", label: "Medium (2,000 - 7,500)" },
  { value: "large", label: "Large (7,500 - 15,000)" },
  { value: "very-large", label: "Very Large (> 15,000)" },
] as const;

export const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "acceptanceRate", label: "Acceptance Rate" },
  { value: "tuitionInState", label: "In-State Tuition" },
  { value: "graduationRate6yr", label: "Graduation Rate" },
  { value: "medianEarnings10yr", label: "Median Earnings (10yr)" },
] as const;

export const COLLEGE_PROGRAMS = [
  "Agriculture",
  "Architecture",
  "Arts",
  "Biology",
  "Business",
  "Communication",
  "Computer Science",
  "Criminal Justice",
  "Education",
  "Engineering",
  "Health & Nursing",
  "Law",
  "Liberal Arts",
  "Music",
  "Pharmacy",
  "Science & Research",
  "Social Work",
  "Theology",
] as const;

export const ITEMS_PER_PAGE = 20;
