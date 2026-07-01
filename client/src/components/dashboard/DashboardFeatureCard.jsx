const variantClasses = {
  plum:
    "border-rv-plum/20 bg-rv-plum/5 text-rv-plum",

  teal:
    "border-rv-teal/40 bg-rv-teal/15 text-rv-plum",

  warm:
    "border-amber-200 bg-amber-50 text-rv-plum",
};

export default function DashboardFeatureCard({
  title,
  description,
  icon,
  badge = "Coming Soon",
  variant = "plum",
}) {
  return (
    <article
      className={[
        "flex min-h-32 flex-col justify-between rounded-2xl border p-4 sm:p-5",
        variantClasses[variant] || variantClasses.plum,
      ].join(" ")}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <span
            aria-hidden="true"
            className="text-2xl"
          >
            {icon}
          </span>

          {badge ? (
            <span className="rounded-lg border border-current/15 bg-white/70 px-3 py-1 text-xs font-semibold">
            {badge}
            </span>
          ) : null}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            {title}
          </h3>

          <p className="text-sm leading-6 opacity-75">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}