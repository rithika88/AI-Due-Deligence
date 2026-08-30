import { Building2, FileText, LayoutDashboard, Settings, ShieldAlert, ClipboardList, } from "lucide-react";
export const PRIMARY_NAV = [
    { label: "Overview", to: "/", icon: LayoutDashboard, exact: true },
    { label: "Companies", to: "/companies", icon: Building2 },
    { label: "Documents", to: "/documents", icon: FileText },
    { label: "Risk Analysis", to: "/risks", icon: ShieldAlert },
    { label: "Reports", to: "/reports", icon: ClipboardList },
];
export const WORKSPACE_NAV = [
    { label: "Settings", to: "/settings", icon: Settings },
];
