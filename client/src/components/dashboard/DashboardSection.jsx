import { Link } from "react-router-dom";

export default function DashboardSection({
  title,
  actionText,
  actionTo,
  children,
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/60">
            Dashboard
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-rv-plum">
            {title}
          </h2>
        </div>

        {actionText && actionTo ? (
          <Link
            to={actionTo}
            className="text-sm font-medium text-rv-plum transition hover:text-rv-plum/80"
          >
            {actionText}
          </Link>
        ) : null}
      </div>

      {children}
    </section>
  );
}