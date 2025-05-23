import { ConsentApproval, ConsentRequest, FieldLevelConsent, GroupedConsentRequest, ConsentBatchApprovalRequest, ConsentRequestItem } from '@/types';
import { mockApiDelay } from '@/lib/utils';
import { getCurrentUser } from '@/lib/auth';

/**
 * Consent Management APIs
 */

// Get consent requests by status
export async function getConsentRequestsByStatus(status?: 'requested' | 'approved' | 'rejected'): Promise<ConsentRequest[]> {
  console.log(`API Call: Getting consent requests with status: ${status || 'all'}`);
  await mockApiDelay(500);

  // Mock data
  const allRequests = [
    // Analytics Dashboard app
    {
      appId: "abc123",
      appName: "Analytics Dashboard",
      userId: "user1",
      vaultId: "vault1",
      dataSetName: "customers",
      fieldName: "email",
      actions: ["read"],
      purpose: ["Customer Communication"],
      status: "requested",
      requestedAt: "2025-04-10T14:30:00Z",
      expiryDate: "2026-04-10T14:30:00Z",
      groupId: "req1"
    },
    {
      appId: "abc123",
      appName: "Analytics Dashboard",
      userId: "user1",
      vaultId: "vault1",
      dataSetName: "customers",
      fieldName: "name",
      actions: ["read", "write"],
      purpose: ["Customer Communication"],
      status: "approved",
      requestedAt: "2025-04-08T10:15:00Z",
      expiryDate: "2026-04-08T10:15:00Z",
      groupId: "req7"
    },
    {
      appId: "abc123",
      appName: "Analytics Dashboard",
      userId: "user1",
      vaultId: "vault1",
      dataSetName: "customers",
      fieldName: "address",
      actions: ["read"],
      purpose: ["Shipping"],
      status: "rejected",
      requestedAt: "2025-04-07T11:20:00Z",
      expiryDate: "2026-04-07T11:20:00Z",
      groupId: "req8"
    },
    // Customer Portal app
    {
      appId: "def456",
      appName: "Customer Portal",
      userId: "user2",
      vaultId: "vault2",
      dataSetName: "orders",
      fieldName: "amount",
      actions: ["read"],
      purpose: ["Order Processing"],
      status: "requested",
      requestedAt: "2025-04-12T10:15:00Z",
      expiryDate: "2026-04-12T10:15:00Z",
      groupId: "req3"
    },
    {
      appId: "def456",
      appName: "Customer Portal",
      userId: "user2",
      vaultId: "vault2",
      dataSetName: "orders",
      fieldName: "payment_method",
      actions: ["read"],
      purpose: ["Payment Processing"],
      status: "approved",
      requestedAt: "2025-04-09T14:35:00Z",
      expiryDate: "2026-04-09T14:35:00Z",
      groupId: "req9"
    },
    // Support System app
    {
      appId: "ghi789",
      appName: "Support System",
      userId: "user3",
      vaultId: "vault3",
      dataSetName: "tickets",
      fieldName: "status",
      actions: ["read", "write"],
      purpose: ["Customer Support"],
      status: "approved",
      requestedAt: "2025-04-08T16:45:00Z",
      expiryDate: "2026-04-08T16:45:00Z",
      groupId: "req5"
    },
    {
      appId: "ghi789",
      appName: "Support System",
      userId: "user3",
      vaultId: "vault3",
      dataSetName: "tickets",
      fieldName: "priority",
      actions: ["read", "write"],
      purpose: ["Customer Support"],
      status: "rejected",
      requestedAt: "2025-04-08T16:45:00Z",
      expiryDate: "2026-04-08T16:45:00Z",
      groupId: "req6"
    }
  ] as ConsentRequest[];

  // Filter by status if provided
  return status ? allRequests.filter(request => request.status === status) : allRequests;
}

// Get all consent requests
export async function getAllConsentRequests(): Promise<ConsentRequest[]> {
  return getConsentRequestsByStatus();
}

// Get pending consent requests
export async function getPendingConsentRequests(): Promise<ConsentRequest[]> {
  return getConsentRequestsByStatus('requested');
}

// Get approved consent requests
export async function getApprovedConsentRequests(): Promise<ConsentRequest[]> {
  return getConsentRequestsByStatus('approved');
}

// Get rejected consent requests
export async function getRejectedConsentRequests(): Promise<ConsentRequest[]> {
  return getConsentRequestsByStatus('rejected');
}

// Get consent requests by application
export async function getConsentRequestsByApp(appId: string): Promise<ConsentRequest[]> {
  console.log(`API Call: Getting consent requests for app ${appId}`);
  await mockApiDelay(500);
  
  const allRequests = await getAllConsentRequests();
  return allRequests.filter(request => request.appId === appId);
}

