type ResultCardProps = {
  title: string;
  value: string;
  description: string;
  accent?: "default" | "primary";
};

export function ResultCard({
  title,
  value,
  description,
  accent = "default",
}: ResultCardProps) {
  const accentClasses =
    accent === "primary"
      ? "border-blue-200/80 bg-blue-50/80"
      : "border-slate-200/80 bg-white/90";

  return (
    <article
      className={`rounded-[24px] border p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] ${accentClasses}`}
    >
      <p className="text-xs font-medium tracking-[0.18em] text-slate-500 uppercase">
        {title}
      </p>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}
