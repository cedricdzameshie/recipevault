import { Link } from "react-router-dom";

const variantClasses = {
  primary:
    "border-rv-plum bg-rv-plum text-white hover:bg-rv-plum/90",

  accent:
    "border-rv-teal bg-rv-teal text-rv-plum hover:bg-rv-teal/90",

  secondary:
    "border-amber-200 bg-amber-100 text-rv-plum hover:bg-amber-200",

  softPlum:
    "border-rv-plum/20 bg-rv-plum/5 text-rv-plum hover:bg-rv-plum/10",

  softTeal:
    "border-rv-teal/40 bg-rv-teal/15 text-rv-plum hover:bg-rv-teal/20",

  softWarm:
    "border-amber-200 bg-amber-50 text-rv-plum hover:bg-amber-100",

  neutral:
    "border-stone-200 bg-white text-rv-plum hover:bg-stone-50",
};

const sizeClasses = {
  standard:
    "min-h-[72px] items-center gap-3 px-3 py-3 sm:px-4 sm:py-3.5",

  compact:
    "min-h-[88px] items-start gap-2.5 px-3 py-3",
};

const iconSizeClasses = {
  standard: "h-9 w-9 text-lg",
  compact: "h-9 w-9 text-base",
};

export default function QuickActionCard({
  title,
  description,
  to,
  icon,
  variant = "secondary",
  size = "standard",
  badge,
  className = "",
}) {
  const cardClasses = [
    "group flex w-full rounded-xl border",
    sizeClasses[size] || sizeClasses.standard,
    variantClasses[variant] || variantClasses.secondary,
    to
      ? [
          "transition duration-200",
          "hover:-translate-y-0.5 hover:shadow-sm",
          "active:translate-y-0 active:scale-[0.99]",
          "focus:outline-none",
          "focus-visible:ring-2 focus-visible:ring-rv-plum",
          "focus-visible:ring-offset-2",
        ].join(" ")
      : "cursor-default",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {icon ? (
        <span
          aria-hidden="true"
          className={[
            "flex shrink-0 items-center justify-center",
            "rounded-lg bg-white/25 font-semibold",
            iconSizeClasses[size] || iconSizeClasses.standard,
          ].join(" ")}
        >
          {icon}
        </span>
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-5 sm:text-base">
            {title}
          </h3>

          {badge ? (
            <span className="shrink-0 rounded-lg border border-current/15 bg-white/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
              {badge}
            </span>
          ) : null}
        </div>

        {description ? (
          <p className="mt-0.5 text-xs leading-4 opacity-75 sm:text-sm sm:leading-5">
            {description}
          </p>
        ) : null}
      </div>
    </>
  );

  if (!to) {
    return (
      <div className={cardClasses} aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <Link to={to} className={cardClasses}>
      {content}
    </Link>
  );
}