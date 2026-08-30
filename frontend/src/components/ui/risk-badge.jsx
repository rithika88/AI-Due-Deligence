import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
const LEVEL_STYLES = {
    high: "bg-risk-high-surface text-risk-high border-risk-high/20",
    medium: "bg-risk-medium-surface text-risk-medium border-risk-medium/20",
    low: "bg-risk-low-surface text-risk-low border-risk-low/20",
};
const LEVEL_LABELS = {
    high: "High risk",
    medium: "Medium risk",
    low: "Low risk",
};
export function RiskBadge({ level, className, fallbackLabel = "Not assessed", }) {
    if (!level) {
        return (_jsx("span", { className: cn("inline-flex items-center gap-1.5 rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground", className), children: fallbackLabel }));
    }
    return (_jsxs("span", { className: cn("inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium", LEVEL_STYLES[level], className), children: [_jsx("span", { className: "size-1.5 rounded-full bg-current", "aria-hidden": true }), LEVEL_LABELS[level]] }));
}
