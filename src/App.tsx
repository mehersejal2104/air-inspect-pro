import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { InspectionProvider } from "@/contexts/InspectionContext";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import CreateInspection from "./pages/CreateInspection";
import PDFPreview from "./pages/PDFPreview";
import ReportsPage from "./pages/ReportsPage";
import AdminDashboard from "./pages/AdminDashboard";
import EditTemplate from "./pages/EditTemplate";
import ManageChecklist from "./pages/ManageChecklist";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: string }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (role && user?.role !== role) return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute role="inspector"><Dashboard /></ProtectedRoute>} />
      <Route path="/create-inspection" element={<ProtectedRoute role="inspector"><CreateInspection /></ProtectedRoute>} />
      <Route path="/preview/:id" element={<ProtectedRoute><PDFPreview /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/template" element={<ProtectedRoute role="admin"><EditTemplate /></ProtectedRoute>} />
      <Route path="/admin/checklist" element={<ProtectedRoute role="admin"><ManageChecklist /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <InspectionProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </InspectionProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
