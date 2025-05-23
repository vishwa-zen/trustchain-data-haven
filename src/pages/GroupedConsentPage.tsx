import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AppSidebar from '@/components/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Search, Eye, EyeOff } from 'lucide-react';
import { isAuthenticated, hasRole } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { GroupedConsentRequest } from '@/types';
import GroupedConsentRow from '@/components/GroupedConsentRow';
import GroupedConsentDialog from '@/components/GroupedConsentDialog';
import { getGroupedConsentRequests, ConsentApplication, fetchConsentApplications } from '@/lib/consent';
import { getApiBaseUrl } from '@/lib/config';

const GroupedConsentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [groupedRequests, setGroupedRequests] = useState<GroupedConsentRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<GroupedConsentRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for detailed view dialog
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedGroupedRequest, setSelectedGroupedRequest] = useState<GroupedConsentRequest | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (!hasRole(['admin', 'cto-user', 'dpo-user', 'csio-user'])) {
      toast({
        title: 'Access Restricted',
        description: 'You do not have permission to access this page',
        variant: 'destructive'
      });
      navigate('/dashboard');
      return;
    }

    loadGroupedConsentRequests();
  }, [navigate]);

  useEffect(() => {
    applyFilters();
  }, [groupedRequests, statusFilter, searchTerm]);

  const loadGroupedConsentRequests = async () => {
    setLoading(true);
    console.log("Loading consent requests...");
    try {
      // First try to fetch from the real API
      let requests: GroupedConsentRequest[] = [];
      try {
        const apiUrl = `${getApiBaseUrl()}/trustchain/v1/consents`;
        console.log("Fetching from API:", apiUrl);
        const consentApps = await fetchConsentApplications(apiUrl);
        console.log("API response:", consentApps);
        
        // Convert ConsentApplication objects to GroupedConsentRequest format
        const groupedRequests: GroupedConsentRequest[] = [];
        consentApps.forEach(app => {
          const appRequests = app.toGroupedConsentRequests();
          groupedRequests.push(...appRequests);
        });
        requests = groupedRequests;
      } catch (apiError) {
        console.error("API error, falling back to mock data:", apiError);
        // Fall back to mock data if API fails
        requests = await getGroupedConsentRequests();
      }
      
      console.log("Setting grouped requests:", requests);
      setGroupedRequests(requests);
      setFilteredRequests(requests);
    } catch (error) {
      console.error('Error loading grouped consent requests:', error);
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
    let filtered = [...groupedRequests];

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
               req.fields.some(f => f.fieldName.toLowerCase().includes(term))
      );
    }

    setFilteredRequests(filtered);
  };

  const handleViewApp = (appId: string) => {
    navigate(`/applications/${appId}`);
  };

  const openDetailDialog = (groupId: string) => {
    const request = groupedRequests.find(r => r.groupId === groupId);
    if (request) {
      setSelectedGroupedRequest(request);
      setDetailDialogOpen(true);
    }
  };

  // Helper function to render field with access icons
  const renderFieldWithAccess = (field: { fieldName: string, actions: string[] }) => {
    const hasRead = field.actions.includes('read');
    const hasWrite = field.actions.includes('write');
    
    return (
      <div className="flex items-center justify-between">
        <span>{field.fieldName}</span>
        <div className="flex space-x-1">
          {hasRead && <Eye className="h-3 w-3 text-blue-500" aria-label="Read access" />}
          {hasWrite && <span className="text-green-500 font-bold text-xs ml-1">W</span>}
          {!hasWrite && hasRead && <EyeOff className="h-3 w-3 text-gray-400" aria-label="Read-only access" />}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex w-full h-full">
        <Navbar />
        <AppSidebar />
        <main className="flex-1 p-6 pt-20 overflow-auto">
          <div className="page-container">
            <div className="content-section">
              <h1 className="text-2xl font-bold flex items-center">
                <Shield className="h-6 w-6 mr-2 text-highlight-700" />
                Grouped Consent Management
              </h1>
              <p className="text-muted-foreground">
                Approve or reject grouped access requests for multiple fields
              </p>
              
              {/* Add a legend to explain the icons */}
              <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3 text-blue-500" aria-label="Read access" />
                  <span>Read access</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-green-500 font-bold text-xs">W</span>
                  <span>Write access</span>
                </div>
                <div className="flex items-center space-x-1">
                  <EyeOff className="h-3 w-3 text-gray-400" aria-label="Read-only access" />
                  <span>Read-only</span>
                </div>
              </div>
            </div>

            <div className="content-section">
              <Card>
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
            </div>

            <div className="content-section">
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
                      <CardTitle>Grouped Consent Requests</CardTitle>
                      <CardDescription>
                        All grouped requests for data access
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
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Application</TableHead>
                                <TableHead>Dataset / Fields</TableHead>
                                <TableHead>Access Type</TableHead>
                                <TableHead>Purpose</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Expiry</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredRequests.map((group) => (
                                <GroupedConsentRow
                                  key={group.groupId}
                                  group={group}
                                  onReload={loadGroupedConsentRequests}
                                  onViewApp={handleViewApp}
                                  onOpenDetail={openDetailDialog}
                                  renderFieldWithAccess={renderFieldWithAccess}
                                />
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="pending" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pending Grouped Consent Requests</CardTitle>
                      <CardDescription>
                        Grouped requests awaiting approval or rejection
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">Loading requests...</p>
                        </div>
                      ) : filteredRequests.filter(r => r.status === 'requested').length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">No pending grouped requests found</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Application</TableHead>
                                <TableHead>Dataset / Fields</TableHead>
                                <TableHead>Access Type</TableHead>
                                <TableHead>Purpose</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Expiry</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredRequests
                                .filter(r => r.status === 'requested')
                                .map((group) => (
                                  <GroupedConsentRow
                                    key={group.groupId}
                                    group={group}
                                    onReload={loadGroupedConsentRequests}
                                    onViewApp={handleViewApp}
                                    onOpenDetail={openDetailDialog}
                                    renderFieldWithAccess={renderFieldWithAccess}
                                  />
                                ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Additional tabs omitted for brevity */}
              </Tabs>
            </div>
            
            {/* Dialog for managing consent details */}
            <GroupedConsentDialog
              open={detailDialogOpen}
              onOpenChange={setDetailDialogOpen}
              groupedRequest={selectedGroupedRequest}
              onReload={loadGroupedConsentRequests}
              renderFieldWithAccess={renderFieldWithAccess}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default GroupedConsentPage;
