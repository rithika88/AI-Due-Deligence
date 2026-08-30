import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataCell, DataTable, DataTableEmptyRow } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { RiskBadge } from "@/components/ui/risk-badge";
const COLUMNS = [
    { key: "company", label: "Company" },
    { key: "industry", label: "Industry" },
    { key: "documents", label: "Documents" },
    { key: "risk", label: "Risk Level" },
    { key: "updated", label: "Last Updated" },
    { key: "action", label: "Action", className: "text-right" },
];
export function CompanyTable({ companies = [], onAddCompany }) {
    return (_jsx(DataTable, { columns: COLUMNS, children: companies.length === 0 ? (_jsx(DataTableEmptyRow, { colSpan: COLUMNS.length, children: _jsx(EmptyState, { icon: Building2, title: "No companies yet", description: "Add a company to start your due diligence analysis.", action: _jsxs(Button, { size: "sm", onClick: onAddCompany, children: [_jsx(Plus, { className: "size-4" }), "Add Company"] }) }) })) : (companies.map((company) => (_jsxs("tr", { className: "transition-colors hover:bg-muted/50", children: [_jsx(DataCell, { className: "font-medium", children: company.name }), _jsx(DataCell, { className: "text-muted-foreground", children: company.industry ?? "—" }), _jsx(DataCell, { className: "tabular-nums text-muted-foreground", children: company.documentCount ?? 0 }), _jsx(DataCell, { children: _jsx(RiskBadge, { level: company.riskLevel }) }), _jsx(DataCell, { className: "text-muted-foreground", children: company.updatedAt ?? "—" }), _jsx(DataCell, { className: "text-right", children: _jsx(Button, { asChild: true, variant: "outline", size: "sm", children: _jsx(Link, { to: `/companies/${company.id}`, children: "Open" }) }) })] }, company.id)))) }));
}
