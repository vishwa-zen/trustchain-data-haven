import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Server, ShieldCheck, Clock, Key, ArrowLeft, Check, X, FileText, Shield, Copy } from 'lucide-react';
import { isAuthenticated, hasRole, getCurrentUser } from '@/lib/auth';
import { approveFieldConsent, rejectFieldConsent, getAppFieldConsents, getConsentApprovalHistory } from '@/lib/vault';
import { toast } from '@/hooks/use-toast';
import { AppRegistration, ConsentApproval, FieldLevelConsent } from '@/types';

// Extend the AppRegistration type temporarily for our local use to include token properties
interface ExtendedAppRegistration extends AppRegistration {
  accessToken?: string;
  tokenExpiryDate?: string;
}

// Define the AuditLog type for our sample logs
interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  success: boolean;
}

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<ExtendedAppRegistration | null>(null);
  const [fieldConsents, setFieldConsents] = useState<FieldLevelConsent[]>([]);
  const [consentHistory, setConsentHistory] = useState<ConsentApproval[]>([]);
  const [consentDialogOpen, setConsentDialogOpen] = useState(false);
  const [selectedConsent, setSelectedConsent] = useState<{
    dataSetName: string;
    fieldName: string;
    action: 'approve' | 'reject';
    actions: ('read' | 'write')[];
  } | null>(null);
  const [reason, setReason] = useState("");
  const [isProcessingConsent, setIsProcessingConsent] = useState(false);
  const currentUser = getCurrentUser();
  const canManageConsent = currentUser && (currentUser.role === 'admin' || currentUser.role === 'data-steward');

  // Sample audit logs data - this would typically come from an API
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Mock application data that matches the data structure in Applications.tsx but with token properties added
  const mockApplicationsData: ExtendedAppRegistration[] = [
    {
      id: 'app-1',
      name: 'KYC Application',
      description: 'Customer verification system',
      status: 'approved',
      userId: 'c7a22ea6-6fcb-40cc-8515-7f54ce47cd39',
      vaultId: '2288e11a-658f-421c-9359-79c969316303',
      dataSets: [
        {
          name: 'customers',
          status: 'approved',
          purpose: ['Analytics', 'Customer Service'],
          fields: [
            { name: 'id', actions: ['read'] },
            { name: 'name', actions: ['read'] },
            { name: 'email', actions: ['read'] },
            { name: 'phone', actions: ['read', 'write'] },
          ],
          accessToken: '',
          expiryDate: '2026-04-01T12:30:00Z'
        },
        {
          name: 'transactions',
          status: 'requested',
          purpose: ['Analytics'],
          fields: [
            { name: 'id', actions: ['read'] },
            { name: 'customer_id', actions: ['read'] },
            { name: 'amount', actions: ['read'] },
            { name: 'date', actions: ['read'] },
          ],
          accessToken: '',
          expiryDate: '2026-04-01T12:30:00Z'
        }
      ],
      accessToken: 'app_tk_123456',
      tokenExpiryDate: '2026-04-01T12:30:00Z'
    },
    {
      id: 'app-2',
      name: 'Risk Assessment Tool',
      description: 'Financial risk analysis system',
      status: 'requested',
      userId: 'c7a22ea6-6fcb-40cc-8515-7f54ce47cd39',
      vaultId: '2288e11a-658f-421c-9359-79c969316303',
      dataSets: [
        {
          name: 'risk_profiles',
          status: 'requested',
          purpose: ['Risk Analysis'],
          fields: [
            { name: 'id', actions: ['read'] },
            { name: 'customer_id', actions: ['read'] },
            { name: 'score', actions: ['read'] },
            { name: 'factors', actions: ['read'] },
          ],
          accessToken: '',
          expiryDate: '2026-05-01T12:30:00Z'
        }
      ],
      accessToken: '',
      tokenExpiryDate: ''
    },
    {
      id: 'app-3',
      name: 'Compliance Monitor',
      description: 'Regulatory compliance monitoring',
      status: 'rejected',
      userId: 'c7a22ea6-6fcb-40cc-8515-7f54ce47cd39',
      vaultId: '2288e11a-658f-421c-9359-79c969316303',
      dataSets: [
        {
          name: 'regulatory_data',
          status: 'rejected',
          purpose: ['Compliance'],
          fields: [
            { name: 'id', actions: ['read'] },
            { name: 'regulation_id', actions: ['read'] },
            { name: 'status', actions: ['read'] },
            { name: 'compliance_date', actions: ['read'] },
          ],
          accessToken: '',
          expiryDate: '2026-03-01T12:30:00Z'
        }
      ],
      accessToken: '',
      tokenExpiryDate: ''
    }
  ];
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (!hasRole(['app-owner', 'admin', 'data-steward'])) {
      navigate('/dashboard');
      return;
    }

    // Mock data fetch for the application
    const fetchApplication = async () => {
      setLoading(true);
      try {
        // Use application ID to get the correct application data
        const appData = mockApplicationsData.find(app => app.id === id) || {
          id: id || crypto.randomUUID(),
          name: 'Unknown Application',
          description: 'Application details not found',
          status: 'requested',
          userId: 'c7a22ea6-6fcb-40cc-8515-7f54ce47cd39',
          vaultId: '2288e11a-658f-421c-9359-79c969316303',
          dataSets: [],
          accessToken: '',
          tokenExpiryDate: ''
        };
        
        setApplication(appData);
        setLoading(false);
        
        // Load field consents and history
        if (id) {
          loadFieldConsents(id);
          loadConsentHistory(id);
          loadAuditLogs(id);
        }
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
  
  const loadFieldConsents = async (appId: string) => {
    try {
      const consents = await getAppFieldConsents(appId);
      setFieldConsents(consents);
    } catch (error) {
      console.error('Error loading field consents:', error);
    }
  };
  
  const loadConsentHistory = async (appId: string) => {
    try {
      const history = await getConsentApprovalHistory(appId);
      setConsentHistory(history);
    } catch (error) {
      console.error('Error loading consent history:', error);
    }
  };

  // Load sample audit logs
  const loadAuditLogs = async (appId: string) => {
    // In a real app, this would be an API call
    const now = new Date();
    
    // Generate sample logs based on the app ID
    const sampleLogs: AuditLog[] = [
      {
        id: crypto.randomUUID(),
        timestamp: new Date(now.getTime() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        action: 'ACCESS_TOKEN_GENERATED',
        user: 'john.doe@example.com',
        details: 'New access token generated for application',
        success: true,
      },
      {
        id: crypto.randomUUID(),
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        action: 'DATA_ACCESS',
        user: 'api.service',
        details: 'Accessed customers/name field via API',
        success: true,
      },
      {
        id: crypto.randomUUID(),
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        action: 'PERMISSION_UPDATE',
        user: 'admin@example.com',
        details: 'Updated permissions for transactions dataset',
        success: true,
      },
      {
        id: crypto.randomUUID(),
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        action: 'ACCESS_ATTEMPT',
        user: 'api.service',
        details: 'Unauthorized attempt to access transactions/amount field',
        success: false,
      },
      {
        id: crypto.randomUUID(),
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
        action: 'CONSENT_APPROVED',
        user: 'data.steward@example.com',
        details: 'Approved consent for customers/email field',
        success: true,
      },
      {
        id: crypto.randomUUID(),
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
        action: 'APP_REGISTRATION',
        user: 'john.doe@example.com',
        details: 'Application registered in vault system',
        success: true,
      },
    ];
    
    setAuditLogs(sampleLogs);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'requested':
        return <Badge className="bg-yellow-500">Requested</Badge>;
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
  
  const openConsentDialog = (dataSetName: string, fieldName: string, action: 'approve' | 'reject', actions: ('read' | 'write')[]) => {
    setSelectedConsent({
      dataSetName,
      fieldName,
      action,
      actions
    });
    setReason('');
    setConsentDialogOpen(true);
  };
  
  const handleConsentAction = async () => {
    if (!selectedConsent || !application?.id) return;
    
    setIsProcessingConsent(true);
    try {
      if (selectedConsent.action === 'approve') {
        await approveFieldConsent(
          application.id, 
          selectedConsent.dataSetName, 
          selectedConsent.fieldName, 
          selectedConsent.actions,
          reason
        );
        
        toast({
          title: 'Consent Approved',
          description: `Access to ${selectedConsent.fieldName} has been approved`,
        });
      } else {
        await rejectFieldConsent(
          application.id, 
          selectedConsent.dataSetName, 
          selectedConsent.fieldName, 
          reason
        );
        
        toast({
          title: 'Consent Rejected',
          description: `Access to ${selectedConsent.fieldName} has been rejected`,
        });
      }
      
      // Reload field consents and history
      await loadFieldConsents(application.id);
      await loadConsentHistory(application.id);
      
      // Reload application data
      // In a real app, we would fetch the updated application data from the API
      const updatedApp = { ...application };
      setApplication(updatedApp);
      
    } catch (error) {
      console.error('Error processing consent:', error);
      toast({
        title: 'Error',
        description: 'Failed to process consent action',
        variant: 'destructive'
      });
    } finally {
      setIsProcessingConsent(false);
      setConsentDialogOpen(false);
    }
  };
  
  const isFieldApproved = (dataSetName: string, fieldName: string): boolean => {
    return fieldConsents.some(
      c => c.dataSetName === dataSetName && 
      c.fieldName === fieldName && 
      c.approved
    );
  };
  
  const isFieldRejected = (dataSetName: string, fieldName: string): boolean => {
    return fieldConsents.some(
      c => c.dataSetName === dataSetName && 
      c.fieldName === fieldName && 
      !c.approved
    );
  };
  
  const getApprovedActions = (dataSetName: string, fieldName: string): ('read' | 'write')[] => {
    const consent = fieldConsents.find(
      c => c.dataSetName === dataSetName && 
      c.fieldName === fieldName && 
      c.approved
    );
    return consent ? consent.actions : [];
  };

  const handleRegenerateToken = () => {
    if (!application) return;
    
    const newToken = 'app_tk_' + crypto.randomUUID().split('-')[0];
    
    const updatedApp = {
      ...application,
      accessToken: newToken,
      tokenExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
    };
    
    setApplication(updatedApp);
    
    toast({
      title: 'Access Key Regenerated',
      description: 'A new application access key has been generated',
    });
  };
  
  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast({
      title: 'Access Key Copied',
      description: 'The access key has been copied to your clipboard',
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

  // Format timestamp to relative time (e.g., "5 minutes ago")
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

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
                <p className="text-2xl font-bold">Financial Data Vault</p>
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
                  <p className="text-2xl font-bold">{formatDate('2025-04-01T12:30:00Z')}</p>
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
              <TabsTrigger value="tokens">Access Keys</TabsTrigger>
              <TabsTrigger value="consent">Consent Management</TabsTrigger>
              <TabsTrigger value="audit">Audit Log</TabsTrigger>
            </TabsList>
            
            <TabsContent value="datasets" className="space-y-4 mt-6">
              {application.dataSets.map((dataSet, index) => (
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
                        {dataSet.fields.map((field, i) => (
                          <div key={i} className={`flex items-center justify-between p-2 rounded-md ${
                            isFieldApproved(dataSet.name, field.name) ? 'bg-green-50' : 
                            isFieldRejected(dataSet.name, field.name) ? 'bg-red-50' : 'bg-slate-50'
                          }`}>
                            <div className="flex items-center space-x-2">
                              {isFieldApproved(dataSet.name, field.name) ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : isFieldRejected(dataSet.name, field.name) ? (
                                <X className="h-4 w-4 text-red-500" />
                              ) : (
                                <div className="h-4 w-4 rounded-full bg-yellow-300" />
                              )}
                              <span>{field.name}</span>
                            </div>
                            
                            <div className="flex space-x-1 text-xs">
                              {field.actions.map(action => (
                                <Badge 
                                  key={action} 
                                  variant={
                                    isFieldApproved(dataSet.name, field.name) && 
                                    getApprovedActions(dataSet.name, field.name).includes(action) 
                                      ? "default" 
                                      : "outline"
                                  }
                                  className="px-1.5 py-0"
                                >
                                  {action}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-between items-center text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Expires: {formatDate(dataSet.expiryDate)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="tokens" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Access Keys</CardTitle>
                  <CardDescription>
                    Application-level access key for accessing all approved data sets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {application.status === 'approved' && application.accessToken ? (
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Application Access Key</h4>
                        <Badge className="bg-green-500">Active</Badge>
                      </div>
                      
                      <div className="bg-slate-50 p-3 rounded-md font-mono text-sm mb-2">
                        {application.accessToken}
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Expires {formatDate(application.tokenExpiryDate || '2026-04-01T12:30:00Z')}</span>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCopyToken(application.accessToken)}
                          >
                            <Copy className="h-3 w-3 mr-2" />
                            Copy
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleRegenerateToken}
                          >
                            <Key className="h-3 w-3 mr-2" />
                            Regenerate
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        {application.status !== 'approved' 
                          ? "Application must be approved before access key is available"
                          : "No access key available yet"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="consent" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-highlight-700" />
                    Consent Management
                  </CardTitle>
                  <CardDescription>
                    Manage access permissions for the application's data sets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!canManageConsent ? (
                    <Alert className="mb-4">
                      <ShieldCheck className="h-4 w-4" />
                      <AlertTitle>Access limited</AlertTitle>
                      <AlertDescription>
                        Only administrators and data stewards can manage consent.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      {application.dataSets.map((dataSet, dataSetIndex) => (
                        <div key={dataSetIndex} className="mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium">{dataSet.name}</h3>
                            {getStatusBadge(dataSet.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            Purpose: {dataSet.purpose.join(', ')}
                          </p>
                          
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Field</TableHead>
                                <TableHead>Access Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {dataSet.fields.map((field, i) => {
                                const isApproved = isFieldApproved(dataSet.name, field.name);
                                const isRejected = isFieldRejected(dataSet.name, field.name);
                                const isPending = !isApproved && !isRejected;
                                
                                return (
                                  <TableRow key={i}>
                                    <TableCell className="font-medium">{field.name}</TableCell>
                                    <TableCell>
                                      <div className="flex space-x-1">
                                        {field.actions.map(action => (
                                          <Badge key={action} variant="outline">
                                            {action}
                                          </Badge>
                                        ))}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {isApproved && (
                                        <Badge className="bg-green-500 flex items-center w-fit">
                                          <Check className="h-3 w-3 mr-1" /> Approved
                                        </Badge>
                                      )}
                                      {isRejected && (
                                        <Badge className="bg-red-500 flex items-center w-fit">
                                          <X className="h-3 w-3 mr-1" /> Rejected
                                        </Badge>
                                      )}
                                      {isPending && (
                                        <Badge className="bg-yellow-500 flex items-center w-fit">
                                          Pending
                                        </Badge>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {isPending && (
                                        <div className="flex justify-end gap-2">
                                          <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => openConsentDialog(dataSet.name, field.name, 'approve', field.actions)}
                                            className="flex items-center gap-1 border-green-500 text-green-500 hover:bg-green-50"
                                          >
                                            <Check className="h-3 w-3" /> Approve
                                          </Button>
                                          <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => openConsentDialog(dataSet.name, field.name, 'reject', [])}
                                            className="flex items-center gap-1 border-red-500 text-red-500 hover:bg-red-50"
                                          >
                                            <X className="h-3 w-3" /> Reject
                                          </Button>
                                        </div>
                                      )}
                                      {!isPending && (
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => openConsentDialog(
                                            dataSet.name, 
                                            field.name, 
                                            isApproved ? 'reject' : 'approve',
                                            isApproved ? [] : field.actions
                                          )}
                                        >
                                          Change
                                        </Button>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      ))}
                    </>
                  )}
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Consent History</h3>
                    {consentHistory.length > 0 ? (
                      <div className="space-y-4">
                        {consentHistory.map((approval, i) => (
                          <div key={i} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <p className="font-medium">
                                  {approval.dataSetName} / {approval.fieldName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(approval.approvedAt)}
                                </p>
                              </div>
                              {approval.approved ? (
                                <Badge className="bg-green-500">Approved</Badge>
                              ) : (
                                <Badge className="bg-red-500">Rejected</Badge>
                              )}
                            </div>
                            {approval.reason && (
                              <p className="text-sm border-t pt-2 mt-2">
                                Reason: {approval.reason}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-6">
                        No consent history available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="audit" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Audit Log
                  </CardTitle>
                  <CardDescription>
                    Complete history of activities related to this application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {auditLogs.length > 0 ? (
                    <>
                      <div className="rounded-md border mb-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Time</TableHead>
                              <TableHead>Action</TableHead>
                              <TableHead>User</TableHead>
                              <TableHead>Details</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {auditLogs.map((log) => (
                              <TableRow key={log.id}>
                                <TableCell className="whitespace-nowrap">
                                  <div className="flex flex-col">
                                    <span className="font-medium">{formatRelativeTime(log.timestamp)}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(log.timestamp).toLocaleString()}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="whitespace-nowrap">
                                    {log.action.replace(/_/g, ' ')}
                                  </Badge>
                                </TableCell>
                                <TableCell>{log.user}</TableCell>
                                <TableCell>{log.details}</TableCell>
                                <TableCell>
                                  {log.success ? (
                                    <Badge className="bg-green-500">Success</Badge>
                                  ) : (
                                    <Badge className="bg-red-500">Failed</Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <p className="text-muted-foreground">
                          Showing {auditLogs.length} of {auditLogs.length + 42} logs
                        </p>
                        <Button variant="outline" size="sm">
                          View All Logs
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        No audit logs available for this application
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <p className="text-xs text-muted-foreground">
                    Logs are retained for 90 days
                  </p>
                  <Button variant="outline" size="sm">
                    Export Logs
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Consent Dialog */}
          <Dialog open={consentDialogOpen} onOpenChange={setConsentDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedConsent?.action === 'approve' ? 'Approve Consent' : 'Reject Consent'}
                </DialogTitle>
                <DialogDescription>
                  {selectedConsent?.action === 'approve' 
                    ? `Allow access to ${selectedConsent?.fieldName} in ${selectedConsent?.dataSetName} dataset?`
                    : `Deny access to ${selectedConsent?.fieldName} in ${selectedConsent?.dataSetName} dataset?`
                  }
                </DialogDescription>
              </DialogHeader>
              
              {selectedConsent?.action === 'approve' && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Access Types</h3>
                  <div className="flex gap-2">
                    {selectedConsent?.actions.map(action => (
                      <Badge key={action}>{action}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <label htmlFor="reason" className="block text-sm font-medium mb-2">
                  Reason (Optional)
                </label>
                <Textarea
                  id="reason"
                  placeholder="Provide a reason for this decision"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setConsentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleConsentAction}
                  disabled={isProcessingConsent}
                  variant={selectedConsent?.action === 'approve' ? 'default' : 'destructive'}
                >
                  {isProcessingConsent 
                    ? 'Processing...' 
                    : selectedConsent?.action === 'approve'
                      ? 'Approve'
                      : 'Reject'
                  }
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default ApplicationDetail;
