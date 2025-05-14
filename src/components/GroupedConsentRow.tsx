
import React, { useState } from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GroupedConsentRequest } from '@/types';
import { Clock, ArrowUpRight, Check, X } from 'lucide-react';
import { approveFieldConsent, rejectFieldConsent, approveBatchFieldConsent, rejectBatchFieldConsent } from '@/lib/vault';
import { toast } from '@/hooks/use-toast';

interface GroupedConsentRowProps {
  group: GroupedConsentRequest;
  onReload: () => void;
  onViewApp: (appId: string) => void;
  onOpenDetail: (groupId: string) => void;
}

const GroupedConsentRow: React.FC<GroupedConsentRowProps> = ({ 
  group, 
  onReload, 
  onViewApp,
  onOpenDetail
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      // Convert the group fields to the format expected by the batch approve API
      const fieldConsents = group.fields.map(field => ({
        dataSetName: group.dataSetName,
        fieldName: field.fieldName,
        actions: field.actions
      }));
      
      await approveBatchFieldConsent(
        group.appId, 
        fieldConsents,
        `Batch approved ${fieldConsents.length} fields`
      );
      
      toast({
        title: 'Consent Approved',
        description: `Access to ${group.fields.length} fields has been approved`,
      });
      
      onReload();
      
    } catch (error) {
      console.error('Error approving consent:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve consent',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      // Convert the group fields to the format expected by the batch reject API
      const fieldConsents = group.fields.map(field => ({
        dataSetName: group.dataSetName,
        fieldName: field.fieldName
      }));
      
      await rejectBatchFieldConsent(
        group.appId, 
        fieldConsents,
        `Batch rejected ${fieldConsents.length} fields`
      );
      
      toast({
        title: 'Consent Rejected',
        description: `Access to ${group.fields.length} fields has been rejected`,
      });
      
      onReload();
      
    } catch (error) {
      console.error('Error rejecting consent:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject consent',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center">
          <Button
            variant="link" 
            className="h-auto p-0 text-left justify-start" 
            onClick={() => onViewApp(group.appId)}
          >
            {group.appName}
            <ArrowUpRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span>{group.dataSetName}</span>
          <span className="text-xs text-muted-foreground">
            {group.fields.map(f => f.fieldName).join(', ')}
            <Badge variant="outline" className="ml-1 text-xs">
              {group.fields.length} fields
            </Badge>
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          {/* Show unique actions across all fields */}
          {Array.from(new Set(group.fields.flatMap(f => f.actions))).map(action => (
            <Badge key={action} variant="outline" className="text-xs">
              {action}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {group.purpose.map((p, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {p}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        {getStatusBadge(group.status)}
      </TableCell>
      <TableCell>
        <div className="flex items-center text-sm">
          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
          {formatDate(group.expiryDate)}
        </div>
      </TableCell>
      <TableCell>
        {group.status === 'requested' && (
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onOpenDetail(group.groupId)}
              className="flex items-center gap-1 border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              Details
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleApprove}
              disabled={isProcessing}
              className="flex items-center gap-1 border-green-500 text-green-500 hover:bg-green-50"
            >
              <Check className="h-3 w-3" /> 
              {isProcessing ? '...' : 'Approve'}
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleReject}
              disabled={isProcessing}
              className="flex items-center gap-1 border-red-500 text-red-500 hover:bg-red-50"
            >
              <X className="h-3 w-3" /> 
              {isProcessing ? '...' : 'Reject'}
            </Button>
          </div>
        )}
        {group.status !== 'requested' && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewApp(group.appId)}
          >
            View
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default GroupedConsentRow;
