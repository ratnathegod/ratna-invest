import type { PlannerFormValues } from "@/types/finance";

type InputFormProps = {
  values: PlannerFormValues;
  onChange: (values: PlannerFormValues) => void;
  onSubmit: () => void;
};

const fieldStyles =
  "mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

export function InputForm({ values, onChange, onSubmit }: InputFormProps) {
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
          Enter a few core numbers to preview how this planner will convert
          income into a monthly financial game plan.
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