// Get grouped consent requests
export async function getGroupedConsentRequests(): Promise<GroupedConsentRequest[]> {
  console.log('API Call: Getting grouped consent requests');
  
  // Get all consent requests
  const requests = await getAllConsentRequests();
  
  // Group requests by their groupId
  const groupedMap = requests.reduce((acc, request) => {
    const groupId = request.groupId || request.appId + request.dataSetName + request.requestedAt;
    
    if (!acc[groupId]) {
      acc[groupId] = {
        groupId,
        appId: request.appId,
        appName: request.appName,
        dataSetName: request.dataSetName,
        fields: [],
        purpose: [...request.purpose],
        status: request.status,
        requestedAt: request.requestedAt,
        expiryDate: request.expiryDate
      };
    }
    
    // Add this field to the group
    acc[groupId].fields.push({
      fieldName: request.fieldName,
      actions: request.actions
    });
    
    // Merge purposes if needed
    request.purpose.forEach(p => {
      if (!acc[groupId].purpose.includes(p)) {
        acc[groupId].purpose.push(p);
      }
    });
    
    return acc;
  }, {} as Record<string, GroupedConsentRequest>);
  
  return Object.values(groupedMap);
}

// Get pending grouped consent requests
export async function getPendingGroupedConsentRequests(): Promise<GroupedConsentRequest[]> {
  console.log('API Call: Getting pending grouped consent requests');
  const allGrouped = await getGroupedConsentRequests();
  return allGrouped.filter(group => group.status === 'requested');
}

// Get consent approval history
export async function getConsentApprovalHistory(appId?: string): Promise<ConsentApproval[]> {
  console.log(`API Call: Getting consent approval history${appId ? ` for app ${appId}` : ''}`);
  await mockApiDelay(500);
  
  const approvals = [
    {
      appId: "abc123",
      dataSetName: "customers",
      fieldName: "name",
      actions: ["read"],
      approved: true,
      approvedBy: "Jane Smith",
      approvedAt: "2025-04-01T10:35:00Z",
      reason: "Required for user interface"
    },
    {
      appId: "abc123",
      dataSetName: "customers",
      fieldName: "email",
      actions: ["read"],
      approved: true,
      approvedBy: "Jane Smith",
      approvedAt: "2025-04-01T10:30:00Z",
      reason: "Required for user identification"
    },
    {
      appId: "abc123",
      dataSetName: "transactions",
      fieldName: "amount",
      actions: ["read"],
      approved: false,
      approvedBy: "John Doe",
      approvedAt: "2025-04-02T14:20:00Z",
      reason: "Sensitive financial information"
    },
    {
      appId: "def456",
      dataSetName: "orders",
      fieldName: "payment_method",
      actions: ["read"],
      approved: true,
      approvedBy: "Sarah Johnson",
      approvedAt: "2025-04-09T14:35:00Z",
      reason: "Required for payment processing"
    },
    {
      appId: "ghi789",
      dataSetName: "tickets",
      fieldName: "status",
      actions: ["read", "write"],
      approved: true,
      approvedBy: "Mike Wilson",
      approvedAt: "2025-04-08T16:45:00Z",
      reason: "Required for customer support"
    },
    {
      appId: "ghi789",
      dataSetName: "tickets",
      fieldName: "priority",
      actions: ["read", "write"],
      approved: false,
      approvedBy: "Mike Wilson",
      approvedAt: "2025-04-08T16:50:00Z",
      reason: "Not required for basic support functionality"
    }
  ] as ConsentApproval[];
  
  return appId ? approvals.filter(approval => approval.appId === appId) : approvals;
}

// Request new field consent
export async function requestFieldConsent(
  appId: string,
  dataSetName: string,
  fieldName: string,
  actions: ("read" | "write")[],
  purpose: string[]
): Promise<ConsentRequest> {
  console.log(`API Call: Requesting consent for ${appId} - ${dataSetName}.${fieldName} - ${actions.join(', ')}`);
  await mockApiDelay(700);
  
  // Generate a unique ID for the request
  const requestId = `req_${Math.random().toString(36).substring(2, 10)}`;
  const now = new Date();
  const expiryDate = new Date(now);
  expiryDate.setFullYear(now.getFullYear() + 1); // Expires in 1 year
  
  // Mock app info - in a real implementation, we would fetch this from the database
  const appName = "New Application";
  const userId = "current_user_id";
  const vaultId = "vault1";
  
  const newRequest: ConsentRequest = {
    appId,
    appName,
    userId,
    vaultId,
    dataSetName,
    fieldName,
    actions,
    purpose,
    status: "requested",
    requestedAt: now.toISOString(),
    expiryDate: expiryDate.toISOString(),
    groupId: requestId
  };
  
  // In a real implementation, we would save this request to a database
  
  return newRequest;
}

// Approve field consent
export async function approveFieldConsent(
  appId: string,
  dataSetName: string,
  fieldName: string,
  actions: ("read" | "write")[],
  reason?: string
): Promise<void> {
  console.log(`API Call: Approving field consent: ${appId} - ${dataSetName}.${fieldName} - ${actions.join(', ')}`);
  await mockApiDelay(500);
  
  // In a real implementation, this would update a database record
}

