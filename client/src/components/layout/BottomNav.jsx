import { Link } from "react-router-dom";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-stone-200 bg-white md:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-around py-3 text-sm">
        <Link to="/dashboard">Home</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/folders">Folders</Link>
      </div>
    </nav>
  );
}