export type IncomeAllocation = {
  emergency: number;
  retirement401k: number;
  rothIRA: number;
  taxable: number;
};

export function allocateIncome(
  monthlyAvailable: number,
  employee401kMonthlyContribution = 0,
): IncomeAllocation {
  const normalizedMonthlyAvailable =
    Number.isFinite(monthlyAvailable) && monthlyAvailable > 0
      ? monthlyAvailable
      : 0;
  const normalizedEmployee401k =
    Number.isFinite(employee401kMonthlyContribution) &&
    employee401kMonthlyContribution > 0
      ? employee401kMonthlyContribution
      : 0;

  if (normalizedMonthlyAvailable <= 0) {
    return {
      emergency: 0,
      retirement401k: 0,
      rothIRA: 0,
      taxable: 0,
    };
  }

  // Selected 401(k) contributions are modeled first, then the remaining cash
  // is split across emergency savings, Roth IRA, and taxable investing.
  const remainingMonthlyCash = Math.max(
    normalizedMonthlyAvailable - normalizedEmployee401k,
    0,
  );
  const emergency = roundCurrency(remainingMonthlyCash / 3);
  const rothIRA = roundCurrency(remainingMonthlyCash / 3);
  const taxable = roundCurrency(remainingMonthlyCash - emergency - rothIRA);

  return {
    emergency,
    retirement401k: roundCurrency(normalizedEmployee401k),
    rothIRA,
    taxable,
  };
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
