import { ConsentApproval, ConsentRequest, FieldLevelConsent, Vault, AppRegistration, VaultTable, VaultField, BatchFieldConsent, GroupedConsentRequest } from "@/types";
import { getCurrentUser, getAuthToken } from "@/lib/auth";
import { API_ENDPOINTS, isLocalhost } from "./config";

// Mock API response delay function for consistent behavior
const mockApiDelay = (ms: number = 500) => new Promise<void>(resolve => setTimeout(resolve, ms));

/**
 * Consent Management APIs
 */

// Get all consent requests
export async function getConsentRequests(): Promise<ConsentRequest[]> {
  await mockApiDelay();
  
  return [
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
      fieldName: "phone",
      actions: ["read", "write"],
      purpose: ["Customer Communication", "Account Verification"],
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
      fieldName: "address",
      actions: ["read"],
      purpose: ["Shipping"],
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
      dataSetName: "orders",
      fieldName: "orderDate",
      actions: ["read"],
      purpose: ["Analytics"],
      status: "requested",
      requestedAt: "2025-04-10T14:35:00Z",
      expiryDate: "2026-04-10T14:35:00Z",
      groupId: "req2"
    },
    {
      appId: "abc123",
      appName: "Analytics Dashboard",
      userId: "user1",
      vaultId: "vault1",
      dataSetName: "orders",
      fieldName: "totalAmount",
      actions: ["read"],
      purpose: ["Analytics"],
      status: "requested",
      requestedAt: "2025-04-10T14:35:00Z",
      expiryDate: "2026-04-10T14:35:00Z",
      groupId: "req2"
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
      dataSetName: "customers",
      fieldName: "name",
      actions: ["read"],
      purpose: ["User Interface"],
      status: "requested",
      requestedAt: "2025-04-12T10:20:00Z",
      expiryDate: "2026-04-12T10:20:00Z",
      groupId: "req4"
    },
    {
      appId: "def456",
      appName: "Customer Portal",
      userId: "user2",
      vaultId: "vault2",
      dataSetName: "customers",
      fieldName: "email",
      actions: ["read", "write"],
      purpose: ["Communication"],
      status: "requested",
      requestedAt: "2025-04-12T10:20:00Z",
      expiryDate: "2026-04-12T10:20:00Z",
      groupId: "req4"
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
  ];
}

// Get grouped consent requests
export async function getGroupedConsentRequests(): Promise<GroupedConsentRequest[]> {
  const requests = await getConsentRequests();
  
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
    
    acc[groupId].fields.push({
      fieldName: request.fieldName,
      actions: request.actions
    });
    
    request.purpose.forEach(p => {
      if (!acc[groupId].purpose.includes(p)) {
        acc[groupId].purpose.push(p);
      }
    });
    
    return acc;
  }, {} as Record<string, GroupedConsentRequest>);
  
  return Object.values(groupedMap);
}

// Get app-specific field consents
export async function getAppFieldConsents(appId: string): Promise<FieldLevelConsent[]> {
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
  ];
}

// Get consent approval history
export async function getConsentApprovalHistory(appId: string): Promise<ConsentApproval[]> {
  await mockApiDelay(300);
  
  return [
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
  ];
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
  return;
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
  return;
}

// Batch approve field consents
export async function approveBatchFieldConsent(
  appId: string,
  fields: { dataSetName: string; fieldName: string; actions: ("read" | "write")[] }[],
  reason?: string
): Promise<void> {
  console.log(`API Call: Batch approving ${fields.length} fields for app ${appId}`);
  console.log('Fields:', fields);
  console.log('Reason:', reason);
  await mockApiDelay(800);
  return;
}

// Batch reject field consents
export async function rejectBatchFieldConsent(
  appId: string,
  fields: { dataSetName: string; fieldName: string }[],
  reason?: string
): Promise<void> {
  console.log(`API Call: Batch rejecting ${fields.length} fields for app ${appId}`);
  console.log('Fields:', fields);
  console.log('Reason:', reason);
  await mockApiDelay(800);
  return;
}

/**
 * Data Tokenization APIs
 */

