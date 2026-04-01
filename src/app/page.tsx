"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { InputForm } from "@/components/InputForm";
import { ResultCard } from "@/components/ResultCard";
import { allocateIncome, type IncomeAllocation } from "@/engine/allocationEngine";
import {
  projectFinancialPlan,
  type ProjectionPoint,
} from "@/engine/projectionEngine";
import {
  calculateRetirementPlan,
  getContributionGuidance,
  type ContributionGuidance,
  type RetirementPlanSummary,
} from "@/engine/retirementEngine";
import { calculateTaxes } from "@/engine/taxEngine";
import type { PlannerFormValues, RiskProfile } from "@/types/finance";

const ProjectionChart = dynamic(
  () =>
    import("@/components/ProjectionChart").then(
      (module) => module.ProjectionChart,
    ),
  {
    ssr: false,
    loading: () => <div className="h-[320px] w-full" />,
  },
);

type DashboardSummary = {
  estimatedTaxes: string;
  takeHomePay: string;
  availableToInvest: string;
  annualTaxes: number;
  effectiveTaxRate: number;
  allocation: IncomeAllocation;
  retirementPlan: RetirementPlanSummary;
  contributionGuidance: ContributionGuidance;
  projections: ProjectionPoint[];
  projectedYear1Total: number;
  projectedYear2Total: number;
  projectedYear3Total: number;
};

const defaultPlannerFormValues: PlannerFormValues = {
  salary: "120000",
  state: "CA",
  filingStatus: "single",
  monthlyExpenses: "3500",
  employee401kContributionPercent: "8",
  employerMatchPercent: "50",
  employerMatchCapPercent: "6",
  riskProfile: "aggressive",
};

