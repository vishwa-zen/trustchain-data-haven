
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AuditLog } from '@/types/audit-logs';
import { 
  Eye, 
  Key, 
  RefreshCw, 
  Copy, 
  Ban, 
  Plus,
  Database,
  FileText
} from 'lucide-react';

interface AuditLogsListProps {
  logs: AuditLog[];
  title?: string;
  description?: string;
  showFilters?: boolean;
}

const AuditLogsList = ({ 
  logs,
  title = "Audit Logs", 
  description = "A history of actions performed on system resources",
  showFilters = true
}: AuditLogsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string>('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <Plus className="h-4 w-4" />;
      case 'regenerate':
        return <RefreshCw className="h-4 w-4" />;
      case 'revoke':
        return <Ban className="h-4 w-4" />;
      case 'view':
        return <Eye className="h-4 w-4" />;
      case 'copy':
        return <Copy className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'access_key':
        return <Key className="h-4 w-4" />;
      case 'vault':
        return <Database className="h-4 w-4" />;
      case 'application':
        return <FileText className="h-4 w-4" />;
      case 'consent':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-500';
      case 'regenerate':
        return 'bg-blue-500';
      case 'revoke':
        return 'bg-red-500';
      case 'view':
        return 'bg-gray-500';
      case 'copy':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = !searchTerm || 
      log.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesAction = !actionFilter || log.action === actionFilter;
    const matchesResourceType = !resourceTypeFilter || log.resourceType === resourceTypeFilter;
    
    return matchesSearch && matchesAction && matchesResourceType;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <div className="flex gap-4">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="regenerate">Regenerate</SelectItem>
                  <SelectItem value="revoke">Revoke</SelectItem>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="copy">Copy</SelectItem>
                </SelectContent>
              </Select>
              <Select value={resourceTypeFilter} onValueChange={setResourceTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by resource" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All resources</SelectItem>
                  <SelectItem value="access_key">Access Keys</SelectItem>
                  <SelectItem value="vault">Vaults</SelectItem>
                  <SelectItem value="application">Applications</SelectItem>
                  <SelectItem value="consent">Consents</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge className={getActionBadgeColor(log.action)}>
                          <div className="flex items-center">
                            {getActionIcon(log.action)}
                            <span className="ml-1 capitalize">{log.action}</span>
                          </div>
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getResourceIcon(log.resourceType)}
                        <span>{log.resourceName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{log.userName}</TableCell>
                    <TableCell>{formatDate(log.timestamp)}</TableCell>
                    <TableCell className="max-w-[250px] truncate">{log.details}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center p-4">
                    No audit logs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLogsList;
