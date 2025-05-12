
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Server, Plus, Search } from 'lucide-react';
import { isAuthenticated, hasRole, getCurrentUser } from '@/lib/auth';

const Applications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const user = getCurrentUser();
    if (!user || user.role !== 'app-owner') {
      navigate('/dashboard');
      return;
    }

    // Mock data loading
    const loadApplications = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          setApplications([
            {
              id: 'app-1',
              name: 'KYC Application',
              description: 'Customer verification system',
              status: 'approved',
              vaultName: 'Customer Data Vault',
              createdAt: '2025-04-10T08:30:00Z',
              updatedAt: '2025-04-12T14:45:00Z'
            },
            {
              id: 'app-2',
              name: 'Risk Assessment Tool',
              description: 'Financial risk analysis system',
              status: 'pending',
              vaultName: 'Financial Data Vault',
              createdAt: '2025-05-01T10:15:00Z',
              updatedAt: '2025-05-01T10:15:00Z'
            },
            {
              id: 'app-3',
              name: 'Compliance Monitor',
              description: 'Regulatory compliance monitoring',
              status: 'rejected',
              vaultName: 'Regulatory Data Vault',
              createdAt: '2025-03-22T16:40:00Z',
              updatedAt: '2025-03-25T09:20:00Z'
            }
          ]);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error loading applications:', error);
        setLoading(false);
      }
    };

    loadApplications();
  }, [navigate]);

  const handleCreateApplication = () => {
    navigate('/applications/new');
  };

  const filteredApplications = applications.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
              <p className="text-muted-foreground">
                Manage your data access applications
              </p>
            </div>
            <Button onClick={handleCreateApplication}>
              <Plus className="mr-2 h-4 w-4" />
              New Application
            </Button>
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search applications..."
                className="pl-8 w-full md:max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Applications</CardTitle>
              <CardDescription>
                Applications registered for data access
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Loading applications...</p>
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="text-center py-6">
                  <Server className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                  <h3 className="text-lg font-medium">No applications found</h3>
                  {searchTerm ? (
                    <p className="text-muted-foreground mt-1">
                      Try adjusting your search or clear the filter
                    </p>
                  ) : (
                    <p className="text-muted-foreground mt-1">
                      Start by creating your first application
                    </p>
                  )}
                  {!searchTerm && (
                    <Button onClick={handleCreateApplication} className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Application
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Vault</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{app.name}</p>
                            <p className="text-sm text-muted-foreground">{app.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>{app.vaultName}</TableCell>
                        <TableCell>{formatDate(app.createdAt)}</TableCell>
                        <TableCell>{formatDate(app.updatedAt)}</TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            asChild
                          >
                            <Link to={`/applications/${app.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Applications;
