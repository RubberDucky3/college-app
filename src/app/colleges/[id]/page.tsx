import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCollegeById } from "@/lib/api";
import {
  formatCurrency,
  formatPercent,
  formatNumber,
  formatSAT,
  formatACT,
} from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const college = getCollegeById(id);
  if (!college) return { title: "College Not Found" };
  return {
    title: `${college.name} — CollegeHub`,
    description: `View stats, tuition, acceptance rate, and financial aid for ${college.name} in ${college.city}, Texas.`,
  };
}

export default async function CollegeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const college = getCollegeById(id);

  if (!college) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/colleges" className="hover:text-blue-600 transition-colors">
          ← Back to all colleges
        </Link>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {college.name}
            </h1>
            <p className="mt-1 text-lg text-gray-600">
              {college.city}, {college.state} {college.zip}
            </p>
          </div>
          <div className="flex gap-2">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                college.type === "public"
                  ? "bg-green-100 text-green-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {college.type === "public" ? "Public" : "Private"}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 capitalize">
              {college.locale}
            </span>
          </div>
        </div>

        {college.website && (
          <a
            href={college.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-blue-600 hover:underline"
          >
            {college.website.replace(/^https?:\/\//, "")} ↗
          </a>
        )}
      </div>

      {/* Key Stats Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatBox
          label="Acceptance Rate"
          value={formatPercent(college.acceptanceRate)}
          color={college.acceptanceRate < 20 ? "red" : college.acceptanceRate < 50 ? "yellow" : "green"}
        />
        <StatBox
          label="SAT Range"
          value={formatSAT({
            math25th: college.satMath25th,
            math75th: college.satMath75th,
            reading25th: college.satReading25th,
            reading75th: college.satReading75th,
          })}
        />
        <StatBox
          label="In-State Tuition"
          value={formatCurrency(college.tuitionInState)}
        />
        <StatBox
          label="Avg Net Price"
          value={formatCurrency(college.avgNetPrice)}
        />
        <StatBox
          label="Graduation Rate (6yr)"
          value={formatPercent(college.graduationRate6yr)}
        />
        <StatBox
          label="Enrollment"
          value={formatNumber(college.totalEnrollment)}
        />
        <StatBox
          label="Median Earnings (10yr)"
          value={formatCurrency(college.medianEarnings10yr)}
          color="green"
        />
        <StatBox
          label="Retention Rate"
          value={formatPercent(college.retentionRate)}
        />
      </div>

      {/* Two column detail */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Admissions */}
        <SectionCard title="Admissions">
          <DetailRow label="Acceptance Rate" value={formatPercent(college.acceptanceRate)} />
          <DetailRow label="Application Fee" value={formatCurrency(college.applicationFee)} />
          <DetailRow label="Deadline" value={college.applicationDeadline} />
          <DetailRow label="SAT Range" value={formatSAT({
            math25th: college.satMath25th,
            math75th: college.satMath75th,
            reading25th: college.satReading25th,
            reading75th: college.satReading75th,
          })} />
          <DetailRow label="ACT Range" value={formatACT(college.actComposite25th, college.actComposite75th)} />
          <DetailRow label="SAT Math 25th-75th" value={`${college.satMath25th}-${college.satMath75th}`} />
          <DetailRow label="SAT Reading 25th-75th" value={`${college.satReading25th}-${college.satReading75th}`} />
        </SectionCard>

        {/* Cost */}
        <SectionCard title="Cost & Expenses">
          <DetailRow label="In-State Tuition" value={formatCurrency(college.tuitionInState)} />
          <DetailRow label="Out-of-State Tuition" value={formatCurrency(college.tuitionOutOfState)} />
          <DetailRow label="Fees (In-State)" value={formatCurrency(college.feesInState)} />
          <DetailRow label="Fees (Out-of-State)" value={formatCurrency(college.feesOutOfState)} />
          <DetailRow label="Room & Board" value={formatCurrency(college.roomBoardOnCampus)} />
          <DetailRow label="Books & Supplies" value={formatCurrency(college.booksAndSupplies)} />
          <DetailRow label="Avg Net Price" value={formatCurrency(college.avgNetPrice)} />
        </SectionCard>

        {/* Financial Aid */}
        <SectionCard title="Financial Aid">
          <DetailRow label="Receiving Grants" value={formatPercent(college.pctReceivingGrants)} />
          <DetailRow label="Avg Grant Aid" value={formatCurrency(college.avgGrantAid)} />
          <DetailRow label="Receiving Pell Grants" value={formatPercent(college.pctReceivingPellGrants)} />
          <DetailRow label="Avg Pell Grant" value={formatCurrency(college.avgPellGrant)} />
          <DetailRow label="Receiving Federal Loans" value={formatPercent(college.pctReceivingFederalLoans)} />
          <DetailRow label="Avg Federal Loan" value={formatCurrency(college.avgFederalLoan)} />
        </SectionCard>

        {/* Outcomes */}
        <SectionCard title="Outcomes & Demographics">
          <DetailRow label="Graduation Rate (4yr)" value={formatPercent(college.graduationRate4yr)} />
          <DetailRow label="Graduation Rate (6yr)" value={formatPercent(college.graduationRate6yr)} />
          <DetailRow label="Retention Rate" value={formatPercent(college.retentionRate)} />
          <DetailRow label="Median Earnings (6yr)" value={formatCurrency(college.medianEarnings6yr)} />
          <DetailRow label="Median Earnings (10yr)" value={formatCurrency(college.medianEarnings10yr)} />
          <DetailRow label="Repayment Rate" value={formatPercent(college.repaymentRate)} />
          <DetailRow label="Total Enrollment" value={formatNumber(college.totalEnrollment)} />
          <DetailRow label="Undergrad Enrollment" value={formatNumber(college.undergraduateEnrollment)} />
          <DetailRow label="Male / Female" value={`${formatPercent(college.malePct, 0)} / ${formatPercent(college.femalePct, 0)}`} />
          <DetailRow label="International" value={formatPercent(college.internationalPct, 0)} />
        </SectionCard>
      </div>

      {/* CTA */}
      <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6 text-center">
        <h3 className="text-lg font-semibold text-blue-900">
          Interested in {college.name}?
        </h3>
        <p className="mt-1 text-sm text-blue-700">
          Visit their website or explore financial aid options.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <a
            href={college.website}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            Visit Website ↗
          </a>
          <Link
            href="/financial"
            className="rounded-lg border border-blue-300 bg-white px-5 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition"
          >
            View Financial Aid
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: "red" | "yellow" | "green";
}) {
  const colorClass = color
    ? {
        red: "text-red-600",
        yellow: "text-yellow-600",
        green: "text-green-600",
      }[color]
    : "text-gray-900";

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className={`mt-1 text-lg font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="mb-3 text-base font-semibold text-gray-900">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
