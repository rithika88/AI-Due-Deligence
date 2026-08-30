import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ShieldAlert } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
const LEVELS = [
    { level: "high", label: "High Risk", dot: "bg-risk-high", bar: "bg-risk-high" },
    { level: "medium", label: "Medium Risk", dot: "bg-risk-medium", bar: "bg-risk-medium" },
    { level: "low", label: "Low Risk", dot: "bg-risk-low", bar: "bg-risk-low" },
];
export function RiskDistribution({ summary, className }) {
    const counts = {
        high: summary?.high,
        medium: summary?.medium,
        low: summary?.low,
    };
    const hasData = Object.values(counts).some((value) => typeof value === "number");
    const total = hasData
        ? (counts.high ?? 0) + (counts.medium ?? 0) + (counts.low ?? 0)
        : 0;
    if (!hasData) {
        return (_jsx(EmptyState, { icon: ShieldAlert, title: "No risk analysis available", description: "Risk findings will appear here after company documents are analyzed.", size: "sm", className: className }));
    }
    return (_jsx("div", { className: cn("space-y-4 px-5 py-5 sm:px-6", className), children: LEVELS.map((item) => {
            const count = counts[item.level] ?? 0;
            const share = total > 0 ? Math.round((count / total) * 100) : 0;
            return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("span", { className: "flex items-center gap-2 text-sm font-medium text-foreground", children: [_jsx("span", { className: cn("size-1.5 rounded-full", item.dot), "aria-hidden": true }), item.label] }), _jsx("span", { className: "text-sm tabular-nums text-muted-foreground", children: count })] }), _jsx("div", { className: "mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted", children: _jsx("div", { className: cn("h-full rounded-full", item.bar), style: { width: `${share}%` } }) })] }, item.level));
        }) }));
}