export default function Home() {
  const [formValues, setFormValues] = useState<PlannerFormValues>(
    defaultPlannerFormValues,
  );
  const [results, setResults] = useState<DashboardSummary>(() =>
    getDashboardSummary(defaultPlannerFormValues),
  );

  const handleCalculate = () => {
    setResults(getDashboardSummary(formValues));
  };

  const allocationItems = [
    {
      title: "Emergency Fund",
      monthly: results.allocation.emergency,
      annual: results.allocation.emergency * 12,
      description: "Build 3-6 months of expenses for safety.",
    },
    {
      title: "401(k) Contribution",
      monthly: results.allocation.retirement401k,
      annual: results.retirementPlan.employee401kAnnualContribution,
      description: "Employee retirement contribution selected in the form.",
    },
    {
      title: "Employer Match",
      monthly: results.retirementPlan.employerMatchMonthly,
      annual: results.retirementPlan.employerMatchAnnual,
      description: "Estimated employer dollars added to retirement savings.",
    },
    {
      title: "Roth IRA",
      monthly: results.allocation.rothIRA,
      annual: results.allocation.rothIRA * 12,
      description: "Tax-free growth account for long-term investing.",
    },
    {
      title: "Taxable Investing",
      monthly: results.allocation.taxable,
      annual: results.allocation.taxable * 12,
      description: "Flexible investing account for additional growth.",
    },
  ];

  const hasRecommendedAllocation = allocationItems.some(
    (item) => item.monthly > 0 || item.annual > 0,
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(28,100,242,0.08),_transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="flex flex-col gap-4 rounded-[32px] border border-white/70 bg-white/85 px-6 py-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium tracking-[0.18em] text-slate-500 uppercase">
                ratna-invest
              </span>
              <div className="space-y-2">
                <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Turn income into a paycheck plan and investing roadmap.
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Model taxes, retirement choices, and a starter 3-year outlook
                  in one planning workspace built around the shared engines in{" "}
                  <code className="font-mono">/src/engine</code>.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
                  Scope
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  W-2 starter MVP
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
                  Status
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  Tax, retirement, and projection engines connected
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <InputForm
              values={formValues}
              onChange={setFormValues}
              onSubmit={handleCalculate}
              contributionGuidance={results.contributionGuidance}
              retirementPlan={results.retirementPlan}
            />
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <ResultCard
                title="Estimated Taxes"
                value={results.estimatedTaxes}
                description="Estimated monthly taxes using simplified federal, FICA, and MVP state tax rules."
              />
              <ResultCard
                title="Take Home Pay"
                value={results.takeHomePay}
                description="Estimated monthly take-home pay after federal, state, and payroll taxes."
                accent="primary"
              />
              <ResultCard
                title="Available to Invest"
                value={results.availableToInvest}
                description="Monthly take-home cash remaining after expenses. Selected 401(k) savings are modeled separately below."
              />
            </div>

            <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <div className="space-y-2">
                <p className="text-xs font-medium tracking-[0.18em] text-slate-500 uppercase">
                  Recommended Allocation
                </p>
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                  Suggested monthly distribution
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-slate-600">
                  Emergency, Roth IRA, and taxable allocations come from the
                  current cash plan, while the selected 401(k) and employer
                  match are layered in alongside them.
                </p>
              </div>

              {!hasRecommendedAllocation ? (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
                  No investable cash available. Reduce expenses or increase
                  income.
                </div>
              ) : (
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {allocationItems.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4"
                    >
                      <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
                        {item.title}
                      </p>
                      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                        {formatCurrency(item.monthly)}
                        <span className="ml-2 text-sm font-medium text-slate-500">
                          /mo
                        </span>
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        {formatCurrency(item.annual)}/yr
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-6 text-sm leading-6 text-slate-600">
                Current recommendations use simplified starter rules and will
                become more personalized in later versions.
              </p>
            </section>

            <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-medium tracking-[0.18em] text-slate-500 uppercase">
                      Current Estimates
                    </p>
                    <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                      Tax, retirement, and allocation math are now flowing
                      through the same dashboard.
                    </h2>
                    <p className="max-w-2xl text-sm leading-6 text-slate-600">
                      The planner now combines simplified tax estimates,
                      selected retirement contributions, employer match, and a
                      starter allocation plan in one view.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <CompactMetric
                      label="Annual Taxes"
                      value={formatCurrency(results.annualTaxes)}
                    />
                    <CompactMetric
                      label="Employee 401(k)"
                      value={formatCurrency(
                        results.retirementPlan.employee401kAnnualContribution,
                      )}
                    />
                    <CompactMetric
                      label="Employer Match"
                      value={formatCurrency(results.retirementPlan.employerMatchAnnual)}
                    />
                  </div>
                </div>

                <div className="min-w-[280px] rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
                    Current Inputs
                  </p>
                  <dl className="mt-3 space-y-3 text-sm">
                    <KeyValueRow label="State" value={formValues.state} />
                    <KeyValueRow
                      label="Filing Status"
                      value={formatTitleCase(formValues.filingStatus)}
                    />
                    <KeyValueRow
                      label="Monthly Expenses"
                      value={formatCurrency(parseNumberInput(formValues.monthlyExpenses))}
                    />
                    <KeyValueRow
                      label="401(k) Contribution"
                      value={formatPercent(
                        parseNumberInput(formValues.employee401kContributionPercent),
                      )}
                    />
                    <KeyValueRow
                      label="Employer Match"
                      value={`${formatPercent(
                        parseNumberInput(formValues.employerMatchPercent),
                      )} up to ${formatPercent(
                        parseNumberInput(formValues.employerMatchCapPercent),
                      )}`}
                    />
                    <KeyValueRow
                      label="Risk Profile"
                      value={formatTitleCase(formValues.riskProfile)}
                    />
                    <KeyValueRow
                      label="Effective Tax Rate"
                      value={formatPercent(results.effectiveTaxRate)}
                    />
                  </dl>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <div className="space-y-2">
                <p className="text-xs font-medium tracking-[0.18em] text-slate-500 uppercase">
                  3-Year Outlook
                </p>
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                  Projected balances every 3 months
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-slate-600">
                  The outlook uses your current retirement settings, allocation
                  plan, and risk profile to sketch a simple three-year path.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <CompactMetric
                  label="Projected 1-Year Total"
                  value={formatCurrency(results.projectedYear1Total)}
                />
                <CompactMetric
                  label="Projected 2-Year Total"
                  value={formatCurrency(results.projectedYear2Total)}
                />
                <CompactMetric
                  label="Projected 3-Year Total"
                  value={formatCurrency(results.projectedYear3Total)}
                />
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <ProjectionChart points={results.projections} />
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4">
                  <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
                    Planning Assumptions
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Projection uses simplified growth and contribution
                    assumptions for planning purposes only.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4">
                  <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
                    Growth Assumption
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {formatTitleCase(formValues.riskProfile)} profile modeled at{" "}
                    {formatPercent(getAnnualGrowthAssumption(formValues.riskProfile))}{" "}
                    annual growth with contributions added evenly each month.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function getDashboardSummary(values: PlannerFormValues): DashboardSummary {
  const salary = parseNumberInput(values.salary);
  const monthlyExpenses = parseNumberInput(values.monthlyExpenses);
  const employee401kContributionPercent = parseNumberInput(
    values.employee401kContributionPercent,
  );
  const employerMatchPercent = parseNumberInput(values.employerMatchPercent);
  const employerMatchCapPercent = parseNumberInput(
    values.employerMatchCapPercent,
  );

  const taxBreakdown = calculateTaxes({
    salary,
    state: values.state,
    filingStatus: values.filingStatus,
  });
  const retirementPlan = calculateRetirementPlan({
    salary,
    employeeContributionPercent: employee401kContributionPercent,
    employerMatchPercent,
    employerMatchCapPercent,
  });
  const monthlyTaxes = roundCurrency(taxBreakdown.totalTax / 12);
  const availableToInvest = roundCurrency(
    taxBreakdown.monthlyNet - monthlyExpenses,
  );
  const allocation = allocateIncome(
    availableToInvest,
    retirementPlan.employee401kMonthlyContribution,
  );
  const contributionGuidance = getContributionGuidance(
    retirementPlan,
    values.riskProfile,
  );
  const projections = projectFinancialPlan({
    riskProfile: values.riskProfile,
    employee401kMonthlyContribution:
      retirementPlan.employee401kMonthlyContribution,
    employerMatchMonthly: retirementPlan.employerMatchMonthly,
    rothIRAMonthlyContribution: allocation.rothIRA,
    taxableMonthlyContribution: allocation.taxable,
    emergencyFundMonthlyContribution: allocation.emergency,
  });

  return {
    estimatedTaxes: formatCurrency(monthlyTaxes),
    takeHomePay: formatCurrency(taxBreakdown.monthlyNet),
    availableToInvest: formatCurrency(availableToInvest),
    annualTaxes: taxBreakdown.totalTax,
    effectiveTaxRate: taxBreakdown.effectiveTaxRate * 100,
    allocation,
    retirementPlan,
    contributionGuidance,
    projections,
    projectedYear1Total: getProjectionTotal(projections, 12),
    projectedYear2Total: getProjectionTotal(projections, 24),
    projectedYear3Total: getProjectionTotal(projections, 36),
  };
}

type CompactMetricProps = {
  label: string;
  value: string;
};

function CompactMetric({ label, value }: CompactMetricProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
      <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  );
}

type KeyValueRowProps = {
  label: string;
  value: string;
};

function KeyValueRow({ label, value }: KeyValueRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-900">{value}</dd>
    </div>
  );
}

function getProjectionTotal(points: ProjectionPoint[], month: number): number {
  return points.find((point) => point.month === month)?.totalBalance ?? 0;
}

function parseNumberInput(value: string): number {
  const parsedValue = parseFloat(value) || 0;

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  }).format(value)}%`;
}

function formatTitleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getAnnualGrowthAssumption(riskProfile: RiskProfile): number {
  const annualGrowthByRiskProfile: Record<RiskProfile, number> = {
    conservative: 4,
    moderate: 6,
    aggressive: 8,
  };

  return annualGrowthByRiskProfile[riskProfile];
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
