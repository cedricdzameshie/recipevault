export default function DashboardSection({
  title,
  children,
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/60">
          Dashboard
        </p>

        <h2 className="text-2xl font-semibold tracking-tight text-rv-plum">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}