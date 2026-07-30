import Link from "next/link";
import type { Metadata } from "next";
import {
  grants,
  loans,
  scholarships,
} from "@/lib/financial-data";
import { formatCurrency } from "@/lib/utils";
import ScholarshipList from "@/components/ScholarshipList";

export const metadata: Metadata = {
  title: "Financial Aid, Grants & Scholarships — CollegeHub",
  description:
    "Explore grants, loans, and scholarships for college students. Compare financial aid options, average grant aid, Pell grants, and federal loans to fund your education.",
  alternates: { canonical: "/financial" },
  openGraph: {
    title: "Financial Aid, Grants & Scholarships — CollegeHub",
    description:
      "Explore grants, loans, and scholarships for college students. Compare financial aid options and find money for college.",
  },
};

export default function FinancialAidPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-100">
          Financial Aid Hub
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Everything you need to know about funding your college education —
          grants, loans, and scholarships.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <OverviewCard
          icon="🎁"
          title={`${grants.length} Grant Programs`}
          description="Free money you don't pay back"
          href="#grants"
          color="green"
        />
        <OverviewCard
          icon="🏦"
          title={`${loans.length} Loan Options`}
          description="Borrow for your education"
          href="#loans"
          color="blue"
        />
        <OverviewCard
          icon="🏆"
          title={`${scholarships.length} Scholarships`}
          description="Merit & need-based awards"
          href="#scholarships"
          color="purple"
        />
      </div>

      {/* ─── Grants ─────────────────────────────────── */}
      <section id="grants" className="mb-12">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Grants</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Grants are gift aid — you don&apos;t need to repay them.
            Typically need-based.
          </p>
        </div>
        <div className="space-y-4">
          {grants.map((grant) => (
            <AidCard key={grant.id} type="grant" title={grant.name}>
              <p className="text-sm text-gray-600 dark:text-gray-400">{grant.description}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Max Amount</span>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(grant.maxAmount)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Source</span>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                    {grant.source}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Deadline</span>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {grant.deadline}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Renewable</span>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {grant.renewable ? "Yes" : "No"}
                  </p>
                </div>
              </div>
              {grant.eligibility.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    ELIGIBILITY
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {grant.eligibility.join(" · ")}
                  </p>
                </div>
              )}
            </AidCard>
          ))}
        </div>
      </section>

      {/* ─── Loans ──────────────────────────────────── */}
      <section id="loans" className="mb-12">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Loans</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Loans must be repaid with interest. Federal loans typically
            have lower rates and better terms than private loans.
          </p>
        </div>
        <div className="space-y-4">
          {loans.map((loan) => (
            <AidCard key={loan.id} type="loan" title={loan.name}>
              <p className="text-sm text-gray-600 dark:text-gray-400">{loan.description}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Interest Rate</span>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {loan.interestRate}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Max Amount</span>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(loan.maxAmount)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Origination Fee</span>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {loan.originationFee}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Subsidized</span>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {loan.subsidized ? "Yes (no interest while in school)" : "No"}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  REPAYMENT
                </span>
                <p className="text-sm text-gray-700 dark:text-gray-300">{loan.repaymentInfo}</p>
              </div>
            </AidCard>
          ))}
        </div>
      </section>

      {/* ─── Scholarships ───────────────────────────── */}
      <section id="scholarships" className="mb-12">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Scholarships
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Scholarships are merit-based or need-based awards that
            don&apos;t require repayment.
          </p>
        </div>
        <ScholarshipList />
      </section>

      {/* Footer note */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
        <p className="font-medium text-gray-900 dark:text-gray-100">
          💡 Pro Tip
        </p>
        <p className="mt-1">
          Always fill out the FAFSA first — it&apos;s the gateway to
          federal grants, loans, and many state programs. Apply at{" "}
          <a
            href="https://studentaid.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            studentaid.gov
          </a>
          .
        </p>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────

function OverviewCard({
  icon,
  title,
  description,
  href,
  color,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  color: "green" | "blue" | "purple";
}) {
  const colorMap = {
    green: "border-green-200 bg-green-50 hover:bg-green-100 dark:border-green-800 dark:bg-green-950/40 dark:hover:bg-green-950/60",
    blue: "border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:hover:bg-blue-950/60",
    purple: "border-purple-200 bg-purple-50 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950/40 dark:hover:bg-purple-950/60",
  };

  return (
    <a
      href={href}
      className={`block rounded-xl border p-5 transition ${colorMap[color]}`}
    >
      <div className="text-2xl">{icon}</div>
      <h3 className="mt-2 font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </a>
  );
}

function AidCard({
  type,
  title,
  children,
}: {
  type: "grant" | "loan" | "scholarship";
  title: string;
  children: React.ReactNode;
}) {
  const colorMap = {
    grant: "border-green-200 dark:border-green-900/50",
    loan: "border-blue-200 dark:border-blue-900/50",
    scholarship: "border-purple-200 dark:border-purple-900/50",
  };

  const badgeMap = {
    grant: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
    loan: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    scholarship: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  };

  return (
    <div className={`rounded-xl border p-5 ${colorMap[type]}`}>
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${badgeMap[type]}`}
        >
          {type}
        </span>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      </div>
      {children}
    </div>
  );
}
