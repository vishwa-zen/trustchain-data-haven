import { ConsentApproval, ConsentRequest, FieldLevelConsent } from "@/types";

export async function getConsentRequests(): Promise<ConsentRequest[]> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
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
          expiryDate: "2026-04-10T14:30:00Z"
        },
        {
          appId: "abc123",
          appName: "Analytics Dashboard",
          userId: "user1",
          vaultId: "vault1",
          dataSetName: "customers",
          fieldName: "phone",
          actions: ["read", "write"],
          purpose: ["Customer Communication", "Account Verification"],
          status: "requested",
          requestedAt: "2025-04-10T14:30:00Z",
          expiryDate: "2026-04-10T14:30:00Z"
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
          status: "requested",
          requestedAt: "2025-04-10T14:30:00Z",
          expiryDate: "2026-04-10T14:30:00Z"
        },
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
          expiryDate: "2026-04-12T10:15:00Z"
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
          status: "requested",
          requestedAt: "2025-04-12T10:15:00Z",
          expiryDate: "2026-04-12T10:15:00Z"
        },
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
          expiryDate: "2026-04-08T16:45:00Z"
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
          expiryDate: "2026-04-08T16:45:00Z"
        }
      ]);
    }, 500);
  });
}

export async function getAppFieldConsents(appId: string): Promise<FieldLevelConsent[]> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
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
        }
      ]);
    }, 300);
  });
}

export async function getConsentApprovalHistory(appId: string): Promise<ConsentApproval[]> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          appId,
          dataSetName: "customers",
          fieldName: "id",
          actions: ["read"],
          approved: true,
          approvedBy: "Jane Smith",
          approvedAt: "2025-04-01T10:30:00Z",
          reason: "Required for user identification"
        },
        {
          appId,
          dataSetName: "customers",
          fieldName: "name",
          actions: ["read"],
          approved: true,
          approvedBy: "Jane Smith",
          approvedAt: "2025-04-01T10:35:00Z",
          reason: "Required for user interface"
        },
        {
          appId,
          dataSetName: "transactions",
          fieldName: "amount",
          actions: ["read"],
          approved: false,
          approvedBy: "John Doe",
          approvedAt: "2025-04-02T14:20:00Z",
          reason: "Sensitive financial information"
        }
      ]);
    }, 300);
  });
}

export async function approveFieldConsent(
  appId: string,
  dataSetName: string,
  fieldName: string,
  actions: ("read" | "write")[],
  reason?: string
): Promise<void> {
  // Mock implementation
  return new Promise((resolve) => {
    console.log(`Approving field consent: ${appId} - ${dataSetName}.${fieldName} - ${actions.join(', ')}`);
    setTimeout(resolve, 500);
  });
}

export async function rejectFieldConsent(
  appId: string,
  dataSetName: string,
  fieldName: string,
  reason?: string
): Promise<void> {
  // Mock implementation
  return new Promise((resolve) => {
    console.log(`Rejecting field consent: ${appId} - ${dataSetName}.${fieldName}`);
    setTimeout(resolve, 500);
  });
}

// New function for batch approval
export async function approveBatchFieldConsent(
  appId: string,
  fields: { dataSetName: string; fieldName: string; actions: ("read" | "write")[] }[],
  reason?: string
): Promise<void> {
  // Mock implementation
  return new Promise((resolve) => {
    console.log(`Batch approving ${fields.length} fields for app ${appId}`);
    console.log(fields);
    setTimeout(resolve, 800);
  });
}

// New function for batch rejection
export async function rejectBatchFieldConsent(
  appId: string,
  fields: { dataSetName: string; fieldName: string }[],
  reason?: string
): Promise<void> {
  // Mock implementation
  return new Promise((resolve) => {
    console.log(`Batch rejecting ${fields.length} fields for app ${appId}`);
    console.log(fields);
    setTimeout(resolve, 800);
  });
}
