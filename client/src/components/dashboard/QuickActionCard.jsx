import { Link } from "react-router-dom";

const variantClasses = {
  primary:
    "border-rv-plum bg-rv-plum text-white hover:bg-rv-plum/90",

  secondary:
    "border-stone-200 bg-white text-rv-plum hover:bg-stone-50",

  accent:
    "border-rv-teal bg-rv-teal text-rv-plum hover:bg-rv-teal/90",
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
        "group flex min-h-32 flex-col justify-between rounded-2xl border p-5",
        "transition duration-200 hover:-translate-y-0.5 hover:shadow-md",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-rv-plum",
        variantClasses[variant] || variantClasses.secondary,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            {title}
          </h3>

          <p className="text-sm leading-6 opacity-80">
            {description}
          </p>
        </div>

        {icon ? (
          <span
            aria-hidden="true"
            className="text-2xl transition-transform group-hover:scale-110"
          >
            {icon}
          </span>
        ) : null}
      </div>

      <span className="mt-4 text-sm font-semibold">
        Open →
      </span>
    </Link>
  );
}