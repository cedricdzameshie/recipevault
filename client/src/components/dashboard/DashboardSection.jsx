export default function DashboardSection({
  title,
  actionText,
  onAction,
  children,
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-stone-900">{title}</h2>

        {actionText ? (
          <button
            type="button"
            onClick={onAction}
            className="text-sm font-medium text-green-700 transition hover:text-green-800"
          >
            {actionText}
          </button>
        ) : null}
      </div>

      {children}
    </section>
  );
}