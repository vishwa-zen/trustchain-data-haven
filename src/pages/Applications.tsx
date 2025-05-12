
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Search } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AppRegistration } from '@/types';

const Applications = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock application data
  const [applications, setApplications] = useState<AppRegistration[]>([
    {
      id: 'app-1',
      userId: user?.id || '',
      vaultId: 'vault-1',
      name: 'KYC Application',
      description: 'Application for managing KYC verification processes',
      status: 'approved',
      dataSets: [
        {
          name: 'user_profile',
          accessToken: '8731hijkhoas8971',
          fields: [{ name: 'first_name' }, { name: 'last_name' }, { name: 'email' }],
          purpose: ['verification'],
          status: 'approved',
          expiryDate: '2025-12-31T23:59:59Z'
        }
      ]
    },
    {
      id: 'app-2',
      userId: user?.id || '',
      vaultId: 'vault-2',
      name: 'Financial Analysis Tool',
      description: 'Analyzes financial data for insights and reporting',
      status: 'pending',
      dataSets: [
        {
          name: 'finance_profile',
          accessToken: '',
          fields: [{ name: 'account_number' }, { name: 'transaction_history' }],
          purpose: ['analysis', 'reporting'],
          status: 'requested',
          expiryDate: '2025-10-15T23:59:59Z'
        }
      ]
    },
    {
      id: 'app-3',
      userId: user?.id || '',
      vaultId: 'vault-3',
      name: 'Customer Support Portal',
      description: 'Customer service and support management system',
      status: 'rejected',
      dataSets: [
        {
          name: 'support_tickets',
          accessToken: '',
          fields: [{ name: 'customer_id' }, { name: 'issue_details' }],
          purpose: ['support'],
          status: 'rejected',
          expiryDate: '2025-08-22T23:59:59Z'
        }
      ]
    }
  ]);

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'app-owner') {
      toast({
        title: 'Access Restricted',
        description: 'Only application owners can access this page',
        variant: 'destructive'
      });
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const getStatusBadge = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-600">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  const filteredApplications = applications.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
              <p className="text-muted-foreground">
                Manage your registered applications
              </p>
            </div>
            <Button onClick={() => navigate('/applications/new')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Register New Application
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 max-w-sm"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Applications</CardTitle>
              <CardDescription>
                Applications registered with data vaults
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredApplications.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data Sets</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.name}</TableCell>
                        <TableCell>{app.description}</TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell>{app.dataSets.length}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/applications/${app.id}`)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No applications found</p>
                </div>
              )}
            </CardContent>
            {filteredApplications.length === 0 && (
              <CardFooter className="justify-center">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/applications/new')}
                >
                  Register Your First Application
                </Button>
              </CardFooter>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Applications;
