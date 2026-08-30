import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { CompanyTable } from "@/components/dashboard/CompanyTable";
import { AddCompanyModal } from "@/components/dashboard/modals";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";

const API_URL = "http://localhost:5001/api";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [addCompanyOpen, setAddCompanyOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/companies`);

        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }

        const data = await response.json();

        setCompanies(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load companies. Please check the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return companies;
    }

    return companies.filter((company) =>
      `${company.name} ${company.industry || ""}`
        .toLowerCase()
        .includes(query),
    );
  }, [companies, search]);

  return (
    <AppShell
      title="Companies"
      description="Every company under due diligence review."
      headerActions={
        <Button
          size="sm"
          className="hidden sm:inline-flex"
          onClick={() => setAddCompanyOpen(true)}
        >
          <Plus className="size-4" />
          Add Company
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="surface-card grid grid-cols-1 gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="search"
              placeholder="Search companies"
              aria-label="Search companies"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-card pl-8 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40 focus:outline-none"
            />
          </div>

          <Button size="sm" onClick={() => setAddCompanyOpen(true)}>
            <Plus className="size-4" />
            Add Company
          </Button>
        </div>

        <SectionCard
          title="All Companies"
          description="Companies retrieved from your due diligence workspace."
        >
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Loading companies...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-sm text-red-600">
              {error}
            </div>
          ) : (
            <CompanyTable
              companies={filteredCompanies.map((company) => ({
                ...company,
                id: company._id,
              }))}
              onAddCompany={() => setAddCompanyOpen(true)}
            />
          )}
        </SectionCard>
      </div>

      <AddCompanyModal
        open={addCompanyOpen}
        onOpenChange={setAddCompanyOpen}
      />
    </AppShell>
  );
}