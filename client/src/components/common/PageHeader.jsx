import { Link } from "react-router-dom";

export default function PageHeader({
  title,
  description,
  action,
  backTo,
  backLabel = "Back",
}) {
  return (
    <header className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          {backTo ? (
            <Link
              to={backTo}
              className="inline-flex items-center text-sm font-medium text-stone-600 transition hover:text-stone-900"
            >
              ← {backLabel}
            </Link>
          ) : null}

          <div>
            <h1 className="text-3xl font-semibold text-stone-900">{title}</h1>

            {description ? (
              <p className="mt-2 text-sm text-stone-600">{description}</p>
            ) : null}
          </div>
        </div>

        {action ? <div>{action}</div> : null}
      </div>
    </header>
  );
}