import type {
  ContributionGuidance,
  RetirementPlanSummary,
} from "@/engine/retirementEngine";
import type { PlannerFormValues } from "@/types/finance";

type InputFormProps = {
  values: PlannerFormValues;
  onChange: (values: PlannerFormValues) => void;
  onSubmit: () => void;
  contributionGuidance: ContributionGuidance;
  retirementPlan: RetirementPlanSummary;
};

const fieldStyles =
  "mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

export function InputForm({
  values,
  onChange,
  onSubmit,
  contributionGuidance,
  retirementPlan,
}: InputFormProps) {
  const updateField = <K extends keyof PlannerFormValues>(
    key: K,
    value: PlannerFormValues[K],
  ) => {
    onChange({
      ...values,
      [key]: value,
    });
  };

  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-7">
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-[0.18em] text-slate-500 uppercase">
          Input Snapshot
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Start with the basics
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Enter income, expenses, and starter retirement settings to preview
          how this planner converts each paycheck into a savings plan.
        </p>
      </div>

      <form
        className="mt-8 space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div>
          <label
            htmlFor="salary"
            className="text-sm font-medium text-slate-700"
          >
            Salary
          </label>
          <input
            id="salary"
            type="number"
            min="0"
            inputMode="numeric"
            className={fieldStyles}
            value={values.salary}
            onChange={(event) => updateField("salary", event.target.value)}
            placeholder="120000"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="state"
              className="text-sm font-medium text-slate-700"
            >
              State
            </label>
            <select
              id="state"
              className={fieldStyles}
              value={values.state}
              onChange={(event) =>
                updateField("state", event.target.value as PlannerFormValues["state"])
              }
            >
              <option value="CA">California</option>
              <option value="TX">Texas</option>
              <option value="NY">New York</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="filing-status"
              className="text-sm font-medium text-slate-700"
            >
              Filing Status
            </label>
            <select
              id="filing-status"
              className={fieldStyles}
              value={values.filingStatus}
              onChange={(event) =>
                updateField(
                  "filingStatus",
                  event.target.value as PlannerFormValues["filingStatus"],
                )
              }
            >
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="monthly-expenses"
            className="text-sm font-medium text-slate-700"
          >
            Monthly Expenses
          </label>
          <input
            id="monthly-expenses"
            type="number"
            min="0"
            inputMode="numeric"
            className={fieldStyles}
            value={values.monthlyExpenses}
            onChange={(event) =>
              updateField("monthlyExpenses", event.target.value)
            }
            placeholder="3500"
          />
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="employee-401k-contribution"
              className="text-sm font-medium text-slate-700"
            >
              401(k) Contribution
            </label>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-900">
              {formatPercent(
                parsePercentInput(values.employee401kContributionPercent),
              )}
            </span>
          </div>
          <input
            id="employee-401k-contribution"
            type="range"
            min="0"
            max="20"
            step="1"
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-slate-900"
            value={values.employee401kContributionPercent}
            onChange={(event) =>
              updateField(
                "employee401kContributionPercent",
                event.target.value,
              )
            }
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0%</span>
            <span>Employer match focus</span>
            <span>20%</span>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="employer-match-percent"
              className="text-sm font-medium text-slate-700"
            >
              Employer Match %
            </label>
            <input
              id="employer-match-percent"
              type="number"
              min="0"
              inputMode="decimal"
              className={fieldStyles}
              value={values.employerMatchPercent}
              onChange={(event) =>
                updateField("employerMatchPercent", event.target.value)
              }
              placeholder="50"
            />
          </div>

          <div>
            <label
              htmlFor="employer-match-cap-percent"
              className="text-sm font-medium text-slate-700"
            >
              Match Cap %
            </label>
            <input
              id="employer-match-cap-percent"
              type="number"
              min="0"
              inputMode="decimal"
              className={fieldStyles}
              value={values.employerMatchCapPercent}
              onChange={(event) =>
                updateField("employerMatchCapPercent", event.target.value)
              }
              placeholder="6"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="risk-profile"
            className="text-sm font-medium text-slate-700"
          >
            Risk Profile
          </label>
          <select
            id="risk-profile"
            className={fieldStyles}
            value={values.riskProfile}
            onChange={(event) =>
              updateField(
                "riskProfile",
                event.target.value as PlannerFormValues["riskProfile"],
              )
            }
          >
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-[0.18em] text-slate-500 uppercase">
              Recommended Contribution Guidance
            </p>
            <p className="text-sm leading-6 text-slate-600">
              Use the slider to test how your contribution changes the employer
              match and your total retirement savings pace.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <GuidanceStat
              label="Selected 401(k)"
              value={formatPercent(
                contributionGuidance.selectedContributionPercent,
              )}
            />
            <GuidanceStat
              label="Estimated employer match"
              value={formatPercent(
                contributionGuidance.estimatedEmployerMatchPercent,
              )}
            />
            <GuidanceStat
              label="Suggested target"
              value={formatPercent(
                contributionGuidance.suggestedTargetRetirementSavingsPercent,
              )}
            />
            <GuidanceStat
              label="Total retirement savings"
              value={formatPercent(
                contributionGuidance.totalRetirementSavingsPercent,
              )}
            />
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-4">
            <p className="text-sm font-medium text-slate-700">
              Recommended next step
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {contributionGuidance.recommendation}
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <ContributionBreakdown
              label="Employee 401(k)"
              percent={retirementPlan.effectiveEmployeeContributionPercent}
              monthly={retirementPlan.employee401kMonthlyContribution}
              annual={retirementPlan.employee401kAnnualContribution}
            />
            <ContributionBreakdown
              label="Employer match"
              percent={retirementPlan.employerMatchPercentOfSalary}
              monthly={retirementPlan.employerMatchMonthly}
              annual={retirementPlan.employerMatchAnnual}
            />
            <ContributionBreakdown
              label="Total retirement"
              percent={retirementPlan.totalRetirementSavingsPercent}
              monthly={retirementPlan.totalRetirementMonthly}
              annual={retirementPlan.totalRetirementAnnual}
            />
          </div>
        </section>

        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
        >
          Calculate
        </button>
      </form>
    </section>
  );
}

type GuidanceStatProps = {
  label: string;
  value: string;
};

function GuidanceStat({ label, value }: GuidanceStatProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  );
}

type ContributionBreakdownProps = {
  label: string;
  percent: number;
  monthly: number;
  annual: number;
};

function ContributionBreakdown({
  label,
  percent,
  monthly,
  annual,
}: ContributionBreakdownProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-slate-950">
        {formatPercent(percent)}
      </p>
      <p className="mt-2 text-sm text-slate-600">
        {formatCurrency(monthly)}/mo
      </p>
      <p className="text-xs text-slate-500">{formatCurrency(annual)}/yr</p>
    </div>
  );
}

function parsePercentInput(value: string): number {
  const parsedValue = parseFloat(value) || 0;

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function formatPercent(value: number): string {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  }).format(value)}%`;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
