import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
export function StatCard({ label, value, icon: Icon, helpText, emptyLabel = "No data yet", className, }) {
    const hasValue = value !== undefined && value !== null && value !== "";
    return (_jsxs("div", { className: cn("surface-card p-5", className), children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsx("p", { className: "text-sm font-medium text-muted-foreground", children: label }), _jsx("span", { className: "flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground", children: _jsx(Icon, { className: "size-4", strokeWidth: 1.9 }) })] }), hasValue ? (_jsx("p", { className: "mt-4 text-3xl font-semibold tracking-tight text-foreground tabular-nums", children: value })) : (_jsx("p", { className: "mt-4 text-sm font-medium text-muted-foreground", children: emptyLabel })), _jsx("p", { className: "mt-1.5 text-xs text-muted-foreground", children: helpText ?? "Updates once your workspace data is connected." })] }));
}
