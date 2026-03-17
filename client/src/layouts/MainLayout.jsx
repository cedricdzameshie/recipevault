import { Outlet } from "react-router-dom";
import AppShell from "../components/layout/AppShell";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-rv-cream">
      <div className="min-h-screen bg-[linear-gradient(to_bottom,rgba(255,255,255,0.15),rgba(54,6,77,0.02))]">
        <AppShell>
          <Outlet />
        </AppShell>
      </div>
    </div>
  );
}