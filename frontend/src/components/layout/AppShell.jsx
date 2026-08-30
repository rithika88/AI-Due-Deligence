import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { SidebarNav } from "./SidebarNav";
import { TopHeader } from "./TopHeader";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
export function AppShell({ title, description, headerActions, children, user, workspaceName, }) {
    const [navOpen, setNavOpen] = useState(false);
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx("aside", { className: "fixed inset-y-0 left-0 z-30 hidden w-[250px] border-r border-sidebar-border lg:block", children: _jsx(SidebarNav, { user: user, workspaceName: workspaceName }) }), _jsx(Sheet, { open: navOpen, onOpenChange: setNavOpen, children: _jsxs(SheetContent, { side: "left", className: "w-[280px] p-0", children: [_jsx(SheetTitle, { className: "sr-only", children: "Navigation" }), _jsx(SidebarNav, { user: user, workspaceName: workspaceName, onNavigate: () => setNavOpen(false) })] }) }), _jsxs("div", { className: "lg:pl-[250px]", children: [_jsx(TopHeader, { title: title, description: description, actions: headerActions, user: user, onOpenNav: () => setNavOpen(true) }), _jsx("main", { className: "mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8", children: children })] })] }));
}
