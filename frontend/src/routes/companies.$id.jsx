import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  FileText,
  Lightbulb,
  ShieldAlert,
  Plus,
  ClipboardList,
  Loader2,
} from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";
import { RiskBadge } from "@/components/ui/risk-badge";

function CompanyDetailsPage() {
  const { id } = useParams();

  const [company, setCompany] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // Load company
  // ==========================================

  const loadCompany = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/companies/${id}`
      );

      if (!response.ok) {
        throw new Error("Failed to load company");
      }

      const data = await response.json();
      setCompany(data);
    } catch (err) {
      console.error("Company loading error:", err);
      setError("Failed to load company information.");
    }
  };

  // ==========================================
  // Load documents
  // ==========================================

  const loadDocuments = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/documents/company/${id}`
      );

      if (!response.ok) {
        throw new Error("Failed to load documents");
      }

      const data = await response.json();

      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Documents loading error:", err);
      setDocuments([]);
    }
  };

  // ==========================================
  // Load reports
  // ==========================================

  const loadReports = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/reports/company/${id}`
      );

      if (!response.ok) {
        throw new Error("Failed to load reports");
      }

      const data = await response.json();

      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Reports loading error:", err);
      setReports([]);
    }
  };

  // ==========================================
  // Load all data
  // ==========================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        loadCompany(),
        loadDocuments(),
        loadReports(),
      ]);

      setLoading(false);
    };

    if (id) {
      loadData();
    }
  }, [id]);

  // ==========================================
  // Generate report
  // ==========================================

  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
      setError("");

      const response = await fetch(
        `http://localhost:5001/api/reports/generate/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate report"
        );
      }

      console.log("Report generated:", data);

      // Reload reports and company information
      await Promise.all([
        loadReports(),
        loadCompany(),
      ]);
    } catch (err) {
      console.error("Report generation error:", err);

      setError(
        err.message || "Failed to generate due diligence report."
      );
    } finally {
      setGenerating(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <AppShell
        title="Company"
        description="Loading company information..."
      >
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (!company) {
    return (
      <AppShell
        title="Company"
        description="Company details"
      >
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-destructive">
            {error || "Company not found."}
          </p>
        </div>
      </AppShell>
    );
  }

  // ==========================================
  // Derived values
  // ==========================================

  const analyzedDocuments = documents.filter(
    (document) => document.status === "Analyzed"
  );

  const latestReport = reports.length > 0 ? reports[0] : null;

  const hasReport = reports.length > 0;

  const overallRisk =
    latestReport?.overallRisk ||
    company.riskLevel ||
    null;

  // ==========================================
  // Render
  // ==========================================

  return (
    <AppShell
      title={company.name}
      description={`${company.industry || "Company"} · Due diligence workspace`}
      headerActions={
        <Button
          onClick={handleGenerateReport}
          disabled={
            generating || analyzedDocuments.length === 0
          }
        >
          {generating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <ClipboardList className="size-4" />
              Generate Report
            </>
          )}
        </Button>
      }
    >
      <div className="space-y-6">

        {/* ==========================================
            Error message
        ========================================== */}

        {error && (
          <div className="rounded-lg border border-risk-high/20 bg-risk-high-surface p-4">
            <p className="text-sm text-risk-high">
              {error}
            </p>
          </div>
        )}

        {/* ==========================================
            Company Overview
        ========================================== */}

        <SectionCard
          title="Company Overview"
          description="Core company information."
        >
          <div className="grid gap-6 p-5 sm:grid-cols-3 sm:p-6">

            <div>
              <p className="text-sm text-muted-foreground">
                Company
              </p>

              <div className="mt-2 flex items-center gap-2">
                <Building2 className="size-4 text-muted-foreground" />

                <p className="font-medium">
                  {company.name}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Industry
              </p>

              <p className="mt-2 font-medium">
                {company.industry || "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Description
              </p>

              <p className="mt-2 font-medium">
                {company.description || "—"}
              </p>
            </div>

          </div>
        </SectionCard>

        {/* ==========================================
            Key Metrics
        ========================================== */}

        {latestReport?.financialMetrics?.length > 0 && (
          <SectionCard
            title="Key Metrics"
            description="Financial and operating metrics from analyzed company information."
          >
            <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">

              {latestReport.financialMetrics.map(
                (metric) => (
                  <div
                    key={metric._id || metric.name}
                    className="rounded-lg border border-border bg-card p-5"
                  >
                    <p className="text-sm text-muted-foreground">
                      {metric.name}
                    </p>

                    <p className="mt-3 text-2xl font-semibold tracking-tight">
                      {metric.value}
                    </p>
                  </div>
                )
              )}

            </div>
          </SectionCard>
        )}

        {/* ==========================================
            Documents
        ========================================== */}

        <SectionCard
          title="Documents"
          description="Documents associated with this company."
          action={
            <Button
              size="sm"
              variant="outline"
            >
              <Plus className="size-4" />
              Upload
            </Button>
          }
        >
          {documents.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">
              No documents uploaded yet.
            </div>
          ) : (
            <div className="divide-y divide-border">

              {documents.map((document) => (
                <div
                  key={document._id}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="size-5 text-muted-foreground" />

                    <div>
                      <p className="font-medium">
                        {document.name ||
                          document.fileName ||
                          "Document"}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {document.type || "Document"}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-md border border-border bg-muted px-2 py-1 text-xs">
                    {document.status || "Pending"}
                  </span>
                </div>
              ))}

            </div>
          )}
        </SectionCard>

        {/* ==========================================
            Risk Analysis
        ========================================== */}

        <SectionCard
          title="Risk Analysis"
          description="Risk findings identified from analyzed information."
        >

          <div className="p-5 sm:p-6">

            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-5">

              <div className="flex items-center gap-3">
                <ShieldAlert className="size-5 text-muted-foreground" />

                <div>
                  <p className="font-medium">
                    Overall risk
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Based on analyzed company documents.
                  </p>
                </div>
              </div>

              {overallRisk ? (
                <RiskBadge level={overallRisk} />
              ) : (
                <span className="rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground">
                  Not assessed
                </span>
              )}

            </div>

            {latestReport?.risks?.length > 0 && (
              <div className="mt-4 space-y-4">

                {latestReport.risks.map((risk) => (
                  <div
                    key={risk._id || risk.title}
                    className="rounded-lg border border-border p-5"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="size-4 text-muted-foreground" />

                      <p className="font-medium">
                        {risk.title}
                      </p>

                      <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {risk.category}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {risk.description}
                    </p>
                  </div>
                ))}

              </div>
            )}

          </div>
        </SectionCard>

        {/* ==========================================
            AI Insights
        ========================================== */}

        {latestReport?.insights?.length > 0 && (
          <SectionCard
            title="AI Insights"
            description="AI-generated observations from analyzed company information."
          >
            <div className="space-y-3 p-5 sm:p-6">

              {latestReport.insights.map(
                (insight, index) => (
                  <div
                    key={index}
                    className="flex gap-3 rounded-lg border border-border p-5"
                  >
                    <Lightbulb className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

                    <p className="text-sm leading-6">
                      {insight}
                    </p>
                  </div>
                )
              )}

            </div>
          </SectionCard>
        )}

        {/* ==========================================
            Due Diligence Status
        ========================================== */}

        <SectionCard
          title="Due Diligence Status"
          description="Track progress through the analysis workflow."
        >
          <div className="divide-y divide-border">

            {/* Company Profile */}

            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <Building2 className="size-5 text-muted-foreground" />

                <span className="text-sm font-medium">
                  Company profile
                </span>
              </div>

              <span className="text-sm text-risk-low">
                Completed
              </span>
            </div>

            {/* Document Review */}

            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-muted-foreground" />

                <span className="text-sm font-medium">
                  Document review
                </span>
              </div>

              <span className="text-sm text-muted-foreground">
                {documents.length}{" "}
                {documents.length === 1
                  ? "document"
                  : "documents"}
              </span>
            </div>

            {/* Risk Analysis */}

            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <ShieldAlert className="size-5 text-muted-foreground" />

                <span className="text-sm font-medium">
                  Risk analysis
                </span>
              </div>

              {analyzedDocuments.length > 0 ? (
                <span className="text-sm text-risk-low">
                  Completed
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Not started
                </span>
              )}
            </div>

            {/* Report */}

            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                {hasReport ? (
                  <CheckCircle2 className="size-5 text-risk-low" />
                ) : (
                  <ClipboardList className="size-5 text-muted-foreground" />
                )}

                <span className="text-sm font-medium">
                  Report
                </span>
              </div>

              {generating ? (
                <span className="flex items-center gap-2 text-sm text-risk-medium">
                  <Loader2 className="size-4 animate-spin" />
                  Generating
                </span>
              ) : hasReport ? (
                <span className="text-sm text-risk-low">
                  Completed
                </span>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGenerateReport}
                  disabled={
                    analyzedDocuments.length === 0
                  }
                >
                  <ClipboardList className="size-4" />
                  Generate Report
                </Button>
              )}

            </div>

          </div>
        </SectionCard>

      </div>
    </AppShell>
  );
}

export default CompanyDetailsPage;