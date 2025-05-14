
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, ArrowRight } from 'lucide-react';
import { BatchFieldConsent } from '@/types';

interface BatchConsentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appId: string;
  appName: string;
  fields: BatchFieldConsent[];
  onApprove: (fields: BatchFieldConsent[], reason: string) => Promise<void>;
  onReject: (fields: BatchFieldConsent[], reason: string) => Promise<void>;
  isProcessing: boolean;
}

const BatchConsentDialog: React.FC<BatchConsentDialogProps> = ({
  open,
  onOpenChange,
  appId,
  appName,
  fields,
  onApprove,
  onReject,
  isProcessing
}) => {
  const [reason, setReason] = useState('');
  const [batchFields, setBatchFields] = useState<BatchFieldConsent[]>(fields);
  
  const handleSelectAll = (checked: boolean) => {
    setBatchFields(batchFields.map(field => ({
      ...field,
      selected: checked
    })));
  };
  
  const handleSelectField = (fieldKey: string, checked: boolean) => {
    setBatchFields(batchFields.map(field => 
      field.fieldKey === fieldKey ? { ...field, selected: checked } : field
    ));
  };
  
  const handleToggleAccess = (fieldKey: string, accessType: 'read' | 'write') => {
    setBatchFields(batchFields.map(field => {
      if (field.fieldKey === fieldKey) {
        if (accessType === 'read') {
          return { ...field, readAccess: !field.readAccess };
        } else {
          return { ...field, writeAccess: !field.writeAccess };
        }
      }
      return field;
    }));
  };
  
  const handleBatchApprove = async () => {
    const selectedFields = batchFields.filter(field => field.selected);
    if (selectedFields.length === 0) return;
    
    await onApprove(selectedFields, reason);
  };
  
  const handleBatchReject = async () => {
    const selectedFields = batchFields.filter(field => field.selected);
    if (selectedFields.length === 0) return;
    
    await onReject(selectedFields, reason);
  };
  
  const allSelected = batchFields.every(field => field.selected);
  const someSelected = batchFields.some(field => field.selected);
  const noneSelected = !someSelected;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Batch Consent Management</DialogTitle>
          <DialogDescription>
            Approve or reject multiple fields for {appName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4 max-h-[60vh] overflow-auto">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox 
              id="select-all"
              checked={allSelected} 
              onCheckedChange={(checked) => handleSelectAll(!!checked)}
            />
            <label htmlFor="select-all" className="text-sm font-medium">
              Select All Fields
            </label>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Select</TableHead>
                <TableHead>Dataset</TableHead>
                <TableHead>Field</TableHead>
                <TableHead className="text-center">Read Access</TableHead>
                <TableHead className="text-center">Write Access</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batchFields.map((field) => (
                <TableRow key={field.fieldKey}>
                  <TableCell>
                    <Checkbox 
                      checked={field.selected}
                      onCheckedChange={(checked) => handleSelectField(field.fieldKey, !!checked)}
                    />
                  </TableCell>
                  <TableCell>{field.dataSetName}</TableCell>
                  <TableCell>{field.fieldName}</TableCell>
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={field.readAccess}
                      onCheckedChange={() => handleToggleAccess(field.fieldKey, 'read')}
                      disabled={!field.selected}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={field.writeAccess}
                      onCheckedChange={() => handleToggleAccess(field.fieldKey, 'write')}
                      disabled={!field.selected}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">
              Reason (Optional)
            </label>
            <Textarea
              id="reason"
              placeholder="Provide a reason for this decision"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            {someSelected ? 
              `${batchFields.filter(f => f.selected).length} fields selected` :
              "No fields selected"
            }
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBatchReject}
              disabled={isProcessing || noneSelected}
              className="flex items-center"
            >
              <X className="mr-2 h-4 w-4" />
              Reject Selected
            </Button>
            <Button
              onClick={handleBatchApprove}
              disabled={isProcessing || noneSelected}
              className="flex items-center"
            >
              <Check className="mr-2 h-4 w-4" />
              Approve Selected
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BatchConsentDialog;
