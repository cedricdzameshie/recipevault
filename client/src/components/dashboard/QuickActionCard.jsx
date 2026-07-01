import { Link } from "react-router-dom";

const variantClasses = {
  primary:
    "border-rv-plum bg-rv-plum text-white hover:bg-rv-plum/90",

  accent:
    "border-rv-teal bg-rv-teal text-rv-plum hover:bg-rv-teal/90",

  secondary:
    "border-amber-200 bg-amber-100 text-rv-plum hover:bg-amber-200",
};

export default function QuickActionCard({
  title,
  description,
  to,
  icon,
  variant = "secondary",
}) {
  return (
    <Link
      to={to}
      className={[
        "group flex items-center gap-3 rounded-xl border px-3 py-3",
        "transition duration-200 hover:-translate-y-0.5 hover:shadow-sm",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-rv-plum",
        "sm:px-4 sm:py-3.5",
        variantClasses[variant] || variantClasses.secondary,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20 text-lg font-semibold"
        >
          {icon}
        </span>
      ) : null}

      <div className="min-w-0">
        <h3 className="text-sm font-semibold leading-5 sm:text-base">
          {title}
        </h3>

        <p className="truncate text-xs opacity-75 sm:text-sm">
          {description}
        </p>
      </div>
    </Link>
  );
}