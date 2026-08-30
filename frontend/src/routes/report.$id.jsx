import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  Lightbulb,
  ShieldAlert,
} from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/ui/section-card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { EmptyState } from "@/components/ui/empty-state";

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
          throw new Error("Report not found");
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
            <EmptyState
              icon={ShieldAlert}
              title="Unable to load report"
              description={
                error || "The requested report could not be found."
              }
              size="sm"
            />
          </SectionCard>
        </div>
      </AppShell>
    );
  }

  const companyName =
    typeof report.companyId === "object"
      ? report.companyId?.name
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

        {/* Report Summary */}
        <SectionCard
          title="Report Summary"
          description="Overview of the completed due diligence analysis."
        >
          <div className="grid gap-6 p-5 md:grid-cols-2">
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
                Overall Risk
              </p>

              <div className="mt-2">
                <RiskBadge risk={report.overallRisk} />
              </div>
            </div>

            <div className="md:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Summary
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {report.summary || "No summary available."}
              </p>
            </div>
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
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {metric.name}
                  </p>

                  <p className="mt-2 text-xl font-semibold text-foreground">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={BarChart3}
              title="No financial metrics"
              description="No financial metrics were found in this report."
              size="sm"
            />
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
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-foreground">
                        {risk.title}
                      </h3>

                      <span className="mt-1 inline-flex rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {risk.category}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {risk.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={ShieldAlert}
              title="No risks identified"
              description="No risk findings were included in this report."
              size="sm"
            />
          )}
        </SectionCard>

        {/* AI Insights */}
        <SectionCard
          title="AI Insights"
          description="Observations generated from the analyzed documents."
        >
          {report.insights?.length > 0 ? (
            <div className="space-y-3 p-5">
              {report.insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg border border-border p-4"
                >
                  <Lightbulb className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

                  <p className="text-sm leading-6 text-foreground">
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Lightbulb}
              title="No AI insights"
              description="No AI insights were included in this report."
              size="sm"
            />
          )}
        </SectionCard>

        {/* Recommendations */}
        <SectionCard
          title="Recommendations"
          description="Recommended next steps based on the analysis."
        >
          {report.recommendations?.length > 0 ? (
            <div className="space-y-3 p-5">
              {report.recommendations.map(
                (recommendation, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 border-b border-border py-3 last:border-0"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {index + 1}
                    </span>

                    <p className="text-sm leading-6 text-foreground">
                      {recommendation}
                    </p>
                  </div>
                )
              )}
            </div>
          ) : (
            <EmptyState
              icon={Lightbulb}
              title="No recommendations"
              description="No recommendations were included in this report."
              size="sm"
            />
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}

export default ReportDetailsPage;