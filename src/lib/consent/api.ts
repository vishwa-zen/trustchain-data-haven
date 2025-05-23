
import { ConsentRequest, ConsentApproval, GroupedConsentRequest, ConsentBatchApprovalRequest, FieldLevelConsent } from '@/types';
import { mockApiDelay } from '@/lib/utils';
import { getCurrentUser } from '@/lib/auth';
import { mockApiConsentApplications, mockApprovalHistory, mockFieldConsents } from './mock-data';
import { transformApiDataToGroupedRequests, transformGroupedToIndividualRequests } from './transformers';
import { buildConsentApprovalRequest } from './utils';

/**
 * Consent Management APIs
 */

// Get consent requests by status
export async function getConsentRequestsByStatus(status?: 'requested' | 'approved' | 'rejected'): Promise<ConsentRequest[]> {
  console.log(`API Call: Getting consent requests with status: ${status || 'all'}`);
  await mockApiDelay(500);

  // Transform grouped data to individual consent requests
  const groupedRequests = transformApiDataToGroupedRequests(mockApiConsentApplications);
  const individualRequests = transformGroupedToIndividualRequests(groupedRequests);
  
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
  
  return appId 
    ? mockApprovalHistory.filter(approval => approval.appId === appId) 
    : mockApprovalHistory;
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
  
  return mockFieldConsents(appId);
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
