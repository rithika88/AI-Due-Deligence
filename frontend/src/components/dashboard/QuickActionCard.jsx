import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
export function QuickActionCard({ title, description, icon: Icon, onClick, className, }) {
    return (_jsxs("button", { type: "button", onClick: onClick, className: cn("surface-card group p-5 text-left transition-colors hover:border-ring/40 hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none", className), children: [_jsx("span", { className: "flex size-9 items-center justify-center rounded-md border border-border bg-muted text-foreground", children: _jsx(Icon, { className: "size-4", strokeWidth: 1.9 }) }), _jsxs("span", { className: "mt-4 flex items-center gap-1.5 text-sm font-semibold text-foreground", children: [title, _jsx(ArrowRight, { className: "size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5", strokeWidth: 2 })] }), _jsx("span", { className: "mt-1 block text-sm leading-relaxed text-muted-foreground", children: description })] }));
}
