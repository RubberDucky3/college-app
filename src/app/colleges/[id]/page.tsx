import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCollegeById, getCollegeDegrees, getCollegeSourceUrl, getCollegeHonors, getCollegeScholarships } from "@/lib/api";
import {
  formatCurrency,
  formatPercent,
  formatNumber,
  formatSAT,
  formatACT,
  formatTestPolicy,
  formatInterviewPolicy,
  formatCommonApp,
  formatYesNo,
  testPolicyColor,
  getCollegeLogoUrl,
  getCollegeInitialsLogo,
} from "@/lib/utils";
import { getSimilarColleges } from "@/lib/similar-colleges";
import AdSense from "@/components/AdSense";

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
    description: `${college.name} in ${college.city}, ${college.state}. View stats: ${college.acceptanceRate}% acceptance rate, $${formatCurrency(college.tuitionInState)} in-state tuition, ${college.graduationRate4yr}% graduation rate, and financial aid.`,
    alternates: { canonical: `/colleges/${college.id}` },
    openGraph: {
      title: `${college.name} — Tuition, Acceptance Rate & Stats`,
      description: `${college.name} in ${college.city}, ${college.state}. ${college.acceptanceRate}% acceptance rate, $${formatCurrency(college.tuitionInState)} in-state tuition.`,
      type: "profile",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${college.name} — CollegeHub`,
      description: `${college.name} in ${college.city}, ${college.state}. ${college.acceptanceRate}% acceptance rate.`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CollegeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const college = getCollegeById(id);

  if (!college) notFound();

  const similarColleges = getSimilarColleges(college.id, 5);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollegeOrUniversity",
            name: college.name,
            address: {
              "@type": "PostalAddress",
              addressLocality: college.city,
              addressRegion: college.state,
              postalCode: college.zip,
            },
            url: college.website,
            aggregateRating: college.acceptanceRate
              ? {
                  "@type": "AggregateRating",
                  ratingValue: Math.round((100 - college.acceptanceRate) * 10) / 10,
                  bestRating: 100,
                  worstRating: 0,
                  ratingCount: Math.round((college.totalEnrollment ?? 0) / 100) || 10,
                }
              : undefined,
          }),
        }}
      />
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/colleges" className="hover:text-blue-600 transition-colors">
          ← Back to all colleges
        </Link>
      </nav>

      {/* Header */}
      <div className="mb-8">
        {/* Brand color bar */}
        <div
          className="mb-4 h-2 w-16 rounded-full"
          style={{ backgroundColor: college.primaryColor }}
        />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
              <img
                src={getCollegeLogoUrl(college.website)}
                alt={`${college.name} logo`}
                className="h-10 w-10 object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-100">
                {college.name}
              </h1>
              <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">
                {college.city}, {college.state} {college.zip}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                college.type === "public"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                  : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
              }`}
            >
              {college.type === "public" ? "Public" : "Private"}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 capitalize dark:bg-gray-800 dark:text-gray-300">
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
          color={college.acceptanceRate != null && college.acceptanceRate < 20 ? "red" : college.acceptanceRate != null && college.acceptanceRate < 50 ? "yellow" : "green"}
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

      {/* ─── Admissions Requirements Banner ─────────────── */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-5 dark:border-gray-700 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Test Policy</span>
            <p className={`mt-0.5 text-base font-bold ${testPolicyColor(college.standardizedTestPolicy)}`}>
              {formatTestPolicy(college.standardizedTestPolicy)}
            </p>
          </div>
          <div className="hidden h-8 w-px bg-gray-300 dark:bg-gray-600 sm:block" />
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Interview</span>
            <p className="mt-0.5 text-base font-bold text-gray-900 dark:text-gray-100">
              {formatInterviewPolicy(college.admissionInterview)}
            </p>
          </div>
          <div className="hidden h-8 w-px bg-gray-300 dark:bg-gray-600 sm:block" />
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Common Application</span>
            <p className="mt-0.5 text-base font-bold text-gray-900 dark:text-gray-100">
              {formatCommonApp(college.commonApplicationAccepted)}
            </p>
          </div>
          <div className="hidden h-8 w-px bg-gray-300 dark:bg-gray-600 sm:block" />
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Application Fee</span>
            <p className="mt-0.5 text-base font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(college.applicationFee)}
            </p>
          </div>
        </div>
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
          <DetailRow label="SAT/ACT Scores Due" value={college.satActScoresMustBeReceivedBy} />
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

        {/* Applying */}
        <SectionCard title="Applying">
          <DetailRow label="Application Deadline" value={college.applicationDeadline} />
          <DetailRow label="Early Action Deadline" value={college.earlyActionDeadline} />
          <DetailRow label="Early Decision Deadline" value={college.earlyDecisionDeadline} />
          <DetailRow label="Priority Deadline" value={college.priorityApplicationDeadline} />
          <DetailRow label="Notification Date" value={college.notificationDate} />
          <DetailRow label="Common App Accepted" value={formatCommonApp(college.commonApplicationAccepted)} />
          <DetailRow label="Housing Deposit Due" value={college.housingDepositDeadline} />
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

        {/* Entering Class Stats */}
        <SectionCard title="Entering Class Stats">
          <DetailRow label="Acceptance Rate" value={formatPercent(college.acceptanceRate)} />
          <DetailRow label="Early Decision Accept. Rate" value={college.earlyDecisionAcceptanceRate != null && college.earlyDecisionAcceptanceRate > 0 ? formatPercent(college.earlyDecisionAcceptanceRate) : "N/A"} />
          <DetailRow label="SAT Range (Middle 50%)" value={formatSAT({
            math25th: college.satMath25th,
            math75th: college.satMath75th,
            reading25th: college.satReading25th,
            reading75th: college.satReading75th,
          })} />
          <DetailRow label="ACT Range (Middle 50%)" value={formatACT(college.actComposite25th, college.actComposite75th)} />
          <DetailRow label="Students Submitting SAT" value={(college.studentsSubmittingSatPct ?? 0) > 0 ? formatPercent(college.studentsSubmittingSatPct, 0) : "N/A"} />
          <DetailRow label="Students Submitting ACT" value={(college.studentsSubmittingActPct ?? 0) > 0 ? formatPercent(college.studentsSubmittingActPct, 0) : "N/A"} />
          <DetailRow label="Application Fee" value={formatCurrency(college.applicationFee)} />
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

      {/* Ad — between stats and net price */}
      <AdSense slot="3461974102" format="auto" />

      {/* ─── Net Price by Income ─────────────────────────── */}
      <section className="mt-8">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Net Price by Income
          </h2>
        </div>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Estimated out-of-pocket cost per year based on family income bracket.
          Actual costs vary — always file the FAFSA for a personalized package.
        </p>
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Income Bracket
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                  Est. Net Price
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                  vs. Sticker
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {[
                { label: "Under $30,000", multiplier: 0.65 },
                { label: "$30k – $48k", multiplier: 0.8 },
                { label: "$48k – $75k", multiplier: 0.95 },
                { label: "$75k – $110k", multiplier: 1.1 },
                { label: "$110k+", multiplier: 1.25 },
              ].map((bracket) => {
                const est = Math.round(
                  (college.avgNetPrice ?? 0) * bracket.multiplier
                );
                const sticker =
                  (college.tuitionInState ?? 0) +
                  (college.feesInState ?? 0) +
                  (college.roomBoardOnCampus ?? 0);
                const diff = est - sticker;
                return (
                  <tr
                    key={bracket.label}
                    className="bg-white transition hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                      {bracket.label}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(est)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`text-sm font-medium ${
                          diff <= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {diff <= 0
                          ? `−${formatCurrency(Math.abs(diff))}`
                          : `+${formatCurrency(diff)}`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Estimates based on national aid distribution patterns. Your actual net
          price depends on your specific financial situation and the
          college&apos;s aid policies.{" "}
          <Link
            href={`/net-price?id=${college.id}`}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Use the full calculator →
          </Link>
        </p>
      </section>

      {/* ─── Academics & Programs ───────────────────────── */}
      <section className="mt-8">
        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Academics &amp; Programs
          </h2>
          <span className="rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            {getCollegeDegrees(college.id).length} programs
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {getCollegeDegrees(college.id).map((degree) => (
            <div
              key={degree.program}
              className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {degree.program}
                </h3>
                <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">
                  {degree.degreeType}
                </span>
              </div>
              <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                {degree.department}
              </p>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {degree.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {degree.sampleCourses.length} sample courses · {degree.totalCredits} credits
                </span>
                <Link
                  href={`/colleges/${college.id}/degrees/${encodeURIComponent(degree.program.toLowerCase().replace(/\s+/g, "-"))}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View curriculum →
                </Link>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
          Program and course data compiled from publicly available sources. Always verify requirements with the{" "}
          <a
            href={getCollegeSourceUrl(college)}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600 dark:hover:text-gray-300"
          >
            official {college.name} catalog ↗
          </a>
          .
        </p>
      </section>

      {/* ─── Honors Programs ──────────────────────────── */}
      {getCollegeHonors(college.id).length > 0 && (
        <section className="mt-8">
          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Honors Programs
            </h2>
            <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              {getCollegeHonors(college.id).length} programs
            </span>
          </div>
          <div className="space-y-4">
            {getCollegeHonors(college.id).map((honors) => (
              <div
                key={honors.id}
                className="rounded-xl border border-amber-200 bg-white p-5 dark:border-amber-800 dark:bg-gray-800"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {honors.name}
                  </h3>
                  <a
                    href={honors.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-lg border border-amber-300 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50 transition dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/30"
                  >
                    Official site ↗
                  </a>
                </div>
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {honors.description}
                </p>
                {honors.features.length > 0 && (
                  <div className="mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Key Features
                    </span>
                    <ul className="mt-1.5 grid gap-1 sm:grid-cols-2">
                      {honors.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                          <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {honors.eligibility.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Eligibility
                    </span>
                    <ul className="mt-1 space-y-0.5">
                      {honors.eligibility.map((e, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <span className="mt-0.5 block h-1 w-1 rounded-full bg-gray-400 shrink-0" />
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
            Honors program details sourced from official college websites.
          </p>
        </section>
      )}

      {/* ─── Scholarships ───────────────────────────────── */}
      {getCollegeScholarships(college.id).length > 0 && (
        <section className="mt-8">
          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Scholarships
            </h2>
            <span className="rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
              {getCollegeScholarships(college.id).length} opportunities
            </span>
          </div>
          <div className="space-y-4">
            {getCollegeScholarships(college.id).map((scholarship) => (
              <div
                key={scholarship.id}
                className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {scholarship.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {scholarship.provider} · {scholarship.type === "merit" ? "Merit-Based" : "Need-Based"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {scholarship.renewable && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                        Renewable
                      </span>
                    )}
                    <a
                      href={scholarship.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Details ↗
                    </a>
                  </div>
                </div>
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {scholarship.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  {scholarship.amount > 0 && (
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        Amount
                      </span>
                      <p className="text-sm font-bold text-green-600 dark:text-green-400">
                        {scholarship.amount >= 1000
                          ? `$${(scholarship.amount / 1000).toFixed(0)}K/year`
                          : `$${scholarship.amount}/year`}
                      </p>
                    </div>
                  )}
                  {scholarship.amount === 0 && (
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        Value
                      </span>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        Varies
                      </p>
                    </div>
                  )}
                  {scholarship.deadline && (
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        Deadline
                      </span>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {scholarship.deadline}
                      </p>
                    </div>
                  )}
                </div>
                {scholarship.eligibility.length > 0 && (
                  <div className="mt-3 border-t border-gray-100 pt-3 dark:border-gray-700">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Eligibility
                    </span>
                    <ul className="mt-1 space-y-0.5">
                      {scholarship.eligibility.map((e, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <span className="mt-1.5 block h-1 w-1 rounded-full bg-gray-400 shrink-0" />
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
            Scholarship details sourced from official college and provider websites. Always verify deadlines and requirements with the official source.
          </p>
        </section>
      )}

      {/* ─── Admissions Calculator ──────────────────────── */}
      <div className="mt-8 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 dark:border-indigo-900/50 dark:from-indigo-950/30 dark:to-gray-900">
        <div className="mb-6 text-center">
          <div className="mb-2 text-3xl">📊</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Will You Get Into {college.name}?
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            See how your scores compare to admitted students at {college.name}
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
              Admitted Student Profile
            </h4>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-500">Avg SAT</p>
                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                  {formatSAT({ math25th: college.satMath25th, math75th: college.satMath75th, reading25th: college.satReading25th, reading75th: college.satReading75th })}
                </p>
                <p className="text-xs text-gray-400">Middle 50%</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-gray-500">Avg ACT</p>
                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                  {formatACT(college.actComposite25th, college.actComposite75th)}
                </p>
                <p className="text-xs text-gray-400">Middle 50%</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-gray-500">Acceptance</p>
                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                  {formatPercent(college.acceptanceRate)}
                </p>
                <p className="text-xs text-gray-400">Rate</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-gray-500">Application Fee</p>
                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(college.applicationFee)}
                </p>
                <p className="text-xs text-gray-400">Cost to apply</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center dark:border-amber-900/50 dark:bg-amber-950/30">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              🔒 Enter your GPA and test scores for a personalized admission
              probability estimate —{" "}
              <span className="font-bold">available with College Compass</span>
            </p>
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
              Premium feature. Compare your stats against {college.name}&apos;s
              admitted class profile.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Similar Colleges ──────────────────────────── */}
      {similarColleges.length > 0 && (
        <section className="mt-8">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Similar Colleges
            </h2>
            <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              You might also like
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similarColleges.map((s) => (
              <Link
                key={s.id}
                href={`/colleges/${s.id}`}
                className="group rounded-xl border border-gray-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-600"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-400">
                    {s.name}
                  </h3>
                  <span className="shrink-0 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                    {s.matchPercent}%
                  </span>
                </div>
                <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                  {s.city}, {s.state} · {s.type === "public" ? "Public" : "Private"} ·{" "}
                  {s.size.replace("-", " ")}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <span>
                    Acceptance:{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {s.acceptanceRate != null ? `${s.acceptanceRate.toFixed(0)}%` : "N/A"}
                    </span>
                  </span>
                  <span>
                    Tuition:{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(s.tuitionInState)}
                    </span>
                  </span>
                  <span>
                    Grad rate:{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {s.graduationRate6yr != null ? `${s.graduationRate6yr.toFixed(0)}%` : "N/A"}
                    </span>
                  </span>
                  <span>
                    Earnings:{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(s.medianEarnings10yr)}
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6 text-center dark:border-blue-900/50 dark:bg-blue-950/30">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
          Interested in {college.name}?
        </h3>
        <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
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
            className="rounded-lg border border-blue-300 bg-white px-5 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition dark:border-blue-700 dark:bg-gray-800 dark:text-blue-300 dark:hover:bg-gray-700"
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
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
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
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 last:border-0">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );
}
