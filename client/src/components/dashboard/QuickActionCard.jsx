import { Link } from "react-router-dom";

const variantClasses = {
  primary:
    "border-rv-plum/45 bg-rv-plum/12 text-rv-plum hover:bg-rv-plum/18",

  accent:
    "border-rv-teal/55 bg-rv-teal/22 text-rv-plum hover:bg-rv-teal/30",

  secondary:
    "border-[#F97316]/35 bg-[#FFEDD5] text-rv-plum hover:bg-[#FED7AA]",

  add:
    "border-rv-plum/40 bg-rv-plum/10 text-rv-plum hover:bg-rv-plum/15",

  import:
    "border-rv-teal/55 bg-rv-teal/20 text-rv-plum hover:bg-rv-teal/30",

  browse:
    "border-[#F97316]/40 bg-[#FFEDD5] text-rv-plum hover:bg-[#FED7AA]",

  favorite:
    "border-[#EC4899]/35 bg-[#FCE7F3] text-rv-plum hover:bg-[#FBCFE8]",

  folders:
    "border-[#2563EB]/35 bg-[#DBEAFE] text-rv-plum hover:bg-[#BFDBFE]",

  reminders:
    "border-[#059669]/35 bg-[#D1FAE5] text-rv-plum hover:bg-[#A7F3D0]",

  fridge:
    "border-[#7C3AED]/35 bg-[#EDE9FE] text-rv-plum hover:bg-[#DDD6FE]",

  community:
    "border-[#F59E0B]/45 bg-[#FEF3C7] text-rv-plum hover:bg-[#FDE68A]",

  feedback:
    "border-[#A8A29E]/35 bg-[#F5F5F4] text-rv-plum hover:bg-[#E7E5E4]",

  softPink:
    "border-[#EC4899]/35 bg-[#FCE7F3] text-rv-plum hover:bg-[#FBCFE8]",

  softBlue:
    "border-[#2563EB]/35 bg-[#DBEAFE] text-rv-plum hover:bg-[#BFDBFE]",

  softMagenta:
    "border-[#059669]/35 bg-[#D1FAE5] text-rv-plum hover:bg-[#A7F3D0]",

  softGreen:
    "border-[#7C3AED]/35 bg-[#EDE9FE] text-rv-plum hover:bg-[#DDD6FE]",

  softGold:
    "border-[#F59E0B]/45 bg-[#FEF3C7] text-rv-plum hover:bg-[#FDE68A]",

  softCream:
    "border-[#A8A29E]/35 bg-[#F5F5F4] text-rv-plum hover:bg-[#E7E5E4]",

  neutral:
    "border-stone-300 bg-stone-100 text-rv-plum hover:bg-stone-200",
};

const sizeClasses = {
  standard:
    "min-h-[72px] items-center gap-3 px-3 py-3 sm:px-4 sm:py-3.5",

  compact:
    "relative min-h-[88px] items-center gap-3 px-4 py-4 sm:min-h-[96px]",
};

const iconSizeClasses = {
  standard: "h-9 w-9 text-lg",
  compact: "h-10 w-10 text-lg",
};

const iconVariantClasses = {
  primary: "border border-rv-plum/25 bg-white/75 text-rv-plum",

  accent: "border border-rv-teal/30 bg-white/75 text-rv-plum",

  secondary: "border border-[#F97316]/30 bg-white/75 text-rv-plum",

  add: "border border-rv-plum/25 bg-white/75 text-rv-plum",

  import: "border border-rv-teal/30 bg-white/75 text-rv-plum",

  browse: "border border-[#F97316]/30 bg-white/75 text-rv-plum",

  favorite: "border border-[#EC4899]/25 bg-white/75 text-rv-plum",

  folders: "border border-[#2563EB]/25 bg-white/75 text-rv-plum",

  reminders: "border border-[#059669]/25 bg-white/75 text-rv-plum",

  fridge: "border border-[#7C3AED]/25 bg-white/75 text-rv-plum",

  community: "border border-[#F59E0B]/35 bg-white/75 text-rv-plum",

  feedback: "border border-[#A8A29E]/30 bg-white/75 text-rv-plum",

  softPink: "border border-[#EC4899]/25 bg-white/75 text-rv-plum",

  softBlue: "border border-[#2563EB]/25 bg-white/75 text-rv-plum",

  softMagenta: "border border-[#059669]/25 bg-white/75 text-rv-plum",

  softGreen: "border border-[#7C3AED]/25 bg-white/75 text-rv-plum",

  softGold: "border border-[#F59E0B]/35 bg-white/75 text-rv-plum",

  softCream: "border border-[#A8A29E]/30 bg-white/75 text-rv-plum",

  neutral: "border border-stone-300 bg-white text-rv-plum",
};

export default function QuickActionCard({
  title,
  description,
  to,
  icon,
  variant = "secondary",
  size = "standard",
  badge,
  mobileBadge,
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
  <>
    <span className="hidden w-fit rounded-full border border-current/15 bg-white/85 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm sm:inline-flex">
      {badge}
    </span>

    <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-current/15 bg-white/90 px-2 text-xs font-bold uppercase shadow-sm sm:hidden">
      {mobileBadge || badge}
    </span>
  </>
) : null;

  const content = (
    <>
      {icon ? (
        <span
          aria-hidden="true"
          className={[
            "flex shrink-0 items-center justify-center rounded-xl font-bold",
            iconSizeClasses[size] || iconSizeClasses.standard,
            iconVariantClasses[variant] || iconVariantClasses.secondary,
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
    <div className={badge ? "pr-10 sm:pr-16" : ""}>
      <h3 className="text-base font-bold leading-tight tracking-tight sm:text-lg">
        {title}
      </h3>
    </div>

    {badge ? (
      <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
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