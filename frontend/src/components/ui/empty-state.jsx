import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
export function EmptyState({ icon: Icon, title, description, action, className, size = "md", }) {
    return (_jsxs("div", { className: cn("flex flex-col items-center justify-center text-center", size === "md" ? "px-6 py-14" : "px-4 py-9", className), children: [_jsx("div", { className: cn("flex items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground", size === "md" ? "size-11" : "size-9"), children: _jsx(Icon, { className: size === "md" ? "size-5" : "size-4", strokeWidth: 1.75 }) }), _jsx("h3", { className: cn("mt-4 font-semibold text-foreground", size === "md" ? "text-[15px]" : "text-sm"), children: title }), description ? (_jsx("p", { className: "mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground", children: description })) : null, action ? _jsx("div", { className: "mt-5", children: action }) : null] }));
}
