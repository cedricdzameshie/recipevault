import Button from "./Button";

export default function PageHeader({
  title,
  description,
  action,
}) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-stone-600">
            {description}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}