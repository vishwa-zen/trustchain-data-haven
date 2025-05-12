import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Server, ShieldCheck, Clock, Key, ArrowLeft, Check, X } from 'lucide-react';
import { isAuthenticated, hasRole } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (!hasRole(['app-owner', 'admin', 'data-steward'])) {
      navigate('/dashboard');
      return;
    }

    // Simulated data fetch for the application
    const fetchApplication = async () => {
      setLoading(true);
      try {
        // Mock data - in a real application this would be fetched from an API
        setTimeout(() => {
          setApplication({
            id,
            name: `Demo App ${id}`,
            description: 'This is a demo application that showcases data access capabilities',
            status: 'approved',
            createdAt: '2025-04-01T12:30:00Z',
            userId: 'c7a22ea6-6fcb-40cc-8515-7f54ce47cd39',
            vaultId: 'vault-1',
            vaultName: 'Financial Data Vault',
            dataSets: [
              {
                name: 'customers',
                status: 'approved',
                purpose: ['Analytics', 'Customer Service'],
                fields: [
                  { name: 'id', approved: true },
                  { name: 'name', approved: true },
                  { name: 'email', approved: true },
                  { name: 'phone', approved: false },
                ],
                accessToken: 'dsacc_' + crypto.randomUUID().split('-')[0],
                expiryDate: '2026-04-01T12:30:00Z'
              },
              {
                name: 'transactions',
                status: 'pending',
                purpose: ['Analytics'],
                fields: [
                  { name: 'id', approved: true },
                  { name: 'customer_id', approved: true },
                  { name: 'amount', approved: true },
                  { name: 'date', approved: true },
                ],
                accessToken: 'dsacc_' + crypto.randomUUID().split('-')[0],
                expiryDate: '2026-04-01T12:30:00Z'
              }
            ]
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching application:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch application details',
          variant: 'destructive'
        });
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id, navigate]);

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

  const handleBack = () => {
    navigate('/applications');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-muted-foreground">Loading application details...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Application Not Found</h2>
                <p className="text-muted-foreground mt-2">The requested application could not be found</p>
                <Button onClick={handleBack} className="mt-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Applications
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Button variant="outline" size="sm" onClick={handleBack} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <Server className="h-6 w-6 mr-2 text-highlight-700" />
                  {application.name}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-muted-foreground">{application.description}</p>
                  {getStatusBadge(application.status)}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Vault</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{application.vaultName}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <ShieldCheck className="h-5 w-5 mr-2 text-green-500" />
                  <p className="text-2xl font-bold capitalize">{application.status}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Created On</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <p className="text-2xl font-bold">{formatDate(application.createdAt)}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Data Sets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{application.dataSets.length}</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="datasets">
            <TabsList>
              <TabsTrigger value="datasets">Data Sets</TabsTrigger>
              <TabsTrigger value="tokens">Access Tokens</TabsTrigger>
              <TabsTrigger value="audit">Audit Log</TabsTrigger>
            </TabsList>
            
            <TabsContent value="datasets" className="space-y-4 mt-6">
              {application.dataSets.map((dataSet: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center">
                        <Server className="h-5 w-5 mr-2 text-highlight-700" />
                        {dataSet.name}
                      </CardTitle>
                      {getStatusBadge(dataSet.status)}
                    </div>
                    <CardDescription>
                      Purpose: {dataSet.purpose.join(', ')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Fields</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {dataSet.fields.map((field: any, i: number) => (
                          <div key={i} className="flex items-center space-x-2 p-2 bg-slate-50 rounded-md">
                            {field.approved ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                            <span>{field.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-between items-center text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Expires: {formatDate(dataSet.expiryDate)}</span>
                      </div>
                      
                      {dataSet.status === 'approved' && (
                        <div className="flex items-center">
                          <Key className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="font-mono">{dataSet.accessToken}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="tokens" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Access Tokens</CardTitle>
                  <CardDescription>
                    These tokens allow your application to access approved data sets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {application.dataSets
                      .filter((ds: any) => ds.status === 'approved')
                      .map((dataSet: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">{dataSet.name}</h4>
                            <Badge className="bg-green-500">Active</Badge>
                          </div>
                          
                          <div className="bg-slate-50 p-3 rounded-md font-mono text-sm mb-2">
                            {dataSet.accessToken}
                          </div>
                          
                          <div className="flex justify-between items-center text-sm text-muted-foreground">
                            <span>Expires {formatDate(dataSet.expiryDate)}</span>
                            <Button variant="outline" size="sm">
                              <Key className="h-3 w-3 mr-2" />
                              Regenerate
                            </Button>
                          </div>
                        </div>
                      ))}
                    
                    {!application.dataSets.some((ds: any) => ds.status === 'approved') && (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">
                          No approved data sets available yet
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="audit" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Audit Log</CardTitle>
                  <CardDescription>
                    History of activities related to this application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      Audit log will be available soon
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default ApplicationDetail;
