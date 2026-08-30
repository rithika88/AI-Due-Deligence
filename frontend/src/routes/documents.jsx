import { useEffect, useState } from "react";
import { Search, Upload } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import {
  DocumentTable,
  DOCUMENT_TYPE_LABELS,
} from "@/components/dashboard/DocumentTable";
import { UploadDocumentsModal } from "@/components/dashboard/modals";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function DocumentsPage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5001/api/documents",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }

        const data = await response.json();
        setDocuments(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const visibleDocuments = documents.filter((document) => {
    const matchesType =
      typeFilter === "all" || document.type === typeFilter;

    const companyName =
      typeof document.companyId === "object"
        ? document.companyId?.name || ""
        : "";

    const matchesSearch =
      document.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      companyName
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesType && matchesSearch;
  });

  return (
    <AppShell
      title="Documents"
      description="All documents across your due diligence workspaces."
      headerActions={
        <Button
          size="sm"
          className="hidden sm:inline-flex"
          onClick={() => setUploadOpen(true)}
        >
          <Upload className="size-4" />
          Upload Documents
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="surface-card grid grid-cols-1 gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents"
              aria-label="Search documents"
              className="h-9 w-full rounded-md border border-input bg-card pl-8 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40 focus:outline-none"
            />
          </div>

          <Select
            value={typeFilter}
            onValueChange={setTypeFilter}
          >
            <SelectTrigger
              className="w-full sm:w-44"
              aria-label="Filter by type"
            >
              <SelectValue placeholder="All types" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All types</SelectItem>

              {Object.keys(DOCUMENT_TYPE_LABELS).map((type) => (
                <SelectItem key={type} value={type}>
                  {DOCUMENT_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            size="sm"
            onClick={() => setUploadOpen(true)}
          >
            <Upload className="size-4" />
            Upload Documents
          </Button>
        </div>

        <SectionCard
          title="All Documents"
          description="Financial, legal, commercial, technical and other files."
        >
          {loading ? (
            <div className="p-6 text-sm text-muted-foreground">
              Loading documents...
            </div>
          ) : error ? (
            <div className="p-6 text-sm text-destructive">
              {error}
            </div>
          ) : (
            <DocumentTable
              documents={visibleDocuments}
              onUpload={() => setUploadOpen(true)}
            />
          )}
        </SectionCard>
      </div>

      <UploadDocumentsModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
      />
    </AppShell>
  );
}

export default DocumentsPage;