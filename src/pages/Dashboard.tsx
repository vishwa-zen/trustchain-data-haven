
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { getCurrentUser, isAuthenticated, hasRole } from '@/lib/auth';
import { getVaults, getApplicationsByUser } from '@/lib/vault';
import { Vault, AppRegistration } from '@/types';
import { Database, Server, Key, Users, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

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
              vaultName: 'Customer Data Vault',
              vaultDesc: 'Stores customer PII data',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              status: 'active'
            },
            {
              id: 'vault-2',
              vaultName: 'Financial Data Vault',
              vaultDesc: 'Stores sensitive financial records',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              status: 'active'
            }
          ]);
        }
        
        if (isAppOwner && applications.length === 0) {
          setApplications([
            {
              id: 'app-1',
              name: 'KYC Application',
              description: 'Customer verification system',
              clientId: 'client-123',
              clientSecret: 'secret-123',
              redirectUris: ['https://example.com/callback'],
              status: 'approved',
              ownerId: user?.id || '',
              createdAt: new Date().toISOString()
            },
            {
              id: 'app-2',
              name: 'Risk Assessment Tool',
              description: 'Financial risk analysis system',
              clientId: 'client-456',
              clientSecret: 'secret-456',
              redirectUris: ['https://example.com/callback'],
              status: 'pending',
              ownerId: user?.id || '',
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div>
              <span className="text-sm text-muted-foreground">Welcome, {user.firstName}</span>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-gradient-to-br from-vault-100 to-vault-50 border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-vault-900">Role</CardTitle>
                  <CardDescription>Your access level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-vault-900 capitalize">
                    {user.role.replace('-', ' ')}
                  </div>
                </CardContent>
              </Card>
              
              {canManageVaults && (
                <Card className="bg-gradient-to-br from-security-100 to-security-50 border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-security-900">Vaults</CardTitle>
                    <CardDescription>Total data vaults</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-security-900">
                      {loading ? '...' : vaults.length}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {isAppOwner && (
                <Card className="bg-gradient-to-br from-highlight-100 to-highlight-50 border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-highlight-900">Applications</CardTitle>
                    <CardDescription>Registered apps</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-highlight-900">
                      {loading ? '...' : applications.length}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {isAdmin && (
                <Card className="bg-gradient-to-br from-security-100 to-security-50 border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-security-900">User Management</CardTitle>
                    <CardDescription>Admin controls</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/users')}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {canManageVaults && vaults.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Vaults</h2>
                <Button onClick={() => navigate('/vaults')}>
                  Manage Vaults
                </Button>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  <Card className="animate-pulse-slow">
                    <CardHeader>
                      <CardTitle>Loading...</CardTitle>
                    </CardHeader>
                  </Card>
                ) : (
                  vaults.slice(0, 3).map(vault => (
                    <Card key={vault.id} className="animate-fade-in">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle>{vault.vaultName}</CardTitle>
                          <div className="h-8 w-8 rounded-full bg-gradient-vault flex items-center justify-center">
                            <Database className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <CardDescription>{vault.vaultDesc}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate(`/vaults/${vault.id}`)}
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {isAppOwner && applications.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Applications</h2>
                <Button onClick={() => navigate('/applications')}>
                  Manage Applications
                </Button>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  <Card className="animate-pulse-slow">
                    <CardHeader>
                      <CardTitle>Loading...</CardTitle>
                    </CardHeader>
                  </Card>
                ) : (
                  applications.slice(0, 3).map(app => (
                    <Card key={app.id} className="animate-fade-in">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle>{app.name}</CardTitle>
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-highlight-600 to-highlight-700 flex items-center justify-center">
                            <Server className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <CardDescription>{app.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Status:</span>
                          <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                            app.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : app.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant={app.status === 'approved' ? 'default' : 'outline'}
                          className="w-full"
                          onClick={() => navigate(`/applications/${app.id}`)}
                        >
                          {app.status === 'approved' ? 'Manage Tokens' : 'View Details'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
          
          {applications.length === 0 && isAppOwner && !loading && (
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                    No Applications Found
                  </CardTitle>
                  <CardDescription>
                    Register your first application to access vault data
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button onClick={() => navigate('/applications/new')}>
                    Register Application
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
          
          {vaults.length === 0 && canManageVaults && !loading && (
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                    No Vaults Found
                  </CardTitle>
                  <CardDescription>
                    Create your first vault to get started
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button onClick={() => navigate('/vaults')}>
                    Create Vault
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              <Button 
                variant="outline" 
                className="h-24 flex flex-col gap-2"
                onClick={() => navigate('/tokens')}
              >
                <Key className="h-5 w-5" />
                <span>Tokenize Data</span>
              </Button>
              
              {canManageVaults && (
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-2"
                  onClick={() => navigate('/vaults')}
                >
                  <Database className="h-5 w-5" />
                  <span>Manage Vaults</span>
                </Button>
              )}
              
              {isAppOwner && (
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-2"
                  onClick={() => navigate('/applications/new')}
                >
                  <Server className="h-5 w-5" />
                  <span>Register Application</span>
                </Button>
              )}
              
              {isAdmin && (
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-2"
                  onClick={() => navigate('/users')}
                >
                  <Users className="h-5 w-5" />
                  <span>Manage Users</span>
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
