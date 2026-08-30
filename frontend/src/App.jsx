import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Overview from "./routes/index";
import Companies from "./routes/companies.index";
import CompanyWorkspace from "./routes/companies.$id";
import Documents from "./routes/documents";
import Risks from "./routes/risks";
import Reports from "./routes/reports";
import Settings from "./routes/settings";
import ReportDetailsPage from "@/pages/ReportDetailsPage";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:id" element={<CompanyWorkspace />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/risks" element={<Risks />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/:id" element={<ReportDetailsPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
  );
}
