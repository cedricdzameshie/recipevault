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

  softCoral:
    "border-rv-coral/30 bg-rv-coral/10 text-rv-plum hover:bg-rv-coral/15",

  softSage:
    "border-emerald-200 bg-emerald-50 text-rv-plum hover:bg-emerald-100",  

   softBlue:
  "border-sky-200 bg-sky-50 text-rv-plum hover:bg-sky-100", 
};

const sizeClasses = {
  standard:
    "min-h-[72px] items-center gap-3 px-3 py-3 sm:px-4 sm:py-3.5",

  compact:
    "relative min-h-[100px] items-center gap-3 px-3 py-3",
};

const iconSizeClasses = {
  standard: "h-9 w-9 text-lg",
  compact: "h-9 w-9 text-base",
};

const iconVariantClasses = {
  primary:
    "bg-white/20 text-white",

  accent:
    "bg-white/25 text-rv-plum",

  secondary:
    "bg-white/45 text-rv-plum",

  softPlum:
    "border border-rv-plum/10 bg-white/65 text-rv-plum",

  softTeal:
    "border border-rv-teal/20 bg-white/60 text-rv-plum",

  softWarm:
    "border border-amber-200/80 bg-white/65 text-rv-plum",

  neutral:
    "border border-stone-200 bg-stone-50 text-rv-plum",

  softCoral:
    "border border-rv-coral/20 bg-white/70 text-rv-plum",

  softSage:
    "border border-emerald-200 bg-white/70 text-rv-plum",  

  softBlue:
  "border border-sky-200 bg-white/70 text-rv-plum",  
    
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
  const isCompact = size === "compact";

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

  const badgeElement = badge ? (
    <span className="w-fit rounded-full border border-current/15 bg-white/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm">
      {badge}
    </span>
  ) : null;

  const content = (
    <>
      {icon ? (
        <span
          aria-hidden="true"
          className={[
            "flex shrink-0 items-center justify-center rounded-lg font-semibold",
            iconSizeClasses[size] || iconSizeClasses.standard,
            iconVariantClasses[variant] ||
              iconVariantClasses.secondary,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {icon}
        </span>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        {isCompact ? (
          <>
            <div className={badge ? "pb-7 pr-1" : ""}>
              <h3 className="text-[15px] font-semibold leading-5 sm:text-base">
                {title}
              </h3>

              {description ? (
                <p className="mt-1 text-xs leading-[1.35] opacity-75 sm:text-sm">
                  {description}
                </p>
              ) : null}
            </div>

            {badge ? (
              <div className="absolute bottom-3 right-3">
                {badgeElement}
              </div>
            ) : null}
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold leading-5 sm:text-base">
                {title}
              </h3>

              {badgeElement}
            </div>

            {description ? (
              <p className="mt-0.5 text-xs leading-4 opacity-75 sm:text-sm sm:leading-5">
                {description}
              </p>
            ) : null}
          </>
        )}
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