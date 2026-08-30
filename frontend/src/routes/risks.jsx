import { BarChart3, BriefcaseBusiness, Building2, Gavel, Settings2, ShieldAlert } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { RiskCategoryCard } from "@/components/dashboard/RiskCategoryCard";
import { RiskDistribution } from "@/components/dashboard/RiskDistribution";
import { EmptyState } from "@/components/ui/empty-state";
import { RiskBadge } from "@/components/ui/risk-badge";
import { SectionCard } from "@/components/ui/section-card";


function RisksPage() {
  const categories = [
    ["Financial Risk", BarChart3],
    ["Legal Risk", Gavel],
    ["Commercial Risk", BriefcaseBusiness],
    ["Operational Risk", Settings2],
    ["Technology Risk", Building2],
  ];

  return (
    <AppShell title="Risk Analysis" description="Review identified risks across analyzed companies and documents.">
      <div className="space-y-6">
        <SectionCard title="Overall Risk" description="Workspace-level risk distribution from completed analysis.">
          <div className="grid gap-4 p-5 sm:grid-cols-3">
            {[
              ["High Risk", "high"],
              ["Medium Risk", "medium"],
              ["Low Risk", "low"],
            ].map(([label, level]) => (
              <div key={level} className="surface-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-muted-foreground">{label}</p>
                  <RiskBadge level={level} />
                </div>
                <p className="mt-4 text-sm font-medium text-muted-foreground">No data yet</p>
                <p className="mt-1 text-xs text-muted-foreground">Updates after risk analysis is completed.</p>
              </div>
            ))}
          </div>
          <RiskDistribution />
        </SectionCard>

        <SectionCard title="Risk Categories" description="Five core risk categories used by the due diligence workflow.">
          <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            {categories.map(([title, icon]) => (
              <RiskCategoryCard key={title} title={title} icon={icon} />
            ))}
          </div>
        </SectionCard>

        <EmptyState
          icon={ShieldAlert}
          title="No risk analysis available"
          description="Risk findings will appear here after company information and documents have been analyzed."
          size="md"
        />
      </div>
    </AppShell>
  );
}

export default RisksPage;
