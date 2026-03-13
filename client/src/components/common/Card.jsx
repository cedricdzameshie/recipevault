export default function Card({ children }) {
  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      {children}
    </div>
  );
}