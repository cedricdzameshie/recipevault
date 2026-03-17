import Topbar from "./Topbar";
import BottomNav from "./BottomNav";

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-rv-cream text-stone-900">
      <Topbar />

      <main className="mx-auto max-w-6xl px-4 py-6 pb-24">
        <div className="space-y-6">{children}</div>
      </main>

      <BottomNav />
    </div>
  );
}