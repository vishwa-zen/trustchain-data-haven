
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';
import Settings from '@/pages/Settings';
import VaultManagement from '@/pages/VaultManagement';
import VaultDetails from '@/pages/VaultDetails';
import AppRegistration from '@/pages/AppRegistration';
import Applications from '@/pages/Applications';
import ApplicationDetail from '@/pages/ApplicationDetail';
import TokenManagement from '@/pages/TokenManagement';
import ConsentManagement from '@/pages/ConsentManagement';
import GroupedConsentPage from '@/pages/GroupedConsentPage';
import UserManagement from '@/pages/UserManagement';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/vaults" element={<VaultManagement />} />
          <Route path="/vaults/:id" element={<VaultDetails />} />
          <Route path="/app-registration" element={<AppRegistration />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/:id" element={<ApplicationDetail />} />
          <Route path="/tokens" element={<TokenManagement />} />
          <Route path="/consent" element={<ConsentManagement />} />
          <Route path="/grouped-consent" element={<GroupedConsentPage />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
};

export default App;
