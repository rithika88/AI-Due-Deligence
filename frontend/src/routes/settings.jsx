import { Bell, Building2, Palette, UserRound } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/ui/section-card";


function SettingsPage() {
  const sections = [
    [UserRound, "Profile", "Profile settings will be available when authentication is connected."],
    [Building2, "Workspace", "Workspace configuration will be connected to your account and backend later."],
    [Bell, "Notifications", "Notification preferences will be available once notifications are implemented."],
    [Palette, "Appearance", "Appearance controls can be connected to the application settings layer later."],
  ];

  return (
    <AppShell title="Settings" description="Manage your workspace preferences.">
      <div className="grid gap-6 lg:grid-cols-2">
        {sections.map(([Icon, title, description]) => (
          <SectionCard key={title} title={title}>
            <div className="flex items-start gap-4 p-5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                <Icon className="size-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </AppShell>
  );
}

export default SettingsPage;
