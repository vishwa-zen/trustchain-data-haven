
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import VaultManagement from "./pages/VaultManagement";
import VaultDetails from "./pages/VaultDetails";
import AppRegistration from "./pages/AppRegistration";
import Applications from "./pages/Applications";
import TokenManagement from "./pages/TokenManagement";
import Settings from "./pages/Settings";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";
import ApplicationDetail from "./pages/ApplicationDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vaults" element={<VaultManagement />} />
          <Route path="/vaults/:id" element={<VaultDetails />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/new" element={<AppRegistration />} />
          <Route path="/applications/:id" element={<ApplicationDetail />} />
          <Route path="/tokens" element={<TokenManagement />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
