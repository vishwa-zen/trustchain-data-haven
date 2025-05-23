
import { ConsentApproval, ConsentRequest, FieldLevelConsent, GroupedConsentRequest, ConsentBatchApprovalRequest, ConsentRequestItem, ApiConsentApplication } from '@/types';
import { mockApiDelay } from '@/lib/utils';
import { getCurrentUser } from '@/lib/auth';

/**
 * Consent Management APIs
 */

// Mock data in the new API format
const mockApiConsentApplications: ApiConsentApplication[] = [
  {
    id: "6822930b1d641d9f48bea60f",
    app_id: "542cd442-9e08-47dd-8f10-2211317c58cd",
    name: "KYC-App",
    description: "An application for data processing using KYC details",
    user_id: "c7a22ea6-6fcb-40cc-8515-7f54ce47cd39",
    status: "approved",
    data_sets: [
      {
        name: "user_profile",
        fields: [
          { name: "first_name", actions: ["read", "write"] },
          { name: "last_name", actions: ["read", "write"] },
          { name: "email", actions: ["read", "write"] },
          { name: "phone_number", actions: ["read", "write"] }
        ],
        purpose: ["verification", "analysis"],
        expiry_date: "2025-12-31T23:59:59Z"
      },
      {
        name: "finance_profile",
        fields: [
          { name: "pan_number", actions: ["read", "write"] },
          { name: "aadhar_number", actions: ["read", "write"] }
        ],
        purpose: ["verification", "analysis"],
        expiry_date: "2026-01-31T23:59:59Z"
      }
    ],
    created_at: "2025-05-13T00:32:11.197Z",
    updated_at: "2025-05-13T00:32:11.197Z",
    vault_id: "2288e11a-658f-421c-9359-79c969316303",
    access_token: ""
  },
  {
    id: "682293851d641d9f48bea610",
    app_id: "d07a3490-5427-4edc-9932-e1e7870aa0a1",
    name: "Customer Verification Service",
    description: "An application that reads and verifies customer identity using KYC data",
    user_id: "f91b6ec4-2c78-4cf9-a70a-5e0b91a689d4",
    status: "approved",
    data_sets: [
      {
        name: "user_profile",
        fields: [
          { name: "first_name", actions: ["read"] },
          { name: "last_name", actions: ["read"] },
          { name: "email", actions: ["read"] },
          { name: "phone_number", actions: ["read"] }
        ],
        purpose: ["verification", "analysis"],
        expiry_date: "2025-12-31T23:59:59Z"
      },
      {
        name: "finance_profile",
        fields: [
          { name: "pan_number", actions: ["read"] },
          { name: "aadhar_number", actions: ["read"] }
        ],
        purpose: ["verification", "analysis"],
        expiry_date: "2026-01-31T23:59:59Z"
      }
    ],
    created_at: "2025-05-13T00:34:13.585Z",
    updated_at: "2025-05-13T00:34:13.585Z",
    vault_id: "2288e11a-658f-421c-9359-79c969316303",
    access_token: ""
  },
  {
    id: "682f2a2588a53619f9cbfe91",
    app_id: "0d23dc0a-647c-4d6c-9bc7-6f9be750c70c",
    name: "Tax Cal 01",
    description: "Tax Cal 01",
    user_id: "c7a22ea6-6fcb-40cc-8515-7f54ce47cd39",
    status: "pending",
    data_sets: [
      {
        name: "tax_data",
        fields: [
          { name: "pan_number", actions: ["read", "write"] },
          { name: "phone_number", actions: ["read", "write"] }
        ],
        purpose: ["verification", "authorization"],
        expiry_date: "0001-01-01T00:00:00Z"
      }
    ],
    created_at: "2025-05-22T13:44:05.249Z",
    updated_at: "2025-05-22T13:44:05.249Z",
    vault_id: "bae929e9-8a33-41f1-b589-f18fe64f5fd5",
    access_token: ""
  }
];

// Transform API data to GroupedConsentRequest format
function transformApiDataToGroupedRequests(apiData: ApiConsentApplication[]): GroupedConsentRequest[] {
  const groupedRequests: GroupedConsentRequest[] = [];
  
  apiData.forEach(app => {
    app.data_sets.forEach(dataSet => {
      const groupId = `${app.app_id}_${dataSet.name}`;
      
      groupedRequests.push({
        groupId,
        appId: app.app_id,
        appName: app.name,
        dataSetName: dataSet.name,
        fields: dataSet.fields.map(field => ({
          fieldName: field.name,
          actions: field.actions
        })),
        purpose: dataSet.purpose,
        status: app.status === 'pending' ? 'requested' : app.status,
        requestedAt: app.created_at,
        expiryDate: dataSet.expiry_date
      });
    });
  });
  
  return groupedRequests;
}

// Get consent requests by status
export async function getConsentRequestsByStatus(status?: 'requested' | 'approved' | 'rejected'): Promise<ConsentRequest[]> {
  console.log(`API Call: Getting consent requests with status: ${status || 'all'}`);
  await mockApiDelay(500);

  // Transform grouped data to individual consent requests for backward compatibility
  const groupedRequests = transformApiDataToGroupedRequests(mockApiConsentApplications);
  const individualRequests: ConsentRequest[] = [];
  
  groupedRequests.forEach(group => {
    group.fields.forEach(field => {
      individualRequests.push({
        appId: group.appId,
        appName: group.appName,
        userId: "user1", // Mock user ID
        vaultId: "vault1", // Mock vault ID
        dataSetName: group.dataSetName,
        fieldName: field.fieldName,
        actions: field.actions,
        purpose: group.purpose,
        status: group.status,
        requestedAt: group.requestedAt,
        expiryDate: group.expiryDate,
        groupId: group.groupId
      });
    });
  });

  // Filter by status if provided
  return status ? individualRequests.filter(request => request.status === status) : individualRequests;
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

// Get grouped consent requests using the new API format
export async function getGroupedConsentRequests(): Promise<GroupedConsentRequest[]> {
  console.log('API Call: Getting grouped consent requests');
  await mockApiDelay(500);
  
  return transformApiDataToGroupedRequests(mockApiConsentApplications);
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
