import { useEffect, useState } from "react";
import { ClipboardList, Plus } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { GenerateReportModal } from "@/components/dashboard/modals";
import { ReportTable } from "@/components/dashboard/ReportTable";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";

function ReportsPage() {
  const [open, setOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);

      // Fetch all companies first
      const companiesResponse = await fetch(
        "http://localhost:5001/api/companies"
      );

      if (!companiesResponse.ok) {
        throw new Error("Failed to fetch companies");
      }

      const companies = await companiesResponse.json();

      // Fetch reports for every company
      const allReports = [];

      for (const company of companies) {
        const response = await fetch(
          `http://localhost:5001/api/reports/company/${company._id}`
        );

        if (response.ok) {
          const companyReports = await response.json();
          allReports.push(...companyReports);
        }
      }

      setReports(allReports);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleReportGenerated = () => {
    setOpen(false);
    fetchReports();
  };

  return (
    <AppShell
      title="Reports"
      description="Review generated due diligence reports."
      headerActions={
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Generate Report
        </Button>
      }
    >
      <SectionCard
        title="Reports"
        description="Completed and in-progress due diligence reports."
      >
        {loading ? (
          <div className="p-5 text-sm text-muted-foreground">
            Loading reports...
          </div>
        ) : (
          <ReportTable
            reports={reports}
            onGenerateReport={() => setOpen(true)}
          />
        )}
      </SectionCard>

      <div className="mt-6 flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-4">
        <ClipboardList className="mt-0.5 size-5 text-muted-foreground" />

        <p className="text-sm text-muted-foreground">
          Generated reports are loaded from the backend.
        </p>
      </div>

      <GenerateReportModal
        open={open}
        onOpenChange={setOpen}
        onGenerated={handleReportGenerated}
      />
    </AppShell>
  );
}

export default ReportsPage;