// Tokenize data
export async function tokenizeData({ userId, vaultId, appId, data }: { 
  userId: string;
  vaultId: string;
  appId: string;
  data: Record<string, any>;
}): Promise<{ tokens: Record<string, string>; accessKey: string }> {
  console.log(`API Call: Tokenizing data for ${userId} in vault ${vaultId} for app ${appId}`);
  console.log('Data to tokenize:', data);
  await mockApiDelay(700);
  
  const tokens: Record<string, string> = {};
  Object.keys(data).forEach(key => {
    tokens[key] = `tk_${Math.random().toString(36).substring(2, 15)}_${key}`;
  });
  
  const accessKey = `ak_${Math.random().toString(36).substring(2, 15)}`;
  
  return { tokens, accessKey };
}

// Detokenize data
export async function detokenizeData({ 
  userId, 
  vaultId, 
  appId, 
  accessKey, 
  tokens 
}: {
  userId: string;
  vaultId: string;
  appId: string;
  accessKey: string;
  tokens: string[];
}): Promise<{ data: Record<string, any> }> {
  console.log(`API Call: Detokenizing data for ${userId} in vault ${vaultId} for app ${appId}`);
  console.log('Tokens to detokenize:', tokens);
  console.log('Access key:', accessKey);
  await mockApiDelay(800);
  
  const data: Record<string, any> = {};
  tokens.forEach(token => {
    const fieldMatch = token.match(/tk_[a-z0-9]+_([a-z_]+)/i);
    if (fieldMatch && fieldMatch[1]) {
      const field = fieldMatch[1];
      switch(field) {
        case 'first_name': 
          data[field] = 'John';
          break;
        case 'last_name':
          data[field] = 'Doe';
          break;
        case 'email':
          data[field] = 'john.doe@example.com';
          break;
        case 'phone_number':
          data[field] = '+1234567890';
          break;
        case 'pan_number':
          data[field] = 'ABCDE1234F';
          break;
        case 'aadhar_number':
          data[field] = '1234-5678-9012';
          break;
        default:
          data[field] = `Detokenized value for ${field}`;
      }
    }
  });
  
  return { data };
}

/**
 * Vault Management APIs
 */

