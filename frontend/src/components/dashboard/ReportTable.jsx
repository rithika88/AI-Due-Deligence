import { ClipboardList, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DataCell,
  DataTable,
  DataTableEmptyRow,
} from "@/components/ui/data-table";

import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

const COLUMNS = [
  { key: "company", label: "Company" },
  { key: "type", label: "Report Type" },
  { key: "generated", label: "Generated Date" },
  { key: "score", label: "Risk Score" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", className: "text-right" },
];

const STATUS_STYLES = {
  ready:
    "border-risk-low/20 bg-risk-low-surface text-risk-low",

  failed:
    "border-risk-high/20 bg-risk-high-surface text-risk-high",
};

export function ReportTable({
  reports = [],
  onGenerateReport,
}) {
  return (
    <DataTable columns={COLUMNS}>
      {reports.length === 0 ? (
        <DataTableEmptyRow colSpan={COLUMNS.length}>
          <EmptyState
            icon={ClipboardList}
            title="No reports generated"
            description="Complete your due diligence analysis to generate a report."
            action={
              <Button
                size="sm"
                onClick={onGenerateReport}
              >
                <Plus className="size-4" />
                Generate Report
              </Button>
            }
          />
        </DataTableEmptyRow>
      ) : (
        reports.map((report) => {
          const companyName =
            typeof report.companyId === "object"
              ? report.companyId?.name
              : "—";

          const generatedDate = report.createdAt
            ? new Date(report.createdAt).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )
            : "—";

          const status = "ready";

          return (
            <tr
              key={report._id}
              className="transition-colors hover:bg-muted/50"
            >
              {/* Company */}
              <DataCell className="font-medium">
                {companyName || "—"}
              </DataCell>

              {/* Report Type */}
              <DataCell className="text-muted-foreground">
                Due Diligence
              </DataCell>

              {/* Generated */}
              <DataCell className="text-muted-foreground">
                {generatedDate}
              </DataCell>

              {/* Risk Score */}
              <DataCell className="font-medium">
                {report.overallRisk || "—"}
              </DataCell>

              {/* Status */}
              <DataCell>
                <span
                  className={cn(
                    "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
                    STATUS_STYLES[status]
                  )}
                >
                  Ready
                </span>
              </DataCell>

              {/* Action */}
              <DataCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link to={`/reports/${report._id}`}>
                    View
                  </Link>
                </Button>
              </DataCell>
            </tr>
          );
        })
      )}
    </DataTable>
  );
}