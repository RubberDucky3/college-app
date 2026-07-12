import type { College } from "@/types";

export function collegesToCSV(colleges: College[]): string {
  const headers = [
    "Name",
    "City",
    "State",
    "Type",
    "Locale",
    "Size",
    "Acceptance Rate (%)",
    "SAT Math (25th-75th)",
    "SAT Reading (25th-75th)",
    "ACT Composite (25th-75th)",
    "Application Fee",
    "Application Deadline",
    "Early Action Deadline",
    "Early Decision Deadline",
    "In-State Tuition",
    "Out-of-State Tuition",
    "Fees (In-State)",
    "Fees (Out-of-State)",
    "Room & Board",
    "Avg Net Price",
    "Books & Supplies",
    "Pct Receiving Grants",
    "Avg Grant Aid",
    "Pct Receiving Pell",
    "Avg Pell Grant",
    "Pct Federal Loans",
    "Avg Federal Loan",
    "Graduation Rate (4yr)",
    "Graduation Rate (6yr)",
    "Retention Rate",
    "Median Earnings (10yr)",
    "Median Earnings (6yr)",
    "Repayment Rate",
    "Total Enrollment",
    "Undergraduate Enrollment",
    "Programs",
    "Test Policy",
    "Common App",
    "Website",
  ];

  const rows = colleges.map((c) => [
    c.name,
    c.city,
    c.state,
    c.type,
    c.locale,
    c.size,
    c.acceptanceRate,
    `${c.satMath25th}-${c.satMath75th}`,
    `${c.satReading25th}-${c.satReading75th}`,
    `${c.actComposite25th}-${c.actComposite75th}`,
    c.applicationFee,
    c.applicationDeadline,
    c.earlyActionDeadline || "N/A",
    c.earlyDecisionDeadline || "N/A",
    c.tuitionInState,
    c.tuitionOutOfState,
    c.feesInState,
    c.feesOutOfState,
    c.roomBoardOnCampus,
    c.avgNetPrice,
    c.booksAndSupplies,
    c.pctReceivingGrants,
    c.avgGrantAid,
    c.pctReceivingPellGrants,
    c.avgPellGrant,
    c.pctReceivingFederalLoans,
    c.avgFederalLoan,
    c.graduationRate4yr,
    c.graduationRate6yr,
    c.retentionRate,
    c.medianEarnings10yr,
    c.medianEarnings6yr,
    c.repaymentRate,
    c.totalEnrollment,
    c.undergraduateEnrollment,
    c.programs.join("; "),
    c.standardizedTestPolicy.replace(/-/g, " "),
    c.commonApplicationAccepted ? "Yes" : "No",
    c.website,
  ]);

  const escape = (val: string | number | null): string => {
    if (val == null) return "";
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvRows = [
    headers.join(","),
    ...rows.map((row) => row.map(escape).join(",")),
  ];

  return csvRows.join("\n");
}

export function downloadCSV(
  csv: string,
  filename = "colleges.csv"
): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
