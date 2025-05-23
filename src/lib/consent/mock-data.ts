import { ApiConsentApplication } from '@/types';

// Mock data using the provided API response
export const mockApiConsentApplications: ApiConsentApplication[] = [
  {
    "id": "6822930b1d641d9f48bea60f",
    "app_id": "542cd442-9e08-47dd-8f10-2211317c58cd",
    "name": "KYC-App",
    "description": "An application for data processing using KYC details",
    "user_id": "c7a22ea6-6fcb-40cc-8515-7f54ce47cd39",
    "status": "approved",
    "data_sets": [
      {
        "name": "user_profile",
        "fields": [
          { "name": "first_name", "actions": ["read"] as ('read' | 'write')[] },
          { "name": "last_name", "actions": ["read"] as ('read' | 'write')[] },
          { "name": "email", "actions": ["read", "write"] as ('read' | 'write')[] },
          { "name": "phone_number", "actions": ["read", "write"] as ('read' | 'write')[] }
        ],
        "purpose": ["verification", "analysis"],
        "expiry_date": "2025-12-31T23:59:59Z"
      },
      {
        "name": "finance_profile",
        "fields": [
          { "name": "pan_number", "actions": ["read", "write"] as ('read' | 'write')[] },
          { "name": "aadhar_number", "actions": ["read", "write"] as ('read' | 'write')[] }
        ],
        "purpose": ["verification", "analysis"],
        "expiry_date": "2026-01-31T23:59:59Z"
      }
    ],
    "created_at": "2025-05-13T00:32:11.197Z",
    "updated_at": "2025-05-13T00:32:11.197Z",
    "vault_id": "2288e11a-658f-421c-9359-79c969316303",
    "access_token": ""
  },
  {
    "id": "682293851d641d9f48bea610",
    "app_id": "d07a3490-5427-4edc-9932-e1e7870aa0a1",
    "name": "Customer Verification Service",
    "description": "An application that reads and verifies customer identity using KYC data",
    "user_id": "f91b6ec4-2c78-4cf9-a70a-5e0b91a689d4",
    "status": "approved",
    "data_sets": [
      {
        "name": "user_profile",
        "fields": [
          { "name": "first_name", "actions": ["read"] as ('read' | 'write')[] },
          { "name": "last_name", "actions": ["read"] as ('read' | 'write')[] },
          { "name": "email", "actions": ["read"] as ('read' | 'write')[] },
          { "name": "phone_number", "actions": ["read"] as ('read' | 'write')[] }
        ],
        "purpose": ["verification", "analysis"],
        "expiry_date": "2025-12-31T23:59:59Z"
      },
      {
        "name": "finance_profile",
        "fields": [
          { "name": "pan_number", "actions": ["read"] as ('read' | 'write')[] },
          { "name": "aadhar_number", "actions": ["read"] as ('read' | 'write')[] }
        ],
        "purpose": ["verification", "analysis"],
        "expiry_date": "2026-01-31T23:59:59Z"
      }
    ],
    "created_at": "2025-05-13T00:34:13.585Z",
    "updated_at": "2025-05-13T00:34:13.585Z",
    "vault_id": "2288e11a-658f-421c-9359-79c969316303",
    "access_token": ""
  },
  {
    "id": "682f2a2588a53619f9cbfe91",
    "app_id": "0d23dc0a-647c-4d6c-9bc7-6f9be750c70c",
    "name": "Tax Cal 01",
    "description": "Tax Cal 01",
    "user_id": "c7a22ea6-6fcb-40cc-8515-7f54ce47cd39",
    "status": "pending",
    "data_sets": [
      {
        "name": "tax_data",
        "fields": [
          { "name": "pan_number", "actions": ["read", "write"] as ('read' | 'write')[] },
          { "name": "phone_number", "actions": ["read", "write"] as ('read' | 'write')[] }
        ],
        "purpose": ["verification", "authorization"],
        "expiry_date": "0001-01-01T00:00:00Z"
      }
    ],
    "created_at": "2025-05-22T13:44:05.249Z",
    "updated_at": "2025-05-22T13:44:05.249Z",
    "vault_id": "bae929e9-8a33-41f1-b589-f18fe64f5fd5",
    "access_token": ""
  }
];

// Mock approval history data - fixing the actions type here
export const mockApprovalHistory = [
  {
    appId: "abc123",
    dataSetName: "customers",
    fieldName: "name",
    actions: ["read"] as ('read' | 'write')[],
    approved: true,
    approvedBy: "Jane Smith",
    approvedAt: "2025-04-01T10:35:00Z",
    reason: "Required for user interface"
  },
  {
    appId: "abc123",
    dataSetName: "customers",
    fieldName: "email",
    actions: ["read"] as ('read' | 'write')[],
    approved: true,
    approvedBy: "Jane Smith",
    approvedAt: "2025-04-01T10:30:00Z",
    reason: "Required for user identification"
  },
  {
    appId: "abc123",
    dataSetName: "transactions",
    fieldName: "amount",
    actions: ["read"] as ('read' | 'write')[],
    approved: false,
    approvedBy: "John Doe",
    approvedAt: "2025-04-02T14:20:00Z",
    reason: "Sensitive financial information"
  },
  {
    appId: "def456",
    dataSetName: "orders",
    fieldName: "payment_method",
    actions: ["read"] as ('read' | 'write')[],
    approved: true,
    approvedBy: "Sarah Johnson",
    approvedAt: "2025-04-09T14:35:00Z",
    reason: "Required for payment processing"
  },
  {
    appId: "ghi789",
    dataSetName: "tickets",
    fieldName: "status",
    actions: ["read", "write"] as ('read' | 'write')[],
    approved: true,
    approvedBy: "Mike Wilson",
    approvedAt: "2025-04-08T16:45:00Z",
    reason: "Required for customer support"
  },
  {
    appId: "ghi789",
    dataSetName: "tickets",
    fieldName: "priority",
    actions: ["read", "write"] as ('read' | 'write')[],
    approved: false,
    approvedBy: "Mike Wilson",
    approvedAt: "2025-04-08T16:50:00Z",
    reason: "Not required for basic support functionality"
  }
];

// Mock field consents - fixing the actions type here as well
export const mockFieldConsents = (appId: string) => [
  {
    appId,
    dataSetName: "customers",
    fieldName: "id",
    actions: ["read"] as ('read' | 'write')[],
    approved: true
  },
  {
    appId,
    dataSetName: "customers",
    fieldName: "name",
    actions: ["read"] as ('read' | 'write')[],
    approved: true
  },
  {
    appId,
    dataSetName: "customers",
    fieldName: "email",
    actions: ["read", "write"] as ('read' | 'write')[],
    approved: true
  },
  {
    appId,
    dataSetName: "customers",
    fieldName: "phone",
    actions: ["read"] as ('read' | 'write')[],
    approved: false
  },
  {
    appId,
    dataSetName: "transactions",
    fieldName: "id",
    actions: ["read"] as ('read' | 'write')[],
    approved: true
  },
  {
    appId,
    dataSetName: "transactions",
    fieldName: "amount",
    actions: ["read"] as ('read' | 'write')[],
    approved: false
  },
  {
    appId,
    dataSetName: "transactions",
    fieldName: "date",
    actions: ["read"] as ('read' | 'write')[],
    approved: true
  }
];