// Reject field consent
export async function rejectFieldConsent(
  appId: string,
  dataSetName: string,
  fieldName: string,
  reason?: string
): Promise<void> {
  console.log(`API Call: Rejecting field consent: ${appId} - ${dataSetName}.${fieldName}`);
  await mockApiDelay(500);
  
  // In a real implementation, this would update a database record
}

// New function to build consent approval request object
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
          status: "approved", // Changed from "pending" to "approved"
          expiry_date: expiryDate.toISOString().split('T')[0] + "T23:59:59Z",
          approval_status: "approved", // Changed from "pending" to "approved"
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

// Updated approveBatchFieldConsent function that accepts the entire consent request object
export async function approveBatchFieldConsent(
  appId: string,
  consentRequest: ConsentBatchApprovalRequest | { dataSetName: string; fieldName: string; actions: ("read" | "write")[] }[],
  reason?: string
): Promise<void> {
  // Check if we're passing a complete consent request object or the old format
  if (Array.isArray(consentRequest)) {
    console.log(`API Call: Batch approving ${consentRequest.length} fields for app ${appId} (old format)`);
    console.log('Fields:', consentRequest);
    
    // Get current user for the user_id
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    // In a real implementation, we would get the vault_id from somewhere
    // For now, use a mock vault ID
    const vaultId = "2288e11a-658f-421c-9359-79c969316303"; 
    
    // Create a map of selected fields in the format needed by buildConsentApprovalRequest
    const selectedFields: Record<string, {
      selected: boolean;
      readAccess: boolean;
      writeAccess: boolean;
      dataSetName: string;
      purposes?: string[];
    }> = {};
    
    consentRequest.forEach(field => {
      selectedFields[field.fieldName] = {
        selected: true,
        readAccess: field.actions.includes('read'),
        writeAccess: field.actions.includes('write'),
        dataSetName: field.dataSetName,
        purposes: ["verification", "analysis"] // Default purposes
      };
    });
    
    // Build the consent approval request
    const approvalRequest = buildConsentApprovalRequest(
      currentUser.id,
      appId,
      vaultId,
      currentUser.role === 'dpo-user' ? 'DPO-GROUP' : 'ADMIN-GROUP',
      selectedFields
    );
    
    console.log('Generated approval request payload:', approvalRequest);
    
    // TODO: In a real implementation, send the approval request to the API
    // For now, just wait a moment to simulate the API call
    await mockApiDelay(800);
  } else {
    // New format - direct ConsentBatchApprovalRequest object
    console.log(`API Call: Batch approving ${consentRequest.consents.length} fields for app ${appId} (new format)`);
    console.log('Approval request payload:', consentRequest);
    console.log('Reason:', reason);
    
    // TODO: In a real implementation, send the approval request to the API
    // For now, just wait a moment to simulate the API call
    await mockApiDelay(800);
  }
}

// Use the same pattern for rejectBatchFieldConsent
export async function rejectBatchFieldConsent(
  appId: string,
  fields: { dataSetName: string; fieldName: string }[],
  reason?: string
): Promise<void> {
  console.log(`API Call: Batch rejecting ${fields.length} fields for app ${appId}`);
  console.log('Fields:', fields);
  console.log('Reason:', reason);
  await mockApiDelay(800);
}

// Get app field consents
export async function getAppFieldConsents(appId: string): Promise<FieldLevelConsent[]> {
  console.log(`API Call: Getting field consents for app ${appId}`);
  await mockApiDelay(300);
  
  return [
    {
      appId,
      dataSetName: "customers",
      fieldName: "id",
      actions: ["read"],
      approved: true
    },
    {
      appId,
      dataSetName: "customers",
      fieldName: "name",
      actions: ["read"],
      approved: true
    },
    {
      appId,
      dataSetName: "customers",
      fieldName: "email",
      actions: ["read", "write"],
      approved: true
    },
    {
      appId,
      dataSetName: "customers",
      fieldName: "phone",
      actions: ["read"],
      approved: false
    },
    {
      appId,
      dataSetName: "transactions",
      fieldName: "id",
      actions: ["read"],
      approved: true
    },
    {
      appId,
      dataSetName: "transactions",
      fieldName: "amount",
      actions: ["read"],
      approved: false
    },
    {
      appId,
      dataSetName: "transactions",
      fieldName: "date",
      actions: ["read"],
      approved: true
    }
  ];
}

// Revoke field consent
export async function revokeFieldConsent(
  appId: string,
  dataSetName: string,
  fieldName: string,
  reason?: string
): Promise<void> {
  console.log(`API Call: Revoking field consent: ${appId} - ${dataSetName}.${fieldName}`);
  await mockApiDelay(500);
  
  // In a real implementation, this would update a database record
}
