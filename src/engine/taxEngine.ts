import type {
  FilingStatus,
  SupportedState,
  TaxBreakdown,
  TaxEngineInput,
} from "@/types/finance";

type FederalTaxBracket = {
  upTo: number;
  rate: number;
};

const STANDARD_DEDUCTIONS: Record<FilingStatus, number> = {
  single: 14_600,
  married: 29_200,
};

const FEDERAL_TAX_BRACKETS: Record<FilingStatus, FederalTaxBracket[]> = {
  single: [
    { upTo: 11_600, rate: 0.1 },
    { upTo: 47_150, rate: 0.12 },
    { upTo: 100_525, rate: 0.22 },
    { upTo: 191_950, rate: 0.24 },
  ],
  married: [
    { upTo: 23_200, rate: 0.1 },
    { upTo: 94_300, rate: 0.12 },
    { upTo: 201_050, rate: 0.22 },
    { upTo: 383_900, rate: 0.24 },
  ],
};

const STATE_TAX_RATES: Record<SupportedState, number> = {
  CA: 0.05,
  TX: 0,
  NY: 0.06,
};

const SOCIAL_SECURITY_RATE = 0.062;
const SOCIAL_SECURITY_WAGE_CAP = 168_600;
const MEDICARE_RATE = 0.0145;

const ZERO_TAX_BREAKDOWN: TaxBreakdown = {
  grossIncome: 0,
  taxableIncome: 0,
  federalTax: 0,
  stateTax: 0,
  socialSecurityTax: 0,
  medicareTax: 0,
  ficaTax: 0,
  totalTax: 0,
  netIncome: 0,
  monthlyGross: 0,
  monthlyNet: 0,
  effectiveTaxRate: 0,
};

export function calculateTaxableIncome(
  salary: number,
  filingStatus: FilingStatus,
): number {
  const normalizedSalary = normalizeSalary(salary);

  if (normalizedSalary === 0) {
    return 0;
  }

  // Apply the standard deduction first so taxable income never drops below zero.
  const taxableIncome = Math.max(
    normalizedSalary - STANDARD_DEDUCTIONS[filingStatus],
    0,
  );

  return roundCurrency(taxableIncome);
}

export function calculateFederalTax(
  taxableIncome: number,
  filingStatus: FilingStatus,
): number {
  const normalizedTaxableIncome = normalizeSalary(taxableIncome);

  if (normalizedTaxableIncome === 0) {
    return 0;
  }

  const brackets = FEDERAL_TAX_BRACKETS[filingStatus];
  let previousLimit = 0;
  let remainingIncome = normalizedTaxableIncome;
  let totalFederalTax = 0;

  // Progressive bracket math only taxes the portion that falls inside each band.
  for (const bracket of brackets) {
    if (remainingIncome <= 0) {
      break;
    }

    const bracketWidth = bracket.upTo - previousLimit;
    const taxableAmountInBracket = Math.min(remainingIncome, bracketWidth);

    if (taxableAmountInBracket > 0) {
      totalFederalTax += taxableAmountInBracket * bracket.rate;
      remainingIncome -= taxableAmountInBracket;
    }

    previousLimit = bracket.upTo;
  }

  if (remainingIncome > 0) {
    // TODO: Add the full higher federal brackets instead of continuing at 24%.
    totalFederalTax += remainingIncome * 0.24;
  }

  return roundCurrency(totalFederalTax);
}

export function calculateSocialSecurityTax(salary: number): number {
  const normalizedSalary = normalizeSalary(salary);

  if (normalizedSalary === 0) {
    return 0;
  }

  const socialSecurityWages = Math.min(
    normalizedSalary,
    SOCIAL_SECURITY_WAGE_CAP,
  );

  return roundCurrency(socialSecurityWages * SOCIAL_SECURITY_RATE);
}

export function calculateMedicareTax(salary: number): number {
  const normalizedSalary = normalizeSalary(salary);

  if (normalizedSalary === 0) {
    return 0;
  }

  // TODO: Add Additional Medicare Tax threshold support in a future version.
  return roundCurrency(normalizedSalary * MEDICARE_RATE);
}

export function calculateFICATax(salary: number): {
  socialSecurityTax: number;
  medicareTax: number;
  ficaTax: number;
} {
  // FICA is split between Social Security and Medicare for clearer reporting.
  const socialSecurityTax = calculateSocialSecurityTax(salary);
  const medicareTax = calculateMedicareTax(salary);
  const ficaTax = roundCurrency(socialSecurityTax + medicareTax);

  return {
    socialSecurityTax,
    medicareTax,
    ficaTax,
  };
}

export function calculateStateTax(
  salary: number,
  state: SupportedState,
): number {
  const normalizedSalary = normalizeSalary(salary);

  if (normalizedSalary === 0) {
    return 0;
  }

  // Simplified MVP assumption: each supported state uses a flat rate on salary.
  return roundCurrency(normalizedSalary * STATE_TAX_RATES[state]);
}

export function calculateTaxes(input: TaxEngineInput): TaxBreakdown {
  const grossIncome = roundCurrency(normalizeSalary(input.salary));

  if (grossIncome === 0) {
    return { ...ZERO_TAX_BREAKDOWN };
  }

  const taxableIncome = calculateTaxableIncome(
    grossIncome,
    input.filingStatus,
  );
  const federalTax = calculateFederalTax(taxableIncome, input.filingStatus);
  const stateTax = calculateStateTax(grossIncome, input.state);
  const { socialSecurityTax, medicareTax, ficaTax } =
    calculateFICATax(grossIncome);

  const totalTax = roundCurrency(federalTax + stateTax + ficaTax);
  const netIncome = roundCurrency(grossIncome - totalTax);
  const monthlyGross = roundCurrency(grossIncome / 12);
  const monthlyNet = roundCurrency(netIncome / 12);
  const effectiveTaxRate =
    grossIncome === 0 ? 0 : roundRate(totalTax / grossIncome);

  return {
    grossIncome,
    taxableIncome,
    federalTax,
    stateTax,
    socialSecurityTax,
    medicareTax,
    ficaTax,
    totalTax,
    netIncome,
    monthlyGross,
    monthlyNet,
    effectiveTaxRate,
  };
}

function normalizeSalary(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return value;
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function roundRate(value: number): number {
  return Math.round((value + Number.EPSILON) * 10_000) / 10_000;
}

/*
Manual test cases until a test runner is added:

1. calculateTaxes({ salary: 0, state: "TX", filingStatus: "single" })
   Expected: every field returns 0.

2. calculateTaxes({ salary: 100000, state: "TX", filingStatus: "single" })
   Expected:
   - taxableIncome = 85400
   - federalTax = 13841
   - stateTax = 0
   - socialSecurityTax = 6200
   - medicareTax = 1450
   - ficaTax = 7650

3. calculateTaxes({ salary: 150000, state: "CA", filingStatus: "married" })
   Expected:
   - taxableIncome = 120800
   - federalTax = 16682
   - stateTax = 7500
   - socialSecurityTax = 9300
   - medicareTax = 2175
   - ficaTax = 11475

4. calculateTaxes({ salary: 250000, state: "NY", filingStatus: "single" })
   Expected:
   - socialSecurityTax = 10453.2 because wages above the cap are not taxed for Social Security
   - medicareTax = 3625
   - stateTax = 15000

Known MVP limitations:
- Federal brackets stop at the listed 24% bracket and continue at 24% above it.
- Additional Medicare Tax is not included yet.
- State tax is a flat-rate simplification for CA and NY.
*/