// Get all vaults
export async function getVaults(): Promise<Vault[]> {
  console.log('API Call: Getting all vaults');
  
  const isDeployed = !isLocalhost();
  
  try {
    if (!isDeployed) {
      const user = getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const response = await fetch(API_ENDPOINTS.vaults.getAll, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Vaults fetched successfully:', data);
        
        const vaults: Vault[] = data.vaults.map((vault: any) => ({
          id: vault.vault_id,
          userId: vault.user_id,
          vaultName: vault.vault_name,
          vaultDesc: vault.vault_desc,
          createdAt: vault.created_at,
          updatedAt: vault.updated_at,
          status: vault.status,
          tables: vault.tables || []
        }));
        
        return vaults;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error fetching vaults:', errorData);
        throw new Error(errorData.message || 'Failed to fetch vaults');
      }
    }
  } catch (error) {
    console.error('Error fetching vaults with API:', error);
  }
  
  await mockApiDelay(600);
  
  return [
    {
      id: "vault1",
      userId: "user1",
      vaultName: "Customer Data Vault",
      vaultDesc: "Stores sensitive customer information",
      createdAt: "2025-01-15T10:30:00Z",
      tables: [
        {
          tableName: "customers",
          description: "Customer personal information",
          purpose: ["Identity Verification", "Contact Management"],
          fields: [
            { 
              name: "id", 
              type: "string", 
              sensitivity: "LOW", 
              accessControl: ["admin", "user"] 
            },
            { 
              name: "name", 
              type: "string", 
              sensitivity: "MEDIUM", 
              accessControl: ["admin", "user"] 
            },
            { 
              name: "email", 
              type: "string", 
              sensitivity: "HIGH", 
              accessControl: ["admin"] 
            },
            { 
              name: "phone", 
              type: "string", 
              sensitivity: "HIGH", 
              accessControl: ["admin"] 
            },
            { 
              name: "address", 
              type: "string", 
              sensitivity: "MEDIUM", 
              accessControl: ["admin", "user"] 
            }
          ]
        },
        {
          tableName: "payments",
          description: "Payment information",
          purpose: ["Payment Processing", "Financial Records"],
          fields: [
            { 
              name: "id", 
              type: "string", 
              sensitivity: "LOW", 
              accessControl: ["admin"] 
            },
            { 
              name: "amount", 
              type: "number", 
              sensitivity: "HIGH", 
              accessControl: ["admin"] 
            },
            { 
              name: "payment_method", 
              type: "string", 
              sensitivity: "MEDIUM", 
              accessControl: ["admin"] 
            },
            { 
              name: "payment_date", 
              type: "date", 
              sensitivity: "LOW", 
              accessControl: ["admin", "user"] 
            },
            { 
              name: "transaction_id", 
              type: "string", 
              sensitivity: "MEDIUM", 
              accessControl: ["admin"] 
            }
          ]
        }
      ]
    },
    {
      id: "vault2",
      userId: "user2",
      vaultName: "Finance Vault",
      vaultDesc: "Stores financial records and payment information",
      createdAt: "2025-02-20T14:45:00Z",
      tables: [
        {
          tableName: "transactions",
          description: "Financial transaction records",
          purpose: ["Accounting", "Audit"],
          fields: [
            { 
              name: "id", 
              type: "string", 
              sensitivity: "LOW", 
              accessControl: ["admin"] 
            },
            { 
              name: "amount", 
              type: "number", 
              sensitivity: "HIGH", 
              accessControl: ["admin"] 
            },
            { 
              name: "transaction_date", 
              type: "date", 
              sensitivity: "LOW", 
              accessControl: ["admin", "finance"] 
            },
            { 
              name: "description", 
              type: "string", 
              sensitivity: "MEDIUM", 
              accessControl: ["admin", "finance"] 
            }
          ]
        },
        {
          tableName: "invoices",
          description: "Billing information",
          purpose: ["Billing", "Payment Processing"],
          fields: [
            { 
              name: "id", 
              type: "string", 
              sensitivity: "LOW", 
              accessControl: ["admin", "finance"] 
            },
            { 
              name: "total", 
              type: "number", 
              sensitivity: "MEDIUM", 
              accessControl: ["admin", "finance"] 
            },
            { 
              name: "invoice_date", 
              type: "date", 
              sensitivity: "LOW", 
              accessControl: ["admin", "finance", "user"] 
            },
            { 
              name: "due_date", 
              type: "date", 
              sensitivity: "LOW", 
              accessControl: ["admin", "finance", "user"] 
            },
            { 
              name: "status", 
              type: "string", 
              sensitivity: "LOW", 
              accessControl: ["admin", "finance", "user"] 
            }
          ]
        }
      ]
    },
    {
      id: "vault3",
      userId: "user1",
      vaultName: "Employee Data Vault",
      vaultDesc: "Contains employee personal and payroll information",
      createdAt: "2025-03-05T09:15:00Z",
      tables: [
        {
          tableName: "employees",
          description: "Employee records",
          purpose: ["HR Management", "Directory"],
          fields: [
            { 
              name: "id", 
              type: "string", 
              sensitivity: "LOW", 
              accessControl: ["admin", "hr"] 
            },
            { 
              name: "salary", 
              type: "number", 
              sensitivity: "HIGH", 
              accessControl: ["admin", "hr"] 
            },
            { 
              name: "job_title", 
              type: "string", 
              sensitivity: "LOW", 
              accessControl: ["admin", "hr", "manager"] 
            },
            { 
              name: "department", 
              type: "string", 
              sensitivity: "LOW", 
              accessControl: ["admin", "hr", "manager"] 
            },
            { 
              name: "personal_email", 
              type: "string", 
              sensitivity: "HIGH", 
              accessControl: ["admin", "hr"] 
            }
          ]
        },
        {
          tableName: "payroll",
          description: "Payroll information",
          purpose: ["Compensation", "Financial Records"],
          fields: [
            { 
              name: "id", 
              type: "string", 
              sensitivity: "LOW", 
              accessControl: ["admin", "finance"] 
            },
            { 
              name: "amount", 
              type: "number", 
              sensitivity: "HIGH", 
              accessControl: ["admin", "finance"] 
            },
            { 
              name: "payment_date", 
              type: "date", 
              sensitivity: "MEDIUM", 
              accessControl: ["admin", "finance"] 
            },
            { 
              name: "tax_deduction", 
              type: "number", 
              sensitivity: "HIGH", 
              accessControl: ["admin", "finance"] 
            },
            { 
              name: "benefits_deduction", 
              type: "number", 
              sensitivity: "HIGH", 
              accessControl: ["admin", "finance"] 
            }
          ]
        }
      ]
    }
  ];
}

