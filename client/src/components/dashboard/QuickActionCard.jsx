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
        "group flex min-h-24 items-start justify-between gap-4 rounded-2xl border p-4",
        "transition duration-200 hover:-translate-y-0.5 hover:shadow-md",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-rv-plum",
        "sm:min-h-28 sm:p-5",
        variantClasses[variant] || variantClasses.secondary,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold sm:text-lg">
          {title}
        </h3>

        <p className="text-sm leading-5 opacity-80">
          {description}
        </p>
      </div>

      {icon ? (
        <span
          aria-hidden="true"
          className="shrink-0 text-xl transition-transform group-hover:scale-110 sm:text-2xl"
        >
          {icon}
        </span>
      ) : null}
    </Link>
  );
}