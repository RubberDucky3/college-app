import { nationalUniversities } from "@/lib/national-data";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { College } from "@/types";

export interface ChatMessage {
  role: "user" | "bot";
  text: string;
}

// ─── Intent parsing ─────────────────────────────────────────────

type Intent =
  | "list-program"
  | "list-city"
  | "list-type"
  | "college-info"
  | "tuition"
  | "acceptance-rate"
  | "graduation-rate"
  | "earnings"
  | "deadline"
  | "compare"
  | "help"
  | "unknown";

interface ParsedQuery {
  intent: Intent;
  collegeName?: string;
  program?: string;
  city?: string;
  type?: "public" | "private";
}

function findCollegesByName(query: string): College[] {
  const words = query.toLowerCase().split(/\s+/);
  return nationalUniversities.filter((c) => {
    const name = c.name.toLowerCase();
    return words.some((w) => w.length > 2 && name.includes(w));
  });
}

function findCollegesByProgram(program: string): College[] {
  const p = program.toLowerCase();
  return nationalUniversities.filter((c) =>
    c.programs.some((pg) => pg.toLowerCase().includes(p))
  );
}

function findCollegesByCity(city: string): College[] {
  const c = city.toLowerCase();
  return nationalUniversities.filter(
    (col) => col.city.toLowerCase().includes(c)
  );
}

