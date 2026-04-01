import type { RiskProfile } from "@/types/finance";

export type RetirementPlanInput = {
  salary: number;
  employeeContributionPercent: number;
  employerMatchPercent: number;
  employerMatchCapPercent: number;
};

export type RetirementPlanSummary = {
  selectedEmployeeContributionPercent: number;
  effectiveEmployeeContributionPercent: number;
  employerMatchPercent: number;
  employerMatchCapPercent: number;
  matchedEmployeePercent: number;
  employerMatchPercentOfSalary: number;
  employee401kAnnualContribution: number;
  employee401kMonthlyContribution: number;
  employerMatchAnnual: number;
  employerMatchMonthly: number;
  totalRetirementAnnual: number;
  totalRetirementMonthly: number;
  totalRetirementSavingsPercent: number;
};

export type ContributionGuidance = {
  selectedContributionPercent: number;
  estimatedEmployerMatchPercent: number;
  suggestedTargetRetirementSavingsPercent: number;
  totalRetirementSavingsPercent: number;
  recommendation: string;
  employee401kPercent: number;
  employerMatchPercentOfSalary: number;
};

const EMPLOYEE_401K_ANNUAL_LIMIT = 24_500;

const TARGET_RETIREMENT_SAVINGS_PERCENT: Record<RiskProfile, number> = {
  conservative: 12,
  moderate: 15,
  aggressive: 20,
};

export function calculateRetirementPlan(
  input: RetirementPlanInput,
): RetirementPlanSummary {
  const normalizedSalary = normalizeCurrency(input.salary);
  const selectedEmployeeContributionPercent = normalizePercent(
    input.employeeContributionPercent,
  );
  const employerMatchPercent = normalizePercent(input.employerMatchPercent);
  const employerMatchCapPercent = normalizePercent(input.employerMatchCapPercent);

  if (normalizedSalary === 0) {
    return {
      selectedEmployeeContributionPercent,
      effectiveEmployeeContributionPercent: 0,
      employerMatchPercent,
      employerMatchCapPercent,
      matchedEmployeePercent: 0,
      employerMatchPercentOfSalary: 0,
      employee401kAnnualContribution: 0,
      employee401kMonthlyContribution: 0,
      employerMatchAnnual: 0,
      employerMatchMonthly: 0,
      totalRetirementAnnual: 0,
      totalRetirementMonthly: 0,
      totalRetirementSavingsPercent: 0,
    };
  }

  const requestedEmployeeAnnualContribution =
    normalizedSalary * (selectedEmployeeContributionPercent / 100);
  const employee401kAnnualContribution = roundCurrency(
    Math.min(requestedEmployeeAnnualContribution, EMPLOYEE_401K_ANNUAL_LIMIT),
  );
  const employee401kMonthlyContribution = roundCurrency(
    employee401kAnnualContribution / 12,
  );
  const effectiveEmployeeContributionPercent =
    normalizedSalary === 0
      ? 0
      : roundPercent(
          (employee401kAnnualContribution / normalizedSalary) * 100,
        );

  // Match only applies to the portion of pay that is both contributed and eligible.
  const matchedEmployeePercent = roundPercent(
    Math.min(effectiveEmployeeContributionPercent, employerMatchCapPercent),
  );
  const employerMatchPercentOfSalary = roundPercent(
    matchedEmployeePercent * (employerMatchPercent / 100),
  );
  const employerMatchAnnual = roundCurrency(
    normalizedSalary * (employerMatchPercentOfSalary / 100),
  );
  const employerMatchMonthly = roundCurrency(employerMatchAnnual / 12);
  const totalRetirementAnnual = roundCurrency(
    employee401kAnnualContribution + employerMatchAnnual,
  );
  const totalRetirementMonthly = roundCurrency(totalRetirementAnnual / 12);
  const totalRetirementSavingsPercent = roundPercent(
    (totalRetirementAnnual / normalizedSalary) * 100,
  );

  return {
    selectedEmployeeContributionPercent,
    effectiveEmployeeContributionPercent,
    employerMatchPercent,
    employerMatchCapPercent,
    matchedEmployeePercent,
    employerMatchPercentOfSalary,
    employee401kAnnualContribution,
    employee401kMonthlyContribution,
    employerMatchAnnual,
    employerMatchMonthly,
    totalRetirementAnnual,
    totalRetirementMonthly,
    totalRetirementSavingsPercent,
  };
}

export function getContributionGuidance(
  retirementPlan: RetirementPlanSummary,
  riskProfile: RiskProfile,
): ContributionGuidance {
  const suggestedTargetRetirementSavingsPercent =
    TARGET_RETIREMENT_SAVINGS_PERCENT[riskProfile];

  let recommendation =
    "You are near or above a strong long-term retirement savings target.";

  if (
    retirementPlan.selectedEmployeeContributionPercent <
    retirementPlan.employerMatchCapPercent
  ) {
    recommendation = `Increase contribution to at least ${formatPercentValue(
      retirementPlan.employerMatchCapPercent,
    )} to capture the full employer match.`;
  } else if (
    retirementPlan.totalRetirementSavingsPercent <
    suggestedTargetRetirementSavingsPercent
  ) {
    recommendation = `You are capturing the full match. Consider increasing total retirement savings toward ${formatPercentValue(
      suggestedTargetRetirementSavingsPercent,
    )}.`;
  }

  return {
    selectedContributionPercent:
      retirementPlan.selectedEmployeeContributionPercent,
    estimatedEmployerMatchPercent: retirementPlan.employerMatchPercentOfSalary,
    suggestedTargetRetirementSavingsPercent,
    totalRetirementSavingsPercent: retirementPlan.totalRetirementSavingsPercent,
    recommendation,
    employee401kPercent: retirementPlan.effectiveEmployeeContributionPercent,
    employerMatchPercentOfSalary: retirementPlan.employerMatchPercentOfSalary,
  };
}

function normalizeCurrency(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return value;
}

function normalizePercent(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return roundPercent(value);
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function roundPercent(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function formatPercentValue(value: number): string {
  return `${roundPercent(value)}%`;
}
