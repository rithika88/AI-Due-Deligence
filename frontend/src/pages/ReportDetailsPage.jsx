import { useEffect, useState } from "react";
import { ArrowLeft, BarChart3, Lightbulb, ShieldAlert } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { AppShell } from "@/components/layout/AppShell";
import { RiskBadge } from "@/components/ui/risk-badge";
import { SectionCard } from "@/components/ui/section-card";
import { Button } from "@/components/ui/button";

function ReportDetailsPage() {
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5001/api/reports/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }

        const data = await response.json();
        setReport(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load report");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  if (loading) {
    return (
      <AppShell
        title="Report"
        description="Loading due diligence report..."
      >
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading report...
          </p>
        </div>
      </AppShell>
    );
  }

  if (error || !report) {
    return (
      <AppShell
        title="Report"
        description="Unable to load report."
      >
        <div className="space-y-4">
          <Link
            to="/reports"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Reports
          </Link>

          <SectionCard title="Report not found">
            <div className="p-5">
              <p className="text-sm text-muted-foreground">
                {error || "The requested report could not be found."}
              </p>
            </div>
          </SectionCard>
        </div>
      </AppShell>
    );
  }

  const companyName =
    typeof report.companyId === "object"
      ? report.companyId?.name
      : "—";

  const generatedDate = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <AppShell
      title={report.title || "Due Diligence Report"}
      description={`${companyName} · Due diligence report`}
    >
      <div className="space-y-6">
        {/* Back */}
        <Link
          to="/reports"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Reports
        </Link>

        {/* Report Overview */}
        <SectionCard
          title="Report Overview"
          description="Summary of the completed due diligence analysis."
        >
          <div className="grid gap-6 p-5 md:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Company
              </p>

              <p className="mt-1 text-lg font-semibold text-foreground">
                {companyName}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Generated
              </p>

              <p className="mt-1 text-lg font-semibold text-foreground">
                {generatedDate}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Overall Risk
              </p>

              <div className="mt-2">
                <RiskBadge level={report.overallRisk?.toLowerCase()} />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Summary */}
        <SectionCard
          title="Executive Summary"
          description="Overall summary of the due diligence analysis."
        >
          <div className="p-5">
            <p className="text-sm leading-6 text-muted-foreground">
              {report.summary || "No summary available."}
            </p>
          </div>
        </SectionCard>

        {/* Financial Metrics */}
        <SectionCard
          title="Financial Metrics"
          description="Financial information extracted from analyzed documents."
        >
          {report.financialMetrics?.length > 0 ? (
            <div className="grid gap-4 p-5 md:grid-cols-3">
              {report.financialMetrics.map((metric) => (
                <div
                  key={metric._id || metric.name}
                  className="rounded-lg border border-border bg-muted/30 p-4"
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="size-4 text-muted-foreground" />

                    <p className="text-sm font-medium text-foreground">
                      {metric.name}
                    </p>
                  </div>

                  <p className="mt-3 text-xl font-semibold text-foreground">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 text-sm text-muted-foreground">
              No financial metrics available.
            </div>
          )}
        </SectionCard>

        {/* Risks */}
        <SectionCard
          title="Risk Findings"
          description="Risks identified during document analysis."
        >
          {report.risks?.length > 0 ? (
            <div className="space-y-4 p-5">
              {report.risks.map((risk) => (
                <div
                  key={risk._id || risk.title}
                  className="rounded-lg border border-border p-4"
                >
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

                    <div>
                      <p className="font-medium text-foreground">
                        {risk.title}
                      </p>

                      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {risk.category}
                      </p>

                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {risk.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 text-sm text-muted-foreground">
              No risks identified.
            </div>
          )}
        </SectionCard>

        {/* AI Insights */}
        <SectionCard
          title="AI Insights"
          description="AI-generated observations from analyzed documents."
        >
          {report.insights?.length > 0 ? (
            <div className="space-y-3 p-5">
              {report.insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg border border-border p-4"
                >
                  <Lightbulb className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

                  <p className="text-sm leading-6 text-muted-foreground">
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 text-sm text-muted-foreground">
              No AI insights available.
            </div>
          )}
        </SectionCard>

        {/* Recommendations */}
        <SectionCard
          title="Recommendations"
          description="Recommended next steps based on the analysis."
        >
          {report.recommendations?.length > 0 ? (
            <div className="space-y-3 p-5">
              {report.recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {index + 1}
                  </span>

                  <p className="text-sm leading-6 text-muted-foreground">
                    {recommendation}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 text-sm text-muted-foreground">
              No recommendations available.
            </div>
          )}
        </SectionCard>

        {/* Bottom Back Button */}
        <div>
          <Button variant="outline" asChild>
            <Link to="/reports">
              <ArrowLeft className="size-4" />
              Back to Reports
            </Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

export default ReportDetailsPage;