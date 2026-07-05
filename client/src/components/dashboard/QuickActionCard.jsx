import { Link } from "react-router-dom";

const variantClasses = {
  primary:
  "border-rv-plum/45 bg-rv-plum/12 text-rv-plum hover:bg-rv-plum/18",

accent:
  "border-rv-teal/55 bg-rv-teal/22 text-rv-plum hover:bg-rv-teal/30",

secondary:
  "border-[#FFC400]/70 bg-[#FFF1B8] text-rv-plum hover:bg-[#FFE895]",

  softPink:
    "border-[#FF3F7F]/45 bg-[#FFD8E6] text-rv-plum hover:bg-[#FFC4DA]",

  softBlue:
    "border-[#150485]/35 bg-[#DCD8F4] text-rv-plum hover:bg-[#CCC6EE]",

  softMagenta:
    "border-[#C62A88]/40 bg-[#F0CEE3] text-rv-plum hover:bg-[#E7B9D7]",

  softGreen:
    "border-[#03C4A1]/45 bg-[#D4F4EF] text-rv-plum hover:bg-[#BFECE5]",

  softGold:
    "border-[#FFC400]/70 bg-[#FFE8A3] text-rv-plum hover:bg-[#FFD978]",

  softCream:
    "border-[#E4DDC5] bg-[#F7F6E5] text-rv-plum hover:bg-[#F0EDD6]",

  neutral:
    "border-stone-300 bg-stone-100 text-rv-plum hover:bg-stone-200",
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
  "border border-rv-plum/25 bg-white/75 text-rv-plum",

accent:
  "border border-rv-teal/30 bg-white/75 text-rv-plum",

secondary:
  "border border-[#FFC400]/60 bg-white/70 text-rv-plum",

  softPink:
    "border border-[#FF3F7F]/35 bg-white/75 text-rv-plum",

  softBlue:
    "border border-[#150485]/20 bg-white/75 text-rv-plum",

  softMagenta:
    "border border-[#C62A88]/30 bg-white/75 text-rv-plum",

  softGreen:
    "border border-[#03C4A1]/35 bg-white/75 text-rv-plum",

  softGold:
    "border border-[#FFC400]/65 bg-white/75 text-rv-plum",

  softCream:
    "border border-[#E4DDC5] bg-white/75 text-rv-plum",

  neutral:
    "border border-stone-300 bg-white text-rv-plum",
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