import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DOCUMENT_TYPE_LABELS } from "./DocumentTable";

/* =========================================================
   ADD COMPANY MODAL
========================================================= */

export function AddCompanyModal({ open, onOpenChange }) {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !industry.trim()) {
      setError("Company name and industry are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5001/api/companies",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            industry: industry.trim(),
            description: "",
          }),
        },
      );

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error("Server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create company",
        );
      }

      console.log("Company created:", data);

      setName("");
      setIndustry("");
      onOpenChange(false);

      window.location.reload();
    } catch (err) {
      console.error("Add company error:", err);

      setError(
        err.message || "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Add company"
      description="Start a new due diligence workspace."
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Company"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">

        <div className="space-y-1.5">
          <Label htmlFor="company-name">
            Company name
          </Label>

          <Input
            id="company-name"
            placeholder="Enter company name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="company-industry">
            Industry
          </Label>

          <Input
            id="company-industry"
            placeholder="Enter industry"
            value={industry}
            onChange={(e) =>
              setIndustry(e.target.value)
            }
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

      </div>
    </Modal>
  );
}

/* =========================================================
   UPLOAD DOCUMENTS MODAL
========================================================= */

export function UploadDocumentsModal({
  open,
  onOpenChange,
}) {
  const [companies, setCompanies] = useState([]);

  const [companyId, setCompanyId] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState(null);

  const [loadingCompanies, setLoadingCompanies] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /* Fetch companies whenever modal opens */
  useEffect(() => {
    if (!open) return;

    const fetchCompanies = async () => {
      setLoadingCompanies(true);
      setError("");

      try {
        const response = await fetch(
          "http://localhost:5001/api/companies",
        );

        const responseText =
          await response.text();

        let data;

        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(
            "Server returned an invalid response.",
          );
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch companies",
          );
        }

        setCompanies(data);
      } catch (err) {
        console.error(
          "Fetch companies error:",
          err,
        );

        setError(
          err.message ||
            "Could not load companies.",
        );
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, [open]);

  /* Upload document metadata */
  const handleUpload = async () => {
  if (!companyId || !documentType || !file) {
    setError("Please select a company, document type and file.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("type", documentType);
    formData.append("companyId", companyId);

    const response = await fetch(
      "http://localhost:5001/api/documents",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to upload document",
      );
    }

    console.log("Document uploaded successfully:", data);

    onOpenChange(false);

    setCompanyId("");
    setDocumentType("");
    setFile(null);

    window.location.reload();
  } catch (err) {
    console.error("Upload error:", err);
    setError(err.message || "Upload failed.");
  } finally {
    setLoading(false);
  }
};

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Upload documents"
      description="Add a document to a company's due diligence workspace."
      footer={
        <>
          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleUpload}
            disabled={
              loading ||
              loadingCompanies
            }
          >
            {loading
              ? "Uploading..."
              : "Upload"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">

        {/* Company */}
        <div className="space-y-1.5">
          <Label htmlFor="document-company">
            Company
          </Label>

          <Select
            value={companyId}
            onValueChange={(value) => {
              setCompanyId(value);
              setError("");
            }}
            disabled={loadingCompanies}
          >
            <SelectTrigger id="document-company">
              <SelectValue
                placeholder={
                  loadingCompanies
                    ? "Loading companies..."
                    : "Select a company"
                }
              />
            </SelectTrigger>

            <SelectContent>
              {companies.length === 0 ? (
                <div className="px-2 py-3 text-sm text-muted-foreground">
                  No companies available
                </div>
              ) : (
                companies.map((company) => (
                  <SelectItem
                    key={company._id}
                    value={company._id}
                  >
                    {company.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Document type */}
        <div className="space-y-1.5">
          <Label htmlFor="document-type">
            Document type
          </Label>

          <Select
            value={documentType}
            onValueChange={(value) => {
              setDocumentType(value);
              setError("");
            }}
          >
            <SelectTrigger id="document-type">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>

            <SelectContent>
              {Object.keys(
                DOCUMENT_TYPE_LABELS,
              ).map((type) => (
                <SelectItem
                  key={type}
                  value={type}
                >
                  {DOCUMENT_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* File */}
        <div className="space-y-1.5">
          <Label htmlFor="document-files">
            File
          </Label>

          <Input
            id="document-files"
            type="file"
            onChange={(e) => {
              setFile(
                e.target.files?.[0] || null,
              );
              setError("");
            }}
          />

          {file && (
            <p className="text-xs text-muted-foreground">
              Selected: {file.name}
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

      </div>
    </Modal>
  );
}

/* =========================================================
   GENERATE REPORT MODAL
========================================================= */

export function GenerateReportModal({
  open,
  onOpenChange,
}) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Generate report"
      description="Create a due diligence report from your analysis."
      footer={
        <>
          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button disabled>
            Generate Report
          </Button>
        </>
      }
    >
      <div className="space-y-4">

        <div className="space-y-1.5">
          <Label htmlFor="report-company">
            Company
          </Label>

          <Input
            id="report-company"
            placeholder="No companies available yet"
            disabled
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="report-type">
            Report type
          </Label>

          <Input
            id="report-type"
            placeholder="Full due diligence"
          />
        </div>

      </div>
    </Modal>
  );
}