import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Home" },
  { to: "/recipes", label: "Recipes" },
  { to: "/favorites", label: "Favorites" },
  { to: "/folders", label: "Folders" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-stone-300/70 bg-white/95 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-4 gap-2 px-3 py-3 text-sm">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-2xl px-3 py-2 text-center font-medium transition ${
                isActive
                  ? "bg-rv-plum text-white"
                  : "text-rv-plum hover:bg-rv-teal/15"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}