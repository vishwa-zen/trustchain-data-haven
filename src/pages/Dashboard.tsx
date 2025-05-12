
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { getCurrentUser, isAuthenticated, hasRole } from '@/lib/auth';
import { getVaults, getApplicationsByUser } from '@/lib/vault';
import { Vault, AppRegistration } from '@/types';
import { Database, Server, Key } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [applications, setApplications] = useState<AppRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  
  const user = getCurrentUser();
  const canManageVaults = hasRole(['data-steward', 'admin']);
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      
      try {
        if (canManageVaults) {
          const vaultsData = await getVaults();
          setVaults(vaultsData);
        }
        
        if (user && user.role === 'app-owner') {
          const appsData = await getApplicationsByUser(user.id);
          setApplications(appsData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate, user, canManageVaults]);
  
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
              
              {user.role === 'app-owner' && (
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
            </div>
          </div>

          {canManageVaults && (
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
                ) : vaults.length === 0 ? (
                  <Card className="col-span-full">
                    <CardHeader>
                      <CardTitle>No Vaults Found</CardTitle>
                      <CardDescription>
                        Create your first vault to get started
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button onClick={() => navigate('/vaults/new')}>
                        Create Vault
                      </Button>
                    </CardFooter>
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

          {user.role === 'app-owner' && (
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
                ) : applications.length === 0 ? (
                  <Card className="col-span-full">
                    <CardHeader>
                      <CardTitle>No Applications Found</CardTitle>
                      <CardDescription>
                        Register a new application to access vault data
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button onClick={() => navigate('/applications/new')}>
                        Register Application
                      </Button>
                    </CardFooter>
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
                  onClick={() => navigate('/vaults/new')}
                >
                  <Database className="h-5 w-5" />
                  <span>Create Vault</span>
                </Button>
              )}
              
              {user.role === 'app-owner' && (
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-2"
                  onClick={() => navigate('/applications/new')}
                >
                  <Server className="h-5 w-5" />
                  <span>Register Application</span>
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
