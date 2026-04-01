"use client";

import { useState } from "react";
import { InputForm } from "@/components/InputForm";
import { ResultCard } from "@/components/ResultCard";
import {
  defaultPlannerFormValues,
  getMockPlanSummary,
  type PlannerFormValues,
} from "@/engine/mockPlanner";

export default function Home() {
  const [formValues, setFormValues] = useState<PlannerFormValues>(
    defaultPlannerFormValues,
  );
  const [results, setResults] = useState(() =>
    getMockPlanSummary(defaultPlannerFormValues),
  );

  const handleCalculate = () => {
    setResults(getMockPlanSummary(formValues));
  };

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
                  Start with a clean financial snapshot. This foundation keeps
                  the UI modular now and leaves room for a dedicated planning
                  engine under <code className="font-mono">/src/engine</code>{" "}
                  next.
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
                  Mock outputs wired
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
            />
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <ResultCard
                title="Estimated Taxes"
                value={results.estimatedTaxes}
                description="Federal and state tax preview until the full rules engine is connected."
              />
              <ResultCard
                title="Take Home Pay"
                value={results.takeHomePay}
                description="Mock monthly net pay after taxes and payroll deductions."
                accent="primary"
              />
              <ResultCard
                title="Available to Invest"
                value={results.availableToInvest}
                description="Remaining monthly cash after your entered expenses."
              />
            </div>

            <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium tracking-[0.18em] text-slate-500 uppercase">
                    Next Step
                  </p>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                    Financial planning engine comes next.
                  </h2>
                  <p className="max-w-2xl text-sm leading-6 text-slate-600">
                    The dashboard is ready for real tax rules, account
                    prioritization, and portfolio recommendations. For now, the
                    results above are intentionally lightweight placeholders so
                    the UI and data flow are in place.
                  </p>
                </div>
                <div className="min-w-[220px] rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
                    Current Inputs
                  </p>
                  <dl className="mt-3 space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-slate-500">State</dt>
                      <dd className="font-medium text-slate-900">
                        {formValues.state}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-slate-500">Filing Status</dt>
                      <dd className="font-medium capitalize text-slate-900">
                        {formValues.filingStatus.replace("-", " ")}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-slate-500">Monthly Expenses</dt>
                      <dd className="font-medium text-slate-900">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        }).format(Number(formValues.monthlyExpenses) || 0)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
