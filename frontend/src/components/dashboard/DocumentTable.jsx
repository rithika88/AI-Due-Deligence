import { FileText, Upload } from "lucide-react";
// import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DataCell,
  DataTable,
  DataTableEmptyRow,
} from "@/components/ui/data-table";

import { EmptyState } from "@/components/ui/empty-state";

import { cn } from "@/lib/utils";

const COLUMNS = [
  { key: "document", label: "Document" },
  { key: "type", label: "Type" },
  { key: "company", label: "Company" },
  { key: "uploaded", label: "Uploaded" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action", className: "text-right" },
];

export const DOCUMENT_TYPE_LABELS = {
  Financial: "Financial",
  Legal: "Legal",
  Commercial: "Commercial",
  Technical: "Technical",
  Other: "Other",
};

const STATUS_LABELS = {
  Uploaded: "Uploaded",
  Processing: "Processing",
  Analyzed: "Analyzed",
  Failed: "Failed",
};

const STATUS_STYLES = {
  Uploaded:
    "border-border bg-muted text-muted-foreground",

  Processing:
    "border-risk-medium/20 bg-risk-medium-surface text-risk-medium",

  Analyzed:
    "border-risk-low/20 bg-risk-low-surface text-risk-low",

  Failed:
    "border-risk-high/20 bg-risk-high-surface text-risk-high",
};

export function DocumentTable({ documents = [], onUpload }) {
  return (
    <DataTable columns={COLUMNS}>
      {documents.length === 0 ? (
        <DataTableEmptyRow colSpan={COLUMNS.length}>
          <EmptyState
            icon={FileText}
            title="No documents uploaded"
            description="Upload company documents to begin your due diligence analysis."
            action={
              <Button size="sm" onClick={onUpload}>
                <Upload className="size-4" />
                Upload Documents
              </Button>
            }
          />
        </DataTableEmptyRow>
      ) : (
        documents.map((document) => {
          // Backend returns companyId as a populated object
          const companyName =
            typeof document.companyId === "object"
              ? document.companyId?.name
              : "—";

          // Backend returns createdAt
          const uploadedDate = document.createdAt
            ? new Date(document.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "—";

          // Backend returns status with capital letter
          const status = document.status || "Uploaded";

          return (
            <tr
              key={document._id}
              className="transition-colors hover:bg-muted/50"
            >
              {/* Document */}
              <DataCell className="font-medium">
                {document.name}
              </DataCell>

              {/* Type */}
              <DataCell className="text-muted-foreground">
                {DOCUMENT_TYPE_LABELS[document.type] ||
                  document.type ||
                  "—"}
              </DataCell>

              {/* Company */}
              <DataCell className="text-muted-foreground">
                {companyName || "—"}
              </DataCell>

              {/* Uploaded */}
              <DataCell className="text-muted-foreground">
                {uploadedDate}
              </DataCell>

              {/* Status */}
              <DataCell>
                <span
                  className={cn(
                    "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
                    STATUS_STYLES[status] ||
                      "border-border bg-muted text-muted-foreground"
                  )}
                >
                  {STATUS_LABELS[status] || status}
                </span>
              </DataCell>

              {/* Action */}
             <DataCell className="text-right">
  <Button
    variant="outline"
    size="sm"
    onClick={() => {
      window.open(
        `http://localhost:5001/api/documents/${document._id}/file`,
        "_blank",
      );
    }}
  >
    View
  </Button>

              </DataCell>
            </tr>
          );
        })
      )}
    </DataTable>
  );
}