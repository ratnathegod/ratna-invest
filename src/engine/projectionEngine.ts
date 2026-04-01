import type { RiskProfile } from "@/types/finance";

export type ProjectionInput = {
  riskProfile: RiskProfile;
  employee401kMonthlyContribution: number;
  employerMatchMonthly: number;
  rothIRAMonthlyContribution: number;
  taxableMonthlyContribution: number;
  emergencyFundMonthlyContribution: number;
};

export type ProjectionPoint = {
  month: number;
  employee401kBalance: number;
  employerMatchBalance: number;
  rothIRABalance: number;
  taxableBalance: number;
  emergencyFundBalance: number;
  totalBalance: number;
};

const ANNUAL_GROWTH_RATE: Record<RiskProfile, number> = {
  conservative: 0.04,
  moderate: 0.06,
  aggressive: 0.08,
};

export function projectFinancialPlan(
  input: ProjectionInput,
): ProjectionPoint[] {
  const monthlyGrowthRate = getMonthlyGrowthRate(
    ANNUAL_GROWTH_RATE[input.riskProfile],
  );
  const monthlyEmployee401k = normalizeCurrency(
    input.employee401kMonthlyContribution,
  );
  const monthlyEmployerMatch = normalizeCurrency(input.employerMatchMonthly);
  const monthlyRothIRA = normalizeCurrency(input.rothIRAMonthlyContribution);
  const monthlyTaxable = normalizeCurrency(input.taxableMonthlyContribution);
  const monthlyEmergencyFund = normalizeCurrency(
    input.emergencyFundMonthlyContribution,
  );

  let employee401kBalance = 0;
  let employerMatchBalance = 0;
  let rothIRABalance = 0;
  let taxableBalance = 0;
  let emergencyFundBalance = 0;

  const points: ProjectionPoint[] = [
    {
      month: 0,
      employee401kBalance: 0,
      employerMatchBalance: 0,
      rothIRABalance: 0,
      taxableBalance: 0,
      emergencyFundBalance: 0,
      totalBalance: 0,
    },
  ];

  for (let month = 1; month <= 36; month += 1) {
    employee401kBalance = growBalance(
      employee401kBalance,
      monthlyEmployee401k,
      monthlyGrowthRate,
    );
    employerMatchBalance = growBalance(
      employerMatchBalance,
      monthlyEmployerMatch,
      monthlyGrowthRate,
    );
    rothIRABalance = growBalance(
      rothIRABalance,
      monthlyRothIRA,
      monthlyGrowthRate,
    );
    taxableBalance = growBalance(
      taxableBalance,
      monthlyTaxable,
      monthlyGrowthRate,
    );
    emergencyFundBalance = roundCurrency(
      emergencyFundBalance + monthlyEmergencyFund,
    );

    if (month % 3 === 0) {
      points.push({
        month,
        employee401kBalance,
        employerMatchBalance,
        rothIRABalance,
        taxableBalance,
        emergencyFundBalance,
        totalBalance: roundCurrency(
          employee401kBalance +
            employerMatchBalance +
            rothIRABalance +
            taxableBalance +
            emergencyFundBalance,
        ),
      });
    }
  }

  return points;
}

function growBalance(
  currentBalance: number,
  monthlyContribution: number,
  monthlyGrowthRate: number,
): number {
  return roundCurrency(
    (currentBalance + monthlyContribution) * (1 + monthlyGrowthRate),
  );
}

function getMonthlyGrowthRate(annualGrowthRate: number): number {
  return Math.pow(1 + annualGrowthRate, 1 / 12) - 1;
}

function normalizeCurrency(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return value;
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
