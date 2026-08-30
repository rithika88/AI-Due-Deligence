import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Building2, ClipboardList, ShieldAlert, Sparkles, Upload } from "lucide-react";
const STEPS = [
    { label: "Add Company", icon: Building2 },
    { label: "Upload Documents", icon: Upload },
    { label: "Analyze Information", icon: Sparkles },
    { label: "Identify Risks", icon: ShieldAlert },
    { label: "Generate Report", icon: ClipboardList },
];
/** Static workflow guide — communicates the product flow, holds no data. */
export function WorkflowSteps() {
    return (_jsx("ol", { className: "flex flex-col gap-3 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:gap-2", children: STEPS.map((step, index) => {
            const Icon = step.icon;
            return (_jsxs("li", { className: "flex min-w-0 flex-1 items-center gap-2", children: [_jsx("span", { className: "flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground", children: _jsx(Icon, { className: "size-3.5", strokeWidth: 1.9 }) }), _jsx("span", { className: "min-w-0 flex-1 truncate text-sm font-medium text-foreground", children: step.label }), index < STEPS.length - 1 ? (_jsx("span", { className: "hidden h-px w-6 shrink-0 bg-border lg:block", "aria-hidden": true })) : null] }, step.label));
        }) }));
}
