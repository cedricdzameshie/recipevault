import DashboardSection from "./DashboardSection";
import DashboardFeatureCard from "./DashboardFeatureCard";

export default function DashboardDiscover() {
  return (
    <DashboardSection title="Discover & Connect">
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardFeatureCard
  title="What’s in the Fridge?"
  description="Enter what you have and get recipe ideas."
  icon="🥕"
  variant="teal"
/>

<DashboardFeatureCard
  title="Community Activity"
  description="See photos, comments, and recipe variations."
  icon="📸"
  variant="plum"
/>

<DashboardFeatureCard
  title="Help Shape RecipeVault"
  description="Share feedback, bugs, and feature ideas."
  icon="💬"
  variant="warm"
/>
      </div>
    </DashboardSection>
  );
}