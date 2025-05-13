
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Search, Check, X, Clock, ArrowUpRight } from 'lucide-react';
import { getConsentRequests, approveFieldConsent, rejectFieldConsent } from '@/lib/vault';
import { isAuthenticated, hasRole, getCurrentUser } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { ConsentRequest } from '@/types';

const ConsentManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [consentRequests, setConsentRequests] = useState<ConsentRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ConsentRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [processingConsent, setProcessingConsent] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ConsentRequest | null>(null);
  const [consentReason, setConsentReason] = useState('');
  const [selectedActions, setSelectedActions] = useState<('read' | 'write')[]>([]);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (!hasRole(['admin', 'data-steward'])) {
      toast({
        title: 'Access Restricted',
        description: 'Only administrators and data stewards can access this page',
        variant: 'destructive'
      });
      navigate('/dashboard');
      return;
    }

    loadConsentRequests();
  }, [navigate]);

  useEffect(() => {
    applyFilters();
  }, [consentRequests, statusFilter, searchTerm]);

  const loadConsentRequests = async () => {
    setLoading(true);
    try {
      const requests = await getConsentRequests();
      setConsentRequests(requests);
      setFilteredRequests(requests);
    } catch (error) {
      console.error('Error loading consent requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load consent requests',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...consentRequests];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        req => req.appName.toLowerCase().includes(term) || 
               req.dataSetName.toLowerCase().includes(term) || 
               req.fieldName.toLowerCase().includes(term)
      );
    }

    setFilteredRequests(filtered);
  };

  const handleApprove = async (request: ConsentRequest) => {
    if (!request.appId) return;
    
    setProcessingConsent(request.appId + request.fieldName);
    try {
      await approveFieldConsent(
        request.appId, 
        request.dataSetName, 
        request.fieldName, 
        request.actions,
        'Approved by consent management'
      );
      
      toast({
        title: 'Consent Approved',
        description: `Access to ${request.fieldName} has been approved`,
      });
      
      // Reload consent requests
      await loadConsentRequests();
      
    } catch (error) {
      console.error('Error approving consent:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve consent',
        variant: 'destructive'
      });
    } finally {
      setProcessingConsent(null);
    }
  };

  const handleReject = async (request: ConsentRequest) => {
    if (!request.appId) return;
    
    setProcessingConsent(request.appId + request.fieldName);
    try {
      await rejectFieldConsent(
        request.appId, 
        request.dataSetName, 
        request.fieldName, 
        'Rejected by consent management'
      );
      
      toast({
        title: 'Consent Rejected',
        description: `Access to ${request.fieldName} has been rejected`,
      });
      
      // Reload consent requests
      await loadConsentRequests();
      
    } catch (error) {
      console.error('Error rejecting consent:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject consent',
        variant: 'destructive'
      });
    } finally {
      setProcessingConsent(null);
    }
  };

  const openDetailDialog = (request: ConsentRequest) => {
    setSelectedRequest(request);
    setSelectedActions([...request.actions]);
    setConsentReason('');
    setDialogOpen(true);
  };

  const handleActionToggle = (action: 'read' | 'write') => {
    if (selectedActions.includes(action)) {
      setSelectedActions(selectedActions.filter(a => a !== action));
    } else {
      setSelectedActions([...selectedActions, action]);
    }
  };

  const handleDetailApprove = async () => {
    if (!selectedRequest || !selectedRequest.appId) return;
    
    setProcessingConsent(selectedRequest.appId + selectedRequest.fieldName);
    try {
      await approveFieldConsent(
        selectedRequest.appId, 
        selectedRequest.dataSetName, 
        selectedRequest.fieldName, 
        selectedActions,
        consentReason || 'Approved with customized permissions'
      );
      
      toast({
        title: 'Consent Approved',
        description: `Modified access to ${selectedRequest.fieldName} has been approved`,
      });
      
      // Reload consent requests
      await loadConsentRequests();
      setDialogOpen(false);
      
    } catch (error) {
      console.error('Error approving consent:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve consent',
        variant: 'destructive'
      });
    } finally {
      setProcessingConsent(null);
    }
  };

  const handleDetailReject = async () => {
    if (!selectedRequest || !selectedRequest.appId) return;
    
    setProcessingConsent(selectedRequest.appId + selectedRequest.fieldName);
    try {
      await rejectFieldConsent(
        selectedRequest.appId, 
        selectedRequest.dataSetName, 
        selectedRequest.fieldName, 
        consentReason || 'Rejected through detailed review'
      );
      
      toast({
        title: 'Consent Rejected',
        description: `Access to ${selectedRequest.fieldName} has been rejected`,
      });
      
      // Reload consent requests
      await loadConsentRequests();
      setDialogOpen(false);
      
    } catch (error) {
      console.error('Error rejecting consent:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject consent',
        variant: 'destructive'
      });
    } finally {
      setProcessingConsent(null);
    }
  };

  const handleViewApp = (appId: string) => {
    navigate(`/applications/${appId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'requested':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <Shield className="h-6 w-6 mr-2 text-highlight-700" />
              Consent Management
            </h1>
            <p className="text-muted-foreground">
              Approve or reject access requests based on specified purposes and compliance requirements
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Filter Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by app, dataset or field"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="w-full sm:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="requested">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Consent Requests</CardTitle>
                  <CardDescription>
                    All requests for data access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">Loading requests...</p>
                    </div>
                  ) : filteredRequests.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No consent requests found</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Application</TableHead>
                          <TableHead>Dataset / Field</TableHead>
                          <TableHead>Access Type</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Expiry</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRequests.map((request, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <Button
                                  variant="link" 
                                  className="h-auto p-0 text-left justify-start" 
                                  onClick={() => handleViewApp(request.appId)}
                                >
                                  {request.appName}
                                  <ArrowUpRight className="h-3 w-3 ml-1" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{request.dataSetName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {request.fieldName}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {request.actions.map(action => (
                                  <Badge key={action} variant="outline" className="text-xs">
                                    {action}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {request.purpose.map((p, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {p}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(request.status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center text-sm">
                                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                {formatDate(request.expiryDate)}
                              </div>
                            </TableCell>
                            <TableCell>
                              {request.status === 'requested' && (
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => openDetailDialog(request)}
                                    className="flex items-center gap-1 border-blue-500 text-blue-500 hover:bg-blue-50"
                                  >
                                    Details
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleApprove(request)}
                                    disabled={processingConsent === request.appId + request.fieldName}
                                    className="flex items-center gap-1 border-green-500 text-green-500 hover:bg-green-50"
                                  >
                                    <Check className="h-3 w-3" /> 
                                    {processingConsent === request.appId + request.fieldName ? '...' : 'Approve'}
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleReject(request)}
                                    disabled={processingConsent === request.appId + request.fieldName}
                                    className="flex items-center gap-1 border-red-500 text-red-500 hover:bg-red-50"
                                  >
                                    <X className="h-3 w-3" /> 
                                    {processingConsent === request.appId + request.fieldName ? '...' : 'Reject'}
                                  </Button>
                                </div>
                              )}
                              {request.status !== 'requested' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleViewApp(request.appId)}
                                >
                                  View
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pending" className="mt-6">
              {/* Similar content as "all" but filtered for pending requests */}
              <Card>
                <CardHeader>
                  <CardTitle>Pending Consent Requests</CardTitle>
                  <CardDescription>
                    Requests awaiting approval or rejection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">Loading requests...</p>
                    </div>
                  ) : filteredRequests.filter(r => r.status === 'requested').length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No pending requests found</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Application</TableHead>
                          <TableHead>Dataset / Field</TableHead>
                          <TableHead>Access Type</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Expiry</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRequests
                          .filter(r => r.status === 'requested')
                          .map((request, index) => (
                            <TableRow key={index}>
                              {/* Same row content as the "all" tab */}
                              <TableCell className="font-medium">
                                <div className="flex items-center">
                                  <Button
                                    variant="link" 
                                    className="h-auto p-0 text-left justify-start" 
                                    onClick={() => handleViewApp(request.appId)}
                                  >
                                    {request.appName}
                                    <ArrowUpRight className="h-3 w-3 ml-1" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span>{request.dataSetName}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {request.fieldName}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  {request.actions.map(action => (
                                    <Badge key={action} variant="outline" className="text-xs">
                                      {action}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {request.purpose.map((p, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {p}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center text-sm">
                                  <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                  {formatDate(request.expiryDate)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => openDetailDialog(request)}
                                    className="flex items-center gap-1 border-blue-500 text-blue-500 hover:bg-blue-50"
                                  >
                                    Details
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleApprove(request)}
                                    disabled={processingConsent === request.appId + request.fieldName}
                                    className="flex items-center gap-1 border-green-500 text-green-500 hover:bg-green-50"
                                  >
                                    <Check className="h-3 w-3" /> 
                                    {processingConsent === request.appId + request.fieldName ? '...' : 'Approve'}
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleReject(request)}
                                    disabled={processingConsent === request.appId + request.fieldName}
                                    className="flex items-center gap-1 border-red-500 text-red-500 hover:bg-red-50"
                                  >
                                    <X className="h-3 w-3" /> 
                                    {processingConsent === request.appId + request.fieldName ? '...' : 'Reject'}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="approved" className="mt-6">
              {/* Similar content as "all" but filtered for approved requests */}
              <Card>
                <CardHeader>
                  <CardTitle>Approved Consent Requests</CardTitle>
                  <CardDescription>
                    Requests that have been approved
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">Loading requests...</p>
                    </div>
                  ) : filteredRequests.filter(r => r.status === 'approved').length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No approved requests found</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Application</TableHead>
                          <TableHead>Dataset / Field</TableHead>
                          <TableHead>Access Type</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Expiry</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRequests
                          .filter(r => r.status === 'approved')
                          .map((request, index) => (
                            <TableRow key={index}>
                              {/* Similar row content as the "all" tab */}
                              <TableCell className="font-medium">
                                {request.appName}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span>{request.dataSetName}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {request.fieldName}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  {request.actions.map(action => (
                                    <Badge key={action} variant="outline" className="text-xs">
                                      {action}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {request.purpose.map((p, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {p}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center text-sm">
                                  <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                  {formatDate(request.expiryDate)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleViewApp(request.appId)}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="rejected" className="mt-6">
              {/* Similar content as "all" but filtered for rejected requests */}
              <Card>
                <CardHeader>
                  <CardTitle>Rejected Consent Requests</CardTitle>
                  <CardDescription>
                    Requests that have been rejected
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">Loading requests...</p>
                    </div>
                  ) : filteredRequests.filter(r => r.status === 'rejected').length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No rejected requests found</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Application</TableHead>
                          <TableHead>Dataset / Field</TableHead>
                          <TableHead>Access Type</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Expiry</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRequests
                          .filter(r => r.status === 'rejected')
                          .map((request, index) => (
                            <TableRow key={index}>
                              {/* Similar row content as the "all" tab */}
                              <TableCell className="font-medium">
                                {request.appName}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span>{request.dataSetName}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {request.fieldName}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  {request.actions.map(action => (
                                    <Badge key={action} variant="outline" className="text-xs">
                                      {action}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {request.purpose.map((p, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {p}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center text-sm">
                                  <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                  {formatDate(request.expiryDate)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleViewApp(request.appId)}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Detail Dialog for Field-Level Consent Management */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Field-Level Consent Management</DialogTitle>
                <DialogDescription>
                  {selectedRequest && (
                    <>Manage access for {selectedRequest.fieldName} in {selectedRequest.dataSetName}</>
                  )}
                </DialogDescription>
              </DialogHeader>
              
              {selectedRequest && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Application</h4>
                    <p className="text-sm">{selectedRequest.appName}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Purpose</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedRequest.purpose.map((p, i) => (
                        <Badge key={i} variant="secondary">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Access Permissions</h4>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="read-permission" 
                          checked={selectedActions.includes('read')}
                          onCheckedChange={() => handleActionToggle('read')}
                        />
                        <label 
                          htmlFor="read-permission" 
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Read Access
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="write-permission" 
                          checked={selectedActions.includes('write')}
                          onCheckedChange={() => handleActionToggle('write')}
                        />
                        <label 
                          htmlFor="write-permission" 
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Write Access
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Reason (Optional)</h4>
                    <Textarea 
                      placeholder="Provide a reason for your decision"
                      value={consentReason}
                      onChange={(e) => setConsentReason(e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              <DialogFooter className="sm:justify-between">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDetailReject}
                  disabled={processingConsent === selectedRequest?.appId + selectedRequest?.fieldName}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  type="submit"
                  onClick={handleDetailApprove}
                  disabled={processingConsent === selectedRequest?.appId + selectedRequest?.fieldName || selectedActions.length === 0}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve Selected Permissions
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default ConsentManagement;