// Get vault by ID
export async function getVaultById(vaultId: string): Promise<Vault> {
  console.log(`API Call: Getting vault with ID ${vaultId}`);
  
  const isDeployed = !isLocalhost();
  
  try {
    if (!isDeployed) {
      const user = getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const response = await fetch(API_ENDPOINTS.vaults.getById(vaultId), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Vault fetched successfully:', data);
        
        const vault: Vault = {
          id: data.vault.vault_id,
          userId: data.vault.user_id,
          vaultName: data.vault.vault_name,
          vaultDesc: data.vault.vault_desc,
          createdAt: data.vault.created_at,
          updatedAt: data.vault.updated_at,
          tables: data.vault.tables || []
        };
        
        return vault;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error fetching vault:', errorData);
        throw new Error(errorData.message || 'Failed to fetch vault');
      }
    }
  } catch (error) {
    console.error('Error fetching vault with API:', error);
  }
  
  await mockApiDelay(400);
  
  return {
    id: "vault1",
    userId: "user1",
    vaultName: "Customer Data Vault",
    vaultDesc: "Stores sensitive customer information",
    createdAt: "2025-01-15T10:30:00Z",
    tables: [
      {
        tableName: "customers",
        description: "Customer personal information",
        purpose: ["Identity Verification", "Contact Management"],
        fields: [
          { 
            name: "id", 
            type: "string", 
            sensitivity: "LOW", 
            accessControl: ["admin", "user"] 
          },
          { 
            name: "name", 
            type: "string", 
            sensitivity: "MEDIUM", 
            accessControl: ["admin", "user"] 
          }
        ]
      },
      {
        tableName: "payments",
        description: "Payment information",
        purpose: ["Payment Processing", "Financial Records"],
        fields: [
          { 
            name: "id", 
            type: "string", 
            sensitivity: "LOW", 
            accessControl: ["admin"] 
          },
          { 
            name: "amount", 
            type: "number", 
            sensitivity: "HIGH", 
            accessControl: ["admin"] 
          }
        ]
      }
    ]
  };
}

// Create vault tables
export async function createVaultTables(
  vaultId: string,
  tables: { name: string; fields: { name: string; type: string; sensitive: boolean }[] }[]
): Promise<boolean> {
  console.log(`API Call: Creating tables in vault ${vaultId}:`, tables);
  await mockApiDelay(800);
  return true;
}

// Create new vault
export async function createVault(
  vaultName: string, 
  vaultDesc: string
): Promise<Vault> {
  console.log('API Call: Creating vault:', { vaultName, vaultDesc });
  
  const isDeployed = !isLocalhost();
  
  try {
    if (!isDeployed) {
      const user = getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const response = await fetch(API_ENDPOINTS.vaults.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          user_id: user.id,
          vault_name: vaultName,
          vault_desc: vaultDesc
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Vault created successfully:', data);
        
        const newVault: Vault = {
          id: data.vault.vault_id,
          userId: data.vault.user_id,
          vaultName: data.vault.vault_name,
          vaultDesc: data.vault.vault_desc,
          createdAt: new Date().toISOString(),
          tables: []
        };
        
        return newVault;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error creating vault:', errorData);
        throw new Error(errorData.message || 'Failed to create vault');
      }
    }
  } catch (error) {
    console.error('Error creating vault with API:', error);
  }
  
  await mockApiDelay(700);
  
  const newVault: Vault = {
    id: `vault_${Math.random().toString(36).substring(2, 9)}`,
    userId: "user1",
    vaultName: vaultName,
    vaultDesc: vaultDesc,
    createdAt: new Date().toISOString(),
    tables: []
  };
  
  return newVault;
}

// Register new application
export async function registerApplication(appData: {
  name: string;
  description: string;
  owner: string;
}): Promise<AppRegistration> {
  console.log('API Call: Registering application:', appData);
  await mockApiDelay(700);
  
  const newApp: AppRegistration = {
    id: `app_${Math.random().toString(36).substring(2, 9)}`,
    userId: appData.owner,
    vaultId: "vault1",
    name: appData.name,
    description: appData.description,
    status: "pending",
    dataSets: [],
    clientId: `client_${Math.random().toString(36).substring(2, 10)}`,
    clientSecret: `secret_${Math.random().toString(36).substring(2, 15)}`,
    redirectUris: [],
    createdAt: new Date().toISOString()
  };
  
  return newApp;
}

// Generate application access token
export async function generateAccessToken(appId: string): Promise<string> {
  console.log(`API Call: Generating access token for app ${appId}`);
  await mockApiDelay(500);
  
  const token = `access_token_${Math.random().toString(36).substring(2, 15)}`;
  return token;
}
