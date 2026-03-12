export default function Card({ children }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      {children}
    </div>
  );
}