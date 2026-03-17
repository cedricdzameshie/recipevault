export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";

  const styles = {
    primary: disabled
      ? "cursor-not-allowed bg-rv-plum/40 text-white"
      : "bg-rv-plum text-white hover:bg-rv-plum/90 focus:ring-rv-plum",
    secondary: disabled
      ? "cursor-not-allowed border border-stone-200 bg-stone-100 text-stone-400"
      : "border border-stone-200 bg-white text-rv-plum hover:bg-stone-50 focus:ring-rv-plum",
    accent: disabled
      ? "cursor-not-allowed bg-rv-teal/40 text-rv-plum"
      : "bg-rv-teal text-rv-plum hover:bg-rv-teal/90 focus:ring-rv-teal",
    danger: disabled
      ? "cursor-not-allowed bg-rv-coral/40 text-white"
      : "bg-rv-coral text-white hover:bg-rv-coral/90 focus:ring-rv-coral",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant] || styles.primary}`}
    >
      {children}
    </button>
  );
}