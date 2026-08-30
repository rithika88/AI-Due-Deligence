import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Activity } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
export function ActivityList({ activities = [] }) {
    if (activities.length === 0) {
        return (_jsx(EmptyState, { icon: Activity, title: "No recent activity", description: "Your due diligence activity will appear here.", size: "sm" }));
    }
    return (_jsx("ul", { className: "divide-y divide-border", children: activities.map((item) => (_jsxs("li", { className: "flex gap-3 px-5 py-4 sm:px-6", children: [_jsx("span", { className: "mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground", "aria-hidden": true }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: item.title }), item.description ? (_jsx("p", { className: "mt-0.5 text-sm text-muted-foreground", children: item.description })) : null, _jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: [item.actor, item.createdAt].filter(Boolean).join(" · ") })] })] }, item.id))) }));
}
