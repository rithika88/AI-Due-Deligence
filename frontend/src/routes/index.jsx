import { useEffect, useState } from "react";
import {
  Building2,
  ClipboardList,
  FileText,
  Plus,
  ShieldAlert,
  Upload,
} from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { CompanyTable } from "@/components/dashboard/CompanyTable";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { RiskDistribution } from "@/components/dashboard/RiskDistribution";
import { StatCard } from "@/components/dashboard/StatCard";
import { WorkflowSteps } from "@/components/dashboard/WorkflowSteps";

import {
  AddCompanyModal,
  GenerateReportModal,
  UploadDocumentsModal,
} from "@/components/dashboard/modals";

import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";

function OverviewPage() {
  const [addCompanyOpen, setAddCompanyOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const [companies, setCompanies] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [companiesResponse, documentsResponse] =
          await Promise.all([
            fetch("http://localhost:5001/api/companies"),
            fetch("http://localhost:5001/api/documents"),
          ]);

        if (!companiesResponse.ok) {
          throw new Error("Failed to fetch companies");
        }

        if (!documentsResponse.ok) {
          throw new Error("Failed to fetch documents");
        }

        const companiesData = await companiesResponse.json();
        const documentsData = await documentsResponse.json();

        setDocuments(documentsData);

        // ------------------------------------------
        // Build company data for CompanyTable
        // ------------------------------------------

        const formattedCompanies = companiesData.map((company) => {
          const companyDocuments = documentsData.filter(
            (document) =>
              document.companyId?._id === company._id ||
              document.companyId === company._id
          );

          const analyzedDocuments = companyDocuments.filter(
            (document) => document.status === "Analyzed"
          );

          let riskLevel = undefined;

          for (const document of analyzedDocuments) {
            const risk = document.analysis?.overallRisk;

            if (risk === "High") {
              riskLevel = "high";
              break;
            }

            if (risk === "Medium") {
              riskLevel = "medium";
            }

            if (risk === "Low" && !riskLevel) {
              riskLevel = "low";
            }
          }

          return {
            id: company._id,
            name: company.name,
            industry: company.industry,
            documentCount: companyDocuments.length,
            riskLevel,
            updatedAt: company.updatedAt
              ? new Date(company.updatedAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )
              : "—",
          };
        });

        setCompanies(formattedCompanies);

        // ------------------------------------------
        // Fetch reports for dashboard
        // ------------------------------------------

        const reportResponses = await Promise.all(
          companiesData.map((company) =>
            fetch(
              `http://localhost:5001/api/reports/company/${company._id}`
            )
          )
        );

        const reportData = [];

        for (const response of reportResponses) {
          if (response.ok) {
            const data = await response.json();
            reportData.push(...data);
          }
        }

        setReports(reportData);
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ------------------------------------------
  // Dashboard statistics
  // ------------------------------------------

  const companiesAnalyzed = companies.filter(
    (company) => company.riskLevel
  ).length;

  const documentsReviewed = documents.filter(
    (document) => document.status === "Analyzed"
  ).length;

  const risksIdentified = documents.reduce((total, document) => {
    return total + (document.analysis?.risks?.length || 0);
  }, 0);

  const reportsGenerated = reports.length;

  // ------------------------------------------
  // Risk distribution
  // ------------------------------------------

  const riskSummary = {
    high: companies.filter(
      (company) => company.riskLevel === "high"
    ).length,

    medium: companies.filter(
      (company) => company.riskLevel === "medium"
    ).length,

    low: companies.filter(
      (company) => company.riskLevel === "low"
    ).length,
  };

  // ------------------------------------------
  // Recent activity
  // ------------------------------------------

  const activities = documents.slice(0, 5).map((document) => ({
    id: document._id,
    title: document.name,
    description:
      document.status === "Analyzed"
        ? "Document analyzed"
        : "Document uploaded",
    timestamp: document.createdAt
      ? new Date(document.createdAt).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )
      : "—",
  }));

  return (
    <AppShell
      title="Overview"
      description="Your due diligence workspace at a glance."
    >
      <div className="space-y-6">

        {/* -------------------------------- */}
        {/* Statistics */}
        {/* -------------------------------- */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            label="Companies Analyzed"
            value={loading ? undefined : companiesAnalyzed}
            icon={Building2}
            helpText="Companies with analyzed documents."
          />

          <StatCard
            label="Documents Reviewed"
            value={loading ? undefined : documentsReviewed}
            icon={FileText}
            helpText="Documents successfully analyzed."
          />

          <StatCard
            label="Risks Identified"
            value={loading ? undefined : risksIdentified}
            icon={ShieldAlert}
            helpText="Risk findings across analyzed documents."
          />

          <StatCard
            label="Reports Generated"
            value={loading ? undefined : reportsGenerated}
            icon={ClipboardList}
            helpText="Completed due diligence reports."
          />

        </div>

        {/* -------------------------------- */}
        {/* Quick Actions */}
        {/* -------------------------------- */}

        <SectionCard
          title="Quick Actions"
          description="Move through the due diligence workflow."
          bodyClassName="grid gap-4 p-5 sm:p-6 md:grid-cols-3"
        >
          <QuickActionCard
            title="Add Company"
            description="Start a new due diligence workspace."
            icon={Plus}
            onClick={() => setAddCompanyOpen(true)}
          />

          <QuickActionCard
            title="Upload Documents"
            description="Upload financial, legal, commercial, or technical documents."
            icon={Upload}
            onClick={() => setUploadOpen(true)}
          />

          <QuickActionCard
            title="Generate Report"
            description="Create a due diligence report from your analysis."
            icon={ClipboardList}
            onClick={() => setReportOpen(true)}
          />
        </SectionCard>

        {/* -------------------------------- */}
        {/* Workflow */}
        {/* -------------------------------- */}

        <SectionCard
          title="How DueLens works"
          description="From company intake to a finished due diligence report."
        >
          <WorkflowSteps />
        </SectionCard>

        {/* -------------------------------- */}
        {/* Recent Companies */}
        {/* -------------------------------- */}

        <SectionCard
          title="Recent Companies"
          description="Companies in your workspace."
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAddCompanyOpen(true)}
            >
              <Plus className="size-4" />
              Add Company
            </Button>
          }
        >
          <CompanyTable
            companies={companies}
            onAddCompany={() => setAddCompanyOpen(true)}
          />
        </SectionCard>

        {/* -------------------------------- */}
        {/* Risk + Activity */}
        {/* -------------------------------- */}

        <div className="grid gap-6 lg:grid-cols-2">

          <SectionCard
            title="Risk Overview"
            description="Distribution across high, medium and low risk."
          >
            <RiskDistribution summary={riskSummary} />
          </SectionCard>

          <SectionCard
            title="Recent Activity"
            description="Latest changes in this workspace."
          >
            <ActivityList activities={activities} />
          </SectionCard>

        </div>
      </div>

      {/* -------------------------------- */}
      {/* Modals */}
      {/* -------------------------------- */}

      <AddCompanyModal
        open={addCompanyOpen}
        onOpenChange={setAddCompanyOpen}
      />

      <UploadDocumentsModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
      />

      <GenerateReportModal
        open={reportOpen}
        onOpenChange={setReportOpen}
      />
    </AppShell>
  );
}

export default OverviewPage;