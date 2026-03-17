export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl border border-stone-300/70 bg-white/95 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition hover:shadow-[0_10px_28px_rgba(0,0,0,0.06)] ${className}`}
    >
      {children}
    </div>
  );
}