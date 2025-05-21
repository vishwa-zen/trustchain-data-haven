
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { getCurrentUser, isAuthenticated, hasRole } from '@/lib/auth';
import { getVaults, getApplicationsByUser } from '@/lib/vault';
import { Vault, AppRegistration } from '@/types';
import { toast } from 'sonner';

// Import dashboard components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import UserSummaryCards from '@/components/dashboard/UserSummaryCards';
import VaultsList from '@/components/dashboard/VaultsList';
import ApplicationsList from '@/components/dashboard/ApplicationsList';
import EmptyStateCard from '@/components/dashboard/EmptyStateCard';
import QuickActionsPanel from '@/components/dashboard/QuickActionsPanel';
import RoleSpecificCards from '@/components/dashboard/RoleSpecificCards';

const Dashboard = () => {
  const navigate = useNavigate();
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [applications, setApplications] = useState<AppRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  
  // We'll keep the state variables but they won't be used in the UI anymore
  const [vaultStats, setVaultStats] = useState([
    { name: 'Active', count: 0 },
    { name: 'Pending', count: 0 },
    { name: 'Archived', count: 0 },
  ]);
  const [appStats, setAppStats] = useState([
    { name: 'Approved', count: 0 },
    { name: 'Pending', count: 0 },
    { name: 'Rejected', count: 0 },
  ]);
  
  const user = getCurrentUser();
  const canManageVaults = hasRole(['data-steward', 'admin']);
  const isAdmin = hasRole(['admin']);
  const isAppOwner = user?.role === 'app-owner';
  const isSpecialRole = ['cto-user', 'dpo-user', 'csio-user'].includes(user?.role || '');
  
  // Determine if user needs token management access
  const needsTokenAccess = isAppOwner && !isSpecialRole;
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Only fetch vaults if user is data-steward or admin
        if (canManageVaults) {
          const vaultsData = await getVaults();
          setVaults(vaultsData || []);
          
          // Calculate vault statistics
          const activeCount = vaultsData?.filter(v => v.status === 'active').length || 0;
          const pendingCount = vaultsData?.filter(v => v.status === 'pending').length || 0;
          const archivedCount = vaultsData?.filter(v => v.status === 'archived').length || 0;
          
          setVaultStats([
            { name: 'Active', count: activeCount },
            { name: 'Pending', count: pendingCount },
            { name: 'Archived', count: archivedCount },
          ]);
        }
        
        // Only fetch applications if user is app-owner
        if (isAppOwner && user) {
          const appsData = await getApplicationsByUser(user.id);
          setApplications(appsData || []);
          
          // Calculate application statistics
          const approvedCount = appsData?.filter(a => a.status === 'approved').length || 0;
          const pendingCount = appsData?.filter(a => a.status === 'pending').length || 0;
          const rejectedCount = appsData?.filter(a => a.status === 'rejected').length || 0;
          
          setAppStats([
            { name: 'Approved', count: approvedCount },
            { name: 'Pending', count: pendingCount },
            { name: 'Rejected', count: rejectedCount },
          ]);
        }
        
        // Only show success toast for successful data fetching
        if ((canManageVaults && vaults.length > 0) || (isAppOwner && applications.length > 0)) {
          toast.success('Dashboard data loaded successfully');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
        
        // Set mock data in case of errors
        if (canManageVaults && vaults.length === 0) {
          setVaults([
            {
              id: 'vault-1',
              userId: user?.id || 'user-1',
              vaultName: 'Customer Data Vault',
              vaultDesc: 'Stores customer PII data',
              createdAt: new Date().toISOString(),
              status: 'active'
            },
            {
              id: 'vault-2',
              userId: user?.id || 'user-1',
              vaultName: 'Financial Data Vault',
              vaultDesc: 'Stores sensitive financial records',
              createdAt: new Date().toISOString(),
              status: 'active'
            }
          ]);
          
          // Also set mock vault stats
          setVaultStats([
            { name: 'Active', count: 2 },
            { name: 'Pending', count: 0 },
            { name: 'Archived', count: 0 },
          ]);
        }
        
        if (isAppOwner && applications.length === 0) {
          setApplications([
            {
              id: 'app-1',
              userId: user?.id || '',
              vaultId: 'vault-1',
              name: 'KYC Application',
              description: 'Customer verification system',
              status: 'approved',
              dataSets: [],
              createdAt: new Date().toISOString()
            },
            {
              id: 'app-2',
              userId: user?.id || '',
              vaultId: 'vault-1',
              name: 'Risk Assessment Tool',
              description: 'Financial risk analysis system',
              status: 'pending',
              dataSets: [],
              createdAt: new Date().toISOString()
            }
          ]);
          
          // Also set mock application stats
          setAppStats([
            { name: 'Approved', count: 1 },
            { name: 'Pending', count: 1 },
            { name: 'Rejected', count: 0 },
          ]);
        }
      } finally {
        // Always set loading to false, regardless of the result
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]); // Remove dependencies that might cause re-fetching loops
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <Navbar />
        <div className="flex w-full"> 
          <AppSidebar />
          <main className="flex-1 p-6 pt-20"> {/* Increased top padding to account for navbar */}
            <div className="flex items-center mb-6">
              <DashboardHeader user={user} />
            </div>
            
            <UserSummaryCards 
              user={user}
              vaultsCount={vaults.length}
              applicationsCount={applications.length}
              loading={loading}
              canManageVaults={canManageVaults}
              isAdmin={isAdmin}
              isAppOwner={isAppOwner}
            />
            
            {/* Show role-specific cards for CTO, DPO, and CSIO users */}
            {isSpecialRole && (
              <RoleSpecificCards user={user} />
            )}
            
            {canManageVaults && vaults.length > 0 && (
              <VaultsList vaults={vaults} loading={loading} />
            )}

            {isAppOwner && applications.length > 0 && (
              <ApplicationsList applications={applications} loading={loading} />
            )}
            
            {applications.length === 0 && isAppOwner && !loading && (
              <EmptyStateCard
                title="No Applications Found"
                description="Register your first application to access vault data"
                buttonText="Register Application"
                onClick={() => navigate('/applications/new')}
              />
            )}
            
            {vaults.length === 0 && canManageVaults && !loading && (
              <EmptyStateCard
                title="No Vaults Found"
                description="Create your first vault to get started"
                buttonText="Create Vault"
                onClick={() => navigate('/vaults')}
              />
            )}
            
            <QuickActionsPanel 
              isAdmin={isAdmin} 
              canManageVaults={canManageVaults} 
              isAppOwner={isAppOwner} 
            />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;
