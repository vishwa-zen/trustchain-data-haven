
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Search } from 'lucide-react';
import { getGroupedConsentRequests } from '@/lib/vault';
import { isAuthenticated, hasRole } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { GroupedConsentRequest } from '@/types';
import GroupedConsentRow from '@/components/GroupedConsentRow';
import GroupedConsentDialog from '@/components/GroupedConsentDialog';

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

    if (!hasRole(['admin', 'data-steward', 'cto-user', 'dpo-user', 'csio-user'])) {
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
    try {
      const requests = await getGroupedConsentRequests();
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <Shield className="h-6 w-6 mr-2 text-highlight-700" />
              Grouped Consent Management
            </h1>
            <p className="text-muted-foreground">
              Approve or reject grouped access requests for multiple fields
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
                          />
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Similar TabsContent components for pending, approved, and rejected tabs */}
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
                            />
                          ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Additional tabs omitted for brevity */}
          </Tabs>
          
          {/* Dialog for managing consent details */}
          <GroupedConsentDialog
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
            groupedRequest={selectedGroupedRequest}
            onReload={loadGroupedConsentRequests}
          />
        </main>
      </div>
    </div>
  );
};

export default GroupedConsentPage;
