
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import SelfHost from "./pages/SelfHost";
// import SelfHostBanner from "./components/SelfHostBanner";
import { MobileWarningModal } from "./components/MobileWarningModal";

// Create a client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Wrapper component to conditionally show the MobileWarningModal
const MobileWarningWrapper = () => {
  const location = useLocation();
  const isSelfHostPage = location.pathname === "/self-host";
  
  if (isSelfHostPage) {
    return null;
  }
  
  return <MobileWarningModal />;
};

const App = () => {
  console.log("APP: Initializing app");
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          {/* <SelfHostBanner /> */}
          <BrowserRouter>
            <Routes>
              <Route path="/landing" element={<Landing />} />
              <Route path="/self-host" element={<SelfHost />} />
              <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <MobileWarningWrapper />
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
