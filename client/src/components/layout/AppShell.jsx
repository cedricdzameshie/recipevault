import { useLocation } from "react-router-dom";
import Topbar from "./Topbar";
import BottomNav from "./BottomNav";

export default function AppShell({ children }) {
  const location = useLocation();

  const isCookingRoute =
    /^\/recipes\/[^/]+\/cook\/?$/.test(location.pathname);

  const isFocusMode =
    isCookingRoute &&
    new URLSearchParams(location.search).get("focus") === "1";

  return (
    <div className="min-h-screen bg-rv-cream text-stone-900">
      <div className={isFocusMode ? "hidden md:block" : ""}>
        <Topbar />
      </div>

      <main
        className={`mx-auto max-w-6xl px-4 ${
          isFocusMode
            ? "py-4 pb-8 md:py-6 md:pb-24"
            : "py-6 pb-24"
        }`}
      >
        <div className="space-y-6">{children}</div>
      </main>

      {!isFocusMode && <BottomNav />}
    </div>
  );
}