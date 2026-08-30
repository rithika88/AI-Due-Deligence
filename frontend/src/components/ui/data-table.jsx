import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
/** Horizontally scrollable table shell with consistent header styling. */
export function DataTable({ columns, children, className }) {
    return (_jsx("div", { className: cn("w-full overflow-x-auto", className), children: _jsxs("table", { className: "w-full min-w-[720px] border-collapse text-sm", children: [_jsx("thead", { children: _jsx("tr", { className: "border-b border-border bg-muted/60", children: columns.map((column) => (_jsx("th", { scope: "col", className: cn("px-5 py-2.5 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-6", column.className), children: column.label }, column.key))) }) }), _jsx("tbody", { className: "divide-y divide-border", children: children })] }) }));
}
export function DataTableEmptyRow({ colSpan, children, }) {
    return (_jsx("tr", { children: _jsx("td", { colSpan: colSpan, className: "p-0", children: children }) }));
}
export function DataCell({ children, className, }) {
    return (_jsx("td", { className: cn("px-5 py-3.5 align-middle text-foreground sm:px-6", className), children: children }));
}
