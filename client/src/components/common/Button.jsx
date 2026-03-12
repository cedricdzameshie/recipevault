export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition";

  const styles = {
    primary: disabled
      ? "cursor-not-allowed bg-stone-300 text-white"
      : "bg-stone-900 text-white hover:bg-stone-700",
    secondary: disabled
      ? "cursor-not-allowed border border-stone-200 bg-stone-100 text-stone-400"
      : "border border-stone-200 bg-white text-stone-900 hover:bg-stone-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]}`}
    >
      {children}
    </button>
  );
}