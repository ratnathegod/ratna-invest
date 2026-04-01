export type IncomeAllocation = {
  emergency: number;
  retirement401k: number;
  rothIRA: number;
  taxable: number;
};

export function allocateIncome(monthlyAvailable: number): IncomeAllocation {
  const normalizedMonthlyAvailable =
    Number.isFinite(monthlyAvailable) && monthlyAvailable > 0
      ? monthlyAvailable
      : 0;

  if (normalizedMonthlyAvailable <= 0) {
    return {
      emergency: 0,
      retirement401k: 0,
      rothIRA: 0,
      taxable: 0,
    };
  }

  const emergency = roundCurrency(normalizedMonthlyAvailable * 0.2);
  const retirement401k = roundCurrency(normalizedMonthlyAvailable * 0.4);
  const rothIRA = roundCurrency(normalizedMonthlyAvailable * 0.2);
  const taxable = roundCurrency(
    normalizedMonthlyAvailable - emergency - retirement401k - rothIRA,
  );

  return {
    emergency,
    retirement401k,
    rothIRA,
    taxable,
  };
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
