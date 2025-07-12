import React, { useState } from 'react';
import { GroupedConsentRequest, ConsentBatchApprovalRequest } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Eye, EyeOff } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { approveBatchFieldConsent, rejectBatchFieldConsent } from '@/lib/consent';
import { getPurposeLabel } from '@/lib/constants';
import { toast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/lib/auth';

interface GroupedConsentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupedRequest: GroupedConsentRequest | null;
  onReload: () => void;
  renderFieldWithAccess?: (field: { fieldName: string, actions: string[] }) => React.ReactNode;
}

const GroupedConsentDialog: React.FC<GroupedConsentDialogProps> = ({
  open,
  onOpenChange,
  groupedRequest,
  onReload,
  renderFieldWithAccess
}) => {
  const [selectedFields, setSelectedFields] = useState<Record<string, {
    selected: boolean;
    readAccess: boolean;
    writeAccess: boolean;
    dataSetName: string;
  }>>({});
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  React.useEffect(() => {
    if (groupedRequest) {
      const initialFields: Record<string, {
        selected: boolean;
        readAccess: boolean;
        writeAccess: boolean;
        dataSetName: string;
      }> = {};
      
      groupedRequest.fields.forEach(field => {
        initialFields[field.fieldName] = {
          selected: true,
          readAccess: field.actions.includes('read'),
          writeAccess: field.actions.includes('write'),
          dataSetName: groupedRequest.dataSetName
        };
      });
      
      setSelectedFields(initialFields);
    }
  }, [groupedRequest]);

  const handleSelectAllChange = (checked: boolean) => {
    if (!groupedRequest) return;
    
    const updatedFields = { ...selectedFields };
    Object.keys(updatedFields).forEach(fieldName => {
      updatedFields[fieldName].selected = checked;
    });
    
    setSelectedFields(updatedFields);
  };

  const handleFieldSelectionChange = (fieldName: string, checked: boolean) => {
    setSelectedFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        selected: checked
      }
    }));
  };

  const handleAccessChange = (fieldName: string, accessType: 'readAccess' | 'writeAccess', checked: boolean) => {
    setSelectedFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        [accessType]: checked
      }
    }));
  };

  const handleApprove = async () => {
    if (!groupedRequest) return;
    
    setIsProcessing(true);
    try {
      // Get current user
      const currentUser = getCurrentUser();
      if (!currentUser) {
        toast({
          title: 'Authentication Error',
          description: 'You must be logged in to approve consent requests',
          variant: 'destructive'
        });
        setIsProcessing(false);
        return;
      }
      
      // Get all selected fields and prepare the consent request object
      const selectedFieldsData = Object.entries(selectedFields)
        .filter(([_, data]) => data.selected)
        .reduce((acc, [fieldName, data]) => {
          // Only include fields that have at least one access type selected
          if (data.readAccess || data.writeAccess) {
            acc[fieldName] = {
              selected: true,
              readAccess: data.readAccess,
              writeAccess: data.writeAccess,
              dataSetName: data.dataSetName,
              purposes: groupedRequest.purpose
            };
          }
          return acc;
        }, {} as Record<string, any>);
      
      // Check if any fields are selected
      if (Object.keys(selectedFieldsData).length === 0) {
        toast({
          title: 'No fields selected',
          description: 'Please select at least one field with read or write access',
          variant: 'destructive'
        });
        setIsProcessing(false);
        return;
      }
      
      // Calculate expiry date (1 year from now)
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      const formattedExpiryDate = `${expiryDate.toISOString().split('T')[0]}T23:59:59Z`;
      
      // Create the complete consent request object
      const consentRequest: ConsentBatchApprovalRequest = {
        user_id: currentUser.id,
        app_id: groupedRequest.appId,
        vault_id: "2288e11a-658f-421c-9359-79c969316303", // Mock vault ID 
        approver_group_name: currentUser.role === 'dpo-user' ? 'DPO-GROUP' : 'ADMIN-GROUP',
        consents: Object.entries(selectedFieldsData).map(([fieldName, data]) => {
          const accessTypes: ('read' | 'write')[] = [];
          if (data.readAccess) accessTypes.push('read');
          if (data.writeAccess) accessTypes.push('write');
          
          return {
            field_name: fieldName,
            purposes: data.purposes || ["verification", "analysis"],
            status: "approved", // Set status to "approved" instead of "pending"
            expiry_date: formattedExpiryDate,
            approval_status: "approved", // Set approval_status to "approved" instead of "pending"
            dataset_name: data.dataSetName,
            approval_threshold: 2,
            access_type: accessTypes
          };
        })
      };
      
      console.log('Generated Consent Approval Request:', consentRequest);
      
      // Pass the complete approval request object directly to the approve method
      await approveBatchFieldConsent(groupedRequest.appId, consentRequest, reason);
      
      toast({
        title: 'Consent Approved',
        description: `Access to ${consentRequest.consents.length} fields has been approved`,
      });
      
      onReload();
      onOpenChange(false);
      
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
    if (!groupedRequest) return;
    
    setIsProcessing(true);
    try {
      // Get all selected fields
      const fieldsToReject = Object.entries(selectedFields)
        .filter(([_, data]) => data.selected)
        .map(([fieldName, _]) => ({
          dataSetName: groupedRequest.dataSetName,
          fieldName
        }));
      
      if (fieldsToReject.length === 0) {
        toast({
          title: 'No fields selected',
          description: 'Please select at least one field to reject',
          variant: 'destructive'
        });
        setIsProcessing(false);
        return;
      }
      
      await rejectBatchFieldConsent(
        groupedRequest.appId,
        fieldsToReject,
        reason || `Batch rejected ${fieldsToReject.length} fields`
      );
      
      toast({
        title: 'Consent Rejected',
        description: `Access to ${fieldsToReject.length} fields has been rejected`,
      });
      
      onReload();
      onOpenChange(false);
      
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

  // Helper function to render access icons if renderFieldWithAccess not provided
  const defaultRenderFieldWithAccess = (field: { fieldName: string, actions: string[] }) => {
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

  if (!groupedRequest) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Grouped Consent Request</DialogTitle>
          <DialogDescription>
            Manage access for multiple fields in {groupedRequest?.dataSetName} dataset
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Application</h4>
            <p className="text-sm">{groupedRequest.appName}</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Purpose</h4>
            <div className="flex flex-wrap gap-1">
              {groupedRequest.purpose.map((p, i) => (
                <Badge key={i} variant="secondary">
                  {getPurposeLabel(p)}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Fields</h4>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="select-all" 
                  checked={Object.values(selectedFields).every(f => f.selected)}
                  onCheckedChange={(checked) => handleSelectAllChange(!!checked)}
                />
                <label htmlFor="select-all" className="text-xs font-medium">
                  Select All
                </label>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Field Name</TableHead>
                  <TableHead>Read</TableHead>
                  <TableHead>Write</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedRequest.fields.map(field => (
                  <TableRow key={field.fieldName}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedFields[field.fieldName]?.selected} 
                        onCheckedChange={(checked) => handleFieldSelectionChange(field.fieldName, !!checked)}
                      />
                    </TableCell>
                    <TableCell>
                      {renderFieldWithAccess ? renderFieldWithAccess(field) : defaultRenderFieldWithAccess(field)}
                    </TableCell>
                    <TableCell>
                      <Checkbox 
                        checked={selectedFields[field.fieldName]?.readAccess} 
                        onCheckedChange={(checked) => handleAccessChange(field.fieldName, 'readAccess', !!checked)}
                        disabled={!selectedFields[field.fieldName]?.selected}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox 
                        checked={selectedFields[field.fieldName]?.writeAccess} 
                        onCheckedChange={(checked) => handleAccessChange(field.fieldName, 'writeAccess', !!checked)}
                        disabled={!selectedFields[field.fieldName]?.selected}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center mt-3 justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3 text-blue-500" aria-label="Read access" />
                <span className="text-xs">Read access</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-500 font-bold text-xs">W</span>
                <span className="text-xs">Write access</span>
              </div>
              <div className="flex items-center gap-1">
                <EyeOff className="h-3 w-3 text-gray-400" aria-label="Read-only access" />
                <span className="text-xs">Read-only access</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Reason (Optional)</h4>
            <Textarea 
              placeholder="Provide a reason for your decision"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="destructive"
            onClick={handleReject}
            disabled={isProcessing}
          >
            <X className="mr-2 h-4 w-4" />
            Reject Selected
          </Button>
          <Button
            type="submit"
            onClick={handleApprove}
            disabled={isProcessing}
          >
            <Check className="mr-2 h-4 w-4" />
            Approve Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupedConsentDialog;
