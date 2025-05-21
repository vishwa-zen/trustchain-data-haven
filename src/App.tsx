
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import ApplicationDetail from './pages/ApplicationDetail';
import Applications from './pages/Applications';
import VaultManagement from './pages/VaultManagement';
import VaultDetails from './pages/VaultDetails';
import Settings from './pages/Settings';
import AppRegistration from './pages/AppRegistration';
import UserManagement from './pages/UserManagement';
import ConsentManagement from './pages/ConsentManagement';
import GroupedConsentPage from './pages/GroupedConsentPage';
import TokenManagement from './pages/TokenManagement';
import AuditLogs from './pages/AuditLogs';
import './App.css';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/applications/:applicationId" element={<ApplicationDetail />} />
        <Route path="/register-application" element={<AppRegistration />} />
        <Route path="/vaults" element={<VaultManagement />} />
        <Route path="/vaults/:vaultId" element={<VaultDetails />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/consent" element={<ConsentManagement />} />
        <Route path="/consent/grouped" element={<GroupedConsentPage />} />
        <Route path="/tokens" element={<TokenManagement />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
