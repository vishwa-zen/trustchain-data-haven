
import { ConsentBatchApprovalRequest, ConsentRequestItem } from '@/types';

// Build consent approval request object
export function buildConsentApprovalRequest(
  userId: string,
  appId: string,
  vaultId: string,
  approverGroupName: string,
  selectedFields: Record<string, {
    selected: boolean;
    readAccess: boolean;
    writeAccess: boolean;
    dataSetName: string;
    purposes?: string[];
  }>
): ConsentBatchApprovalRequest {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Set expiry to one year from now
  
  const consents: ConsentRequestItem[] = [];
  
  // Process each selected field
  Object.entries(selectedFields).forEach(([fieldName, fieldData]) => {
    if (fieldData.selected) {
      // Only include fields that are selected
      
      // Determine access types based on selections
      const accessTypes: ('read' | 'write')[] = [];
      if (fieldData.readAccess) accessTypes.push('read');
      if (fieldData.writeAccess) accessTypes.push('write');
      
      // Only add fields that have at least one access type selected
      if (accessTypes.length > 0) {
        consents.push({
          field_name: fieldName,
          purposes: fieldData.purposes || ["verification", "analysis"], // Default purposes if none provided
          status: "approved",
          expiry_date: expiryDate.toISOString().split('T')[0] + "T23:59:59Z",
          approval_status: "approved",
          dataset_name: fieldData.dataSetName,
          approval_threshold: 2,
          access_type: accessTypes
        });
      }
    }
  });
  
  return {
    user_id: userId,
    app_id: appId,
    vault_id: vaultId,
    approver_group_name: approverGroupName,
    consents
  };
}
