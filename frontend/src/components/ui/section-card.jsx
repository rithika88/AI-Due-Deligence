import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
/** White card with a bordered header row — the base container for every section. */
export function SectionCard({ title, description, action, children, className, bodyClassName, }) {
    return (_jsxs("section", { className: cn("surface-card overflow-hidden", className), children: [_jsxs("header", { className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-5 py-4 sm:px-6", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h2", { className: "truncate text-sm font-semibold text-foreground", children: title }), description ? (_jsx("p", { className: "mt-0.5 truncate text-xs text-muted-foreground", children: description })) : null] }), action ? _jsx("div", { className: "shrink-0", children: action }) : null] }), _jsx("div", { className: cn(bodyClassName), children: children })] }));
}