function parseQuery(input: string): ParsedQuery {
  const q = input.toLowerCase().trim();

  // Help
  if (/^(help|what can you|what can i ask|commands)/i.test(q)) {
    return { intent: "help" };
  }

  // "what colleges have X" / "colleges with X program" / "which colleges offer X"
  const programMatch = q.match(
    /(?:what|which|show|list|find)\s+(?:colleges?|schools?|universities?)(?:\s+that)?\s+(?:have|with|offer|teach|for)\s+([a-z\s&]+)/i
  );
  if (programMatch) {
    return { intent: "list-program", program: programMatch[1].trim() };
  }

  // "colleges in X city" / "universities in X"
  const cityMatch = q.match(
    /(?:colleges?|schools?|universities?)\s+(?:in|near|at)\s+([a-z\s]+)/i
  );
  if (cityMatch) {
    return { intent: "list-city", city: cityMatch[1].trim() };
  }

  // "public universities" / "private colleges"
  const typeMatch = q.match(/^(?:list|show|find)?\s*(public|private)\s+(?:colleges?|schools?|universities?)/i);
  if (typeMatch) {
    return {
      intent: "list-type",
      type: typeMatch[1].toLowerCase() as "public" | "private",
    };
  }

  // "compare X and Y"
  if (/^compare\s+/i.test(q)) {
    return { intent: "compare", collegeName: q.replace(/^compare\s+/i, "") };
  }

  // "tell me about X" / "info on X" / "about X"
  const aboutMatch = q.match(
    /(?:tell me about|info(?:rmation)?\s+(?:about|on|for)|about|what is|describe)\s+([a-z\s&.]+)/i
  );
  if (aboutMatch) {
    return { intent: "college-info", collegeName: aboutMatch[1].trim() };
  }

  // "how much is tuition at X" / "tuition for X" / "cost of X"
  const tuitionMatch = q.match(
    /(?:how much\s+is\s+|what(?:'s|\s+is)\s+)?(?:tuition|cost|price|fee)(?:\s+for|\s+at|\s+of)?\s+([a-z\s&.]+)/i
  );
  if (tuitionMatch) {
    return { intent: "tuition", collegeName: tuitionMatch[1].trim() };
  }

  // "what's the acceptance rate for X" / "acceptance rate at X"
  const acceptMatch = q.match(
    /(?:what(?:'s|\s+is)\s+the\s+)?acceptance\s+rate(?:\s+for|\s+at|\s+of)?\s+([a-z\s&.]+)/i
  );
  if (acceptMatch) {
    return {
      intent: "acceptance-rate",
      collegeName: acceptMatch[1].trim(),
    };
  }

  // "graduation rate at X" / "grad rate for X"
  const gradMatch = q.match(
    /(?:what(?:'s|\s+is)\s+the\s+)?(?:graduation|grad)\s+rate(?:\s+for|\s+at|\s+of)?\s+([a-z\s&.]+)/i
  );
  if (gradMatch) {
    return {
      intent: "graduation-rate",
      collegeName: gradMatch[1].trim(),
    };
  }

  // "earnings at X" / "salary for X" / "how much do X graduates make"
  const earnMatch = q.match(
    /(?:earnings?|salary|income|make|median)(?:\s+for|\s+at|\s+of)?\s+([a-z\s&.]+)/i
  );
  if (earnMatch) {
    return { intent: "earnings", collegeName: earnMatch[1].trim() };
  }

  // "deadline for X" / "when is the deadline for X"
  const deadlineMatch = q.match(
    /(?:deadline|when\s+(?:is|does)|application\s+due)(?:\s+for|\s+at|\s+of)?\s+([a-z\s&.]+)/i
  );
  if (deadlineMatch) {
    return { intent: "deadline", collegeName: deadlineMatch[1].trim() };
  }

  // Direct college name query (single word that matches a college)
  const directCollege = findCollegesByName(q);
  if (directCollege.length === 1 && q.split(/\s+/).length <= 4) {
    return { intent: "college-info", collegeName: directCollege[0].name };
  }

  return { intent: "unknown" };
}

// ─── Response generators ────────────────────────────────────────

function formatCollegeBrief(c: College): string {
  return [
    `**${c.name}** — ${c.city}, ${c.state} (${c.type === "public" ? "Public" : "Private"})`,
    `• Acceptance rate: **${formatPercent(c.acceptanceRate)}**`,
    `• In-state tuition: **${formatCurrency(c.tuitionInState)}**`,
    `• Avg net price: **${formatCurrency(c.avgNetPrice)}**`,
    `• Graduation rate (4yr): **${formatPercent(c.graduationRate4yr)}**`,
    `• Median earnings (10yr): **${formatCurrency(c.medianEarnings10yr)}**`,
    `• Enrollment: **${c.totalEnrollment != null ? c.totalEnrollment.toLocaleString() : "N/A"}**`,
    `• Programs: ${c.programs.slice(0, 5).join(", ")}${c.programs.length > 5 ? ` +${c.programs.length - 5} more` : ""}`,
  ].join("\n");
}

function responseForProgram(program: string): string {
  const matches = findCollegesByProgram(program);
  if (matches.length === 0) {
    return `I couldn't find any colleges offering "${program}". Try a different program name like Engineering, Business, or Computer Science.`;
  }
  const lines = matches.slice(0, 10).map((c, i) => `${i + 1}. **${c.name}** — ${c.city}`);
  if (matches.length > 10) lines.push(`...and ${matches.length - 10} more.`);
  return `Here are the colleges with **${program}** programs:\n\n${lines.join("\n")}`;
}

function responseForCity(city: string): string {
  const matches = findCollegesByCity(city);
  if (matches.length === 0) {
    return `I couldn't find any colleges in "${city}". Try a different city like Austin, Houston, or Dallas.`;
  }
  const lines = matches.map(
    (c, i) =>
      `${i + 1}. **${c.name}** — ${c.type === "public" ? "Public" : "Private"}, ${formatCurrency(c.tuitionInState)}/yr`
  );
  return `Here are the colleges in **${matches[0].city}**:\n\n${lines.join("\n")}`;
}

function responseForType(type: "public" | "private"): string {
  const matches = nationalUniversities.filter((c) => c.type === type);
  const label = type === "public" ? "Public" : "Private";
  const lines = matches.slice(0, 15).map(
    (c, i) => `${i + 1}. **${c.name}** — ${c.city}, ${formatCurrency(c.tuitionInState)}/yr`
  );
  if (matches.length > 15) lines.push(`...and ${matches.length - 15} more.`);
  return `Here are the **${label}** universities (${matches.length} total):\n\n${lines.join("\n")}`;
}

function responseForCollegeInfo(name: string): string {
  const matches = findCollegesByName(name);
  if (matches.length === 0) {
    return `I couldn't find a college matching "${name}". Try searching for a specific name like "UT Austin" or "Texas A&M".`;
  }
  if (matches.length > 1) {
    const lines = matches.map(
      (c, i) => `${i + 1}. **${c.name}** — ${c.city}`
    );
    return `I found multiple colleges matching "${name}". Which one would you like to know about?\n\n${lines.join("\n")}`;
  }
  return formatCollegeBrief(matches[0]);
}

function responseForTuition(name: string): string {
  const matches = findCollegesByName(name);
  if (matches.length === 0) {
    return `I couldn't find a college matching "${name}". Try a specific name like "Baylor" or "UT Austin".`;
  }
  const c = matches[0];
  if (matches.length > 1) {
    return `Which one did you mean? ${matches.map((m) => `**${m.name}**`).join(", ")}?`;
  }
  return [
    `**${c.name}** — Cost Breakdown`,
    `• In-state tuition: **${formatCurrency(c.tuitionInState)}**`,
    `• Out-of-state tuition: **${formatCurrency(c.tuitionOutOfState)}**`,
    `• Fees (in-state): **${formatCurrency(c.feesInState)}**`,
    `• Room & board: **${formatCurrency(c.roomBoardOnCampus)}**`,
    `• Books & supplies: **${formatCurrency(c.booksAndSupplies)}**`,
    `• Avg net price (after aid): **${formatCurrency(c.avgNetPrice)}**`,
  ].join("\n");
}

function responseForAcceptanceRate(name: string): string {
  const matches = findCollegesByName(name);
  if (matches.length === 0) {
    return `I couldn't find a college matching "${name}". Try "Rice" or "UT Austin".`;
  }
  if (matches.length > 1) {
    return `Which one? ${matches.map((m) => `**${m.name}**`).join(", ")}?`;
  }
  const c = matches[0];
  const color =
    c.acceptanceRate == null
      ? "not reported"
      : c.acceptanceRate < 20
        ? "very selective"
        : c.acceptanceRate < 40
          ? "selective"
          : c.acceptanceRate < 65
            ? "moderately selective"
            : "open admission";
  const satRange =
    c.satMath25th != null && c.satReading25th != null && c.satMath75th != null && c.satReading75th != null
      ? `**${c.satMath25th + c.satReading25th}-${c.satMath75th + c.satReading75th}**`
      : "N/A";
  const actRange =
    c.actComposite25th != null && c.actComposite75th != null
      ? `**${c.actComposite25th}-${c.actComposite75th}**`
      : "N/A";
  return [
    `**${c.name}** — Admission Stats`,
    `• Acceptance rate: **${formatPercent(c.acceptanceRate)}** (${color})`,
    `• SAT range (middle 50%): ${satRange}`,
    `• ACT range (middle 50%): ${actRange}`,
    `• Test policy: **${c.standardizedTestPolicy.replace(/-/g, " ")}**`,
    c.earlyDecisionAcceptanceRate != null && c.earlyDecisionAcceptanceRate > 0
      ? `• Early decision acceptance rate: **${formatPercent(c.earlyDecisionAcceptanceRate)}**`
      : "",
    `• Application fee: **${formatCurrency(c.applicationFee)}**`,
  ]
    .filter(Boolean)
    .join("\n");
}

function responseForGradRate(name: string): string {
  const matches = findCollegesByName(name);
  if (matches.length === 0) return `I couldn't find a college matching "${name}".`;
  if (matches.length > 1)
    return `Which one? ${matches.map((m) => `**${m.name}**`).join(", ")}?`;
  const c = matches[0];
  return [
    `**${c.name}** — Graduation & Outcomes`,
    `• 4-year graduation rate: **${formatPercent(c.graduationRate4yr)}**`,
    `• 6-year graduation rate: **${formatPercent(c.graduationRate6yr)}**`,
    `• Retention rate: **${formatPercent(c.retentionRate)}**`,
    `• Median earnings (6yr after entry): **${formatCurrency(c.medianEarnings6yr)}**`,
    `• Median earnings (10yr after entry): **${formatCurrency(c.medianEarnings10yr)}**`,
    `• Loan repayment rate: **${formatPercent(c.repaymentRate)}**`,
  ].join("\n");
}

function responseForEarnings(name: string): string {
  const matches = findCollegesByName(name);
  if (matches.length === 0)
    return `I couldn't find a college matching "${name}".`;
  if (matches.length > 1)
    return `Which one? ${matches.map((m) => `**${m.name}**`).join(", ")}?`;
  const c = matches[0];
  const totalCost =
    (c.tuitionInState ?? 0) + (c.feesInState ?? 0) + (c.roomBoardOnCampus ?? 0);
  const roi =
    c.medianEarnings10yr != null && totalCost > 0
      ? c.medianEarnings10yr / (totalCost * 4)
      : null;
  return [
    `**${c.name}** — Earnings & ROI`,
    `• Median earnings (10yr after entry): **${formatCurrency(c.medianEarnings10yr)}**`,
    `• Median earnings (6yr after entry): **${formatCurrency(c.medianEarnings6yr)}**`,
    `• Annual ROI multiple: **${roi != null ? roi.toFixed(1) + "×" : "N/A"}**`,
    `• Loan repayment rate: **${formatPercent(c.repaymentRate)}**`,
  ].join("\n");
}

function responseForDeadline(name: string): string {
  const matches = findCollegesByName(name);
  if (matches.length === 0)
    return `I couldn't find a college matching "${name}".`;
  if (matches.length > 1)
    return `Which one? ${matches.map((m) => `**${m.name}**`).join(", ")}?`;
  const c = matches[0];
  return [
    `**${c.name}** — Deadlines`,
    `• Application deadline: **${c.applicationDeadline}**`,
    c.earlyActionDeadline ? `• Early action deadline: **${c.earlyActionDeadline}**` : "• Early action: Not offered",
    c.earlyDecisionDeadline
      ? `• Early decision deadline: **${c.earlyDecisionDeadline}**`
      : "• Early decision: Not offered",
    c.priorityApplicationDeadline
      ? `• Priority deadline: **${c.priorityApplicationDeadline}**`
      : "",
    `• Notification date: **${c.notificationDate || "Rolling"}**`,
    c.housingDepositDeadline
      ? `• Housing deposit due: **${c.housingDepositDeadline}**`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function responseForCompare(query: string): string {
  // Extract two college names separated by "and" / "vs" / ","
  const parts = query.split(/\s+(?:and|vs?|,)\s+/i);
  if (parts.length < 2) {
    return "To compare colleges, say something like: 'Compare UT Austin and Texas A&M'";
  }
  const a = findCollegesByName(parts[0]);
  const b = findCollegesByName(parts[1]);
  if (a.length === 0 || b.length === 0) {
    return "I couldn't find one of those colleges. Try full names like 'University of Texas at Austin'.";
  }
  const c1 = a[0];
  const c2 = b[0];
  return [
    `**Comparison: ${c1.name} vs ${c2.name}**`,
    "",
    "| Metric | " + c1.name + " | " + c2.name + " |",
    "|---|---|---|",
    `| Type | ${c1.type} | ${c2.type} |`,
    `| Acceptance Rate | ${formatPercent(c1.acceptanceRate)} | ${formatPercent(c2.acceptanceRate)} |`,
    `| In-State Tuition | ${formatCurrency(c1.tuitionInState)} | ${formatCurrency(c2.tuitionInState)} |`,
    `| Avg Net Price | ${formatCurrency(c1.avgNetPrice)} | ${formatCurrency(c2.avgNetPrice)} |`,
    `| Graduation (4yr) | ${formatPercent(c1.graduationRate4yr)} | ${formatPercent(c2.graduationRate4yr)} |`,
    `| Median Earnings (10yr) | ${formatCurrency(c1.medianEarnings10yr)} | ${formatCurrency(c2.medianEarnings10yr)} |`,
    `| Enrollment | ${c1.totalEnrollment != null ? c1.totalEnrollment.toLocaleString() : "N/A"} | ${c2.totalEnrollment != null ? c2.totalEnrollment.toLocaleString() : "N/A"} |`,
    `| Retention Rate | ${formatPercent(c1.retentionRate)} | ${formatPercent(c2.retentionRate)} |`,
  ].join("\n");
}

function unknownResponse(): string {
  const suggestions = [
    '"What colleges have Engineering?"',
    '"Tell me about UT Austin"',
    '"How much is tuition at Rice?"',
    '"What\'s the acceptance rate at Texas A&M?"',
    '"Colleges in Houston"',
    '"Public universities"',
    '"Compare Baylor and TCU"',
    '"Deadline for UT Austin"',
  ];
  return [
    "I can answer questions about colleges! Try asking:",
    "",
    ...suggestions.map((s) => `• ${s}`),
    "",
    "Or type **help** to see all options.",
  ].join("\n");
}

function helpResponse(): string {
  return [
    "**🤖 CollegeHub Chatbot Help**",
    "",
    "I can answer questions about all 2,667 colleges in our database.",
    "",
    "**What you can ask:**",
    "• **Program search:** *\"What colleges have Engineering?\"*",
    "• **College info:** *\"Tell me about UT Austin\"*, *\"About Rice\"*",
    "• **Tuition & costs:** *\"How much is tuition at Baylor?\"*",
    "• **Admissions:** *\"What's the acceptance rate at Texas A&M?\"*",
    "• **Graduation:** *\"Graduation rate at SMU\"*",
    "• **Earnings:** *\"Earnings for TCU graduates\"*",
    "• **Deadlines:** *\"Deadline for UT Austin\"*",
    "• **Location:** *\"Colleges in Dallas\"*, *\"Universities in Houston\"*",
    "• **Type:** *\"Public universities\"*, *\"Private colleges\"*",
    "• **Compare:** *\"Compare UT Austin and Texas A&M\"*",
    "",
    "Give it a try!",
  ].join("\n");
}

// ─── Main handler ────────────────────────────────────────────────

export function getBotResponse(input: string): string {
  const parsed = parseQuery(input);

  switch (parsed.intent) {
    case "help":
      return helpResponse();
    case "list-program":
      return responseForProgram(parsed.program ?? "");
    case "list-city":
      return responseForCity(parsed.city ?? "");
    case "list-type":
      return responseForType(parsed.type ?? "public");
    case "college-info":
      return responseForCollegeInfo(parsed.collegeName ?? "");
    case "tuition":
      return responseForTuition(parsed.collegeName ?? "");
    case "acceptance-rate":
      return responseForAcceptanceRate(parsed.collegeName ?? "");
    case "graduation-rate":
      return responseForGradRate(parsed.collegeName ?? "");
    case "earnings":
      return responseForEarnings(parsed.collegeName ?? "");
    case "deadline":
      return responseForDeadline(parsed.collegeName ?? "");
    case "compare":
      return responseForCompare(parsed.collegeName ?? "");
    default:
      return unknownResponse();
  }
}
