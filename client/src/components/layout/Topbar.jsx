import { Link } from "react-router-dom";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-300/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          to="/dashboard"
          aria-label="Go to RecipeVault dashboard"
          className={[
            "group flex items-center gap-3 rounded-xl",
            "focus:outline-none focus-visible:ring-2",
            "focus-visible:ring-rv-plum focus-visible:ring-offset-2",
          ].join(" ")}
        >
          <span
            aria-hidden="true"
            className="h-3 w-3 rounded-full bg-rv-plum transition group-hover:scale-110"
          />

          <span>
            <span className="block text-xl font-bold tracking-tight text-rv-plum">
              RecipeVault
            </span>

            <span className="hidden text-xs uppercase tracking-[0.16em] text-stone-500 sm:block">
              Baking workflow
            </span>
          </span>
        </Link>
      </div>
    </header>
  );
}