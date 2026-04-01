export type FilingStatus = "single" | "married";

export type SupportedState = "CA" | "TX" | "NY";

export type TaxEngineInput = {
  salary: number;
  state: SupportedState;
  filingStatus: FilingStatus;
};

export type PlannerFormValues = {
  salary: string;
  state: SupportedState;
  filingStatus: FilingStatus;
  monthlyExpenses: string;
};

export type TaxBreakdown = {
  grossIncome: number;
  taxableIncome: number;
  federalTax: number;
  stateTax: number;
  socialSecurityTax: number;
  medicareTax: number;
  ficaTax: number;
  totalTax: number;
  netIncome: number;
  monthlyGross: number;
  monthlyNet: number;
  effectiveTaxRate: number;
};
