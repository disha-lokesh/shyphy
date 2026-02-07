import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import FteLoginPage from "./pages/FteLoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import NotFound from "./pages/NotFound";

// Dashboards
import InternDashboard from "./pages/dashboard/InternDashboard";
import EmployeeDashboard from "./pages/dashboard/EmployeeDashboard";
import HRDashboard from "./pages/dashboard/HRDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import AdminSSHPage from "./pages/dashboard/AdminSSHPage";
import BossDashboard from "./pages/dashboard/BossDashboard";
import BlueTeamDashboard from "./pages/dashboard/BlueTeamDashboard";
import BlueTeamAlertsPage from "./pages/dashboard/BlueTeamAlertsPage";
import BlueTeamControlsPage from "./pages/dashboard/BlueTeamControlsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/fte-login" element={<FteLoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Intern Dashboard */}
            <Route path="/dashboard/intern" element={<InternDashboard />} />
            <Route path="/dashboard/intern/profile" element={<InternDashboard />} />
            <Route path="/dashboard/intern/documents" element={<InternDashboard />} />

            {/* Employee Dashboard */}
            <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
            <Route path="/dashboard/employee/projects" element={<EmployeeDashboard />} />
            <Route path="/dashboard/employee/team" element={<EmployeeDashboard />} />

            {/* HR Dashboard */}
            <Route path="/dashboard/hr" element={<HRDashboard />} />
            <Route path="/dashboard/hr/employees" element={<HRDashboard />} />
            <Route path="/dashboard/hr/records" element={<HRDashboard />} />

            {/* Admin Dashboard */}
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/admin/users" element={<AdminDashboard />} />
            <Route path="/dashboard/admin/security" element={<AdminDashboard />} />
            <Route path="/dashboard/admin/ssh" element={<AdminSSHPage />} />

            {/* Boss Dashboard */}
            <Route path="/dashboard/boss" element={<BossDashboard />} />
            <Route path="/dashboard/boss/reports" element={<BossDashboard />} />
            <Route path="/dashboard/boss/executive" element={<BossDashboard />} />

            {/* Blue Team Dashboard */}
            <Route path="/blue-team" element={<BlueTeamDashboard />} />
            <Route path="/blue-team/alerts" element={<BlueTeamAlertsPage />} />
            <Route path="/blue-team/controls" element={<BlueTeamControlsPage />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
