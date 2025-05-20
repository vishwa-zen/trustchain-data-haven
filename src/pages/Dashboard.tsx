
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [applications, setApplications] = useState<AppRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  
  const user = getCurrentUser();
  const canManageVaults = hasRole(['data-steward', 'admin']);
  const isAdmin = hasRole(['admin']);
  const isAppOwner = user?.role === 'app-owner';
  
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
        }
        
        // Only fetch applications if user is app-owner
        if (isAppOwner) {
          const appsData = await getApplicationsByUser(user.id);
          setApplications(appsData || []);
        }
        
        toast.success('Dashboard data loaded successfully');
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
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate, user, canManageVaults, isAppOwner]);
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <DashboardHeader user={user} />
          
          <UserSummaryCards 
            user={user}
            vaultsCount={vaults.length}
            applicationsCount={applications.length}
            loading={loading}
            canManageVaults={canManageVaults}
            isAdmin={isAdmin}
            isAppOwner={isAppOwner}
          />

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
    </div>
  );
};

export default Dashboard;
