import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
/** Thin wrapper around Dialog so pages share one modal shape. */
export function Modal({ open, onOpenChange, title, description, children, footer, }) {
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-lg", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: title }), description ? _jsx(DialogDescription, { children: description }) : null] }), children, footer ? _jsx(DialogFooter, { children: footer }) : null] }) }));
}
