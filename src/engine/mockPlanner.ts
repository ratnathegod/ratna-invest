export type PlannerFormValues = {
  salary: string;
  state: "CA" | "TX" | "NY";
  filingStatus: "single" | "married";
  monthlyExpenses: string;
};

export type PlannerSummary = {
  estimatedTaxes: string;
  takeHomePay: string;
  availableToInvest: string;
};

export const defaultPlannerFormValues: PlannerFormValues = {
  salary: "120000",
  state: "CA",
  filingStatus: "single",
  monthlyExpenses: "3500",
};

export function getMockPlanSummary(
  values: PlannerFormValues,
): PlannerSummary {
  const salary = Number(values.salary) || 0;
  const monthlyExpenses = Number(values.monthlyExpenses) || 0;

  const stateAdjustment = {
    CA: 1.08,
    NY: 1.05,
    TX: 0.92,
  }[values.state];

  const filingAdjustment = values.filingStatus === "married" ? 0.9 : 1;
  const monthlyTaxEstimate = salary
    ? (salary * 0.24 * stateAdjustment * filingAdjustment) / 12
    : 0;
  const monthlyTakeHome = salary ? salary / 12 - monthlyTaxEstimate : 0;
  const monthlyInvestingCapacity = Math.max(
    monthlyTakeHome - monthlyExpenses,
    0,
  );

  return {
    estimatedTaxes: formatCurrency(monthlyTaxEstimate),
    takeHomePay: formatCurrency(monthlyTakeHome),
    availableToInvest: formatCurrency(monthlyInvestingCapacity),
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
