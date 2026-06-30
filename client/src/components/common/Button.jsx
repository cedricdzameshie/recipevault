const variantClasses = {
  primary:
    "bg-rv-plum text-white hover:bg-rv-plum/90 focus-visible:ring-rv-plum",

  secondary:
    "border border-stone-200 bg-white text-rv-plum hover:bg-stone-50 focus-visible:ring-rv-plum",

  accent:
    "bg-rv-teal text-rv-plum hover:bg-rv-teal/90 focus-visible:ring-rv-teal",

  danger:
    "bg-rv-coral text-white hover:bg-rv-coral/90 focus-visible:ring-rv-coral",

  ghost:
    "bg-transparent text-rv-plum hover:bg-rv-plum/5 focus-visible:ring-rv-plum",
};

const sizeClasses = {
  sm: "min-h-9 rounded-lg px-3 py-2 text-sm",
  md: "min-h-11 rounded-xl px-4 py-2.5 text-sm",
  lg: "min-h-12 rounded-xl px-6 py-3 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  isLoading = false,
  fullWidth = false,
  className = "",
  ...props
}) {
  const isDisabled = disabled || isLoading;

  const classes = [
    "inline-flex items-center justify-center gap-2",
    "font-semibold transition-colors duration-200",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || sizeClasses.md,
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading}
      className={classes}
      {...props}
    >
      {isLoading ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : null}

      <span>{children}</span>
    </button>
  );
}