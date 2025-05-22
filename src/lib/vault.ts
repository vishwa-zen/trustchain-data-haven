
import { ConsentApproval, ConsentRequest, FieldLevelConsent, Vault, AppRegistration, VaultTable, VaultField, BatchFieldConsent, GroupedConsentRequest } from "@/types";

// Mock API response delay function for consistent behavior
const mockApiDelay = (ms: number = 500) => new Promise<void>(resolve => setTimeout(resolve, ms));

/**
 * Consent Management APIs
 */

// Get all consent requests
export async function getConsentRequests(): Promise<ConsentRequest[]> {
  await mockApiDelay();
  
  return [
    // Analytics Dashboard app with multiple fields under the customers dataset
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
      groupId: "req1" // Same groupId for fields requested together
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
      groupId: "req1" // Same groupId for fields requested together
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
      groupId: "req1" // Same groupId for fields requested together
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
      groupId: "req2" // Different groupId for a separate request
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
      groupId: "req2" // Same groupId as orderDate
    },
    // Customer Portal app with multiple fields under different datasets
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
  ];
}

// Get grouped consent requests
export async function getGroupedConsentRequests(): Promise<GroupedConsentRequest[]> {
  const requests = await getConsentRequests();
  
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
  // In a real implementation, this would update a database record
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
  // In a real implementation, this would update a database record
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
  // In a real implementation, this would update multiple database records
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
  // In a real implementation, this would update multiple database records
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
  
  // Create mock tokens for each field
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
  
  // Create mock data for the detokenized values
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

// Get user's applications
export async function getApplicationsByUser(userId: string): Promise<AppRegistration[]> {
  console.log(`API Call: Getting applications for user ${userId}`);
  await mockApiDelay(600);
  
  return [
    {
      id: "app1",
      userId: userId,
      vaultId: "vault1",
      name: "CRM Dashboard",
      description: "Customer relationship management dashboard",
      status: "approved",
      dataSets: [
        {
          name: "customers",
          accessToken: "at_customers_12345",
          fields: [
            { name: "id", actions: ["read"] },
            { name: "name", actions: ["read"] },
            { name: "email", actions: ["read", "write"] }
          ],
          purpose: ["Customer Management"],
          status: "approved",
          expiryDate: "2026-05-15T00:00:00Z"
        },
        {
          name: "orders",
          accessToken: "at_orders_67890",
          fields: [
            { name: "id", actions: ["read"] },
            { name: "amount", actions: ["read"] },
            { name: "date", actions: ["read"] }
          ],
          purpose: ["Order Processing"],
          status: "approved",
          expiryDate: "2026-05-15T00:00:00Z"
        }
      ],
      clientId: "client_id_12345",
      clientSecret: "client_secret_12345",
      redirectUris: ["https://app.example.com/auth/callback"],
      createdAt: "2025-01-10T09:00:00Z"
    },
    {
      id: "app2",
      userId: userId,
      vaultId: "vault1",
      name: "Analytics Portal",
      description: "Data analysis and visualization tool",
      status: "pending",
      dataSets: [],
      clientId: "client_id_67890",
      clientSecret: "client_secret_67890",
      redirectUris: ["https://analytics.example.com/auth/callback"],
      createdAt: "2025-02-15T11:30:00Z"
    },
    {
      id: "app3",
      userId: userId,
      vaultId: "vault2",
      name: "Internal Admin Tool",
      description: "Administrative tool for internal use",
      status: "rejected",
      dataSets: [],
      clientId: "client_id_abcdef",
      clientSecret: "client_secret_abcdef",
      redirectUris: ["https://admin.example.com/auth/callback"],
      createdAt: "2025-03-20T13:45:00Z"
    }
  ];
}

// Get vault by ID
export async function getVaultById(vaultId: string): Promise<Vault> {
  console.log(`API Call: Getting vault with ID ${vaultId}`);
  await mockApiDelay(400);
  
  const vaults = [
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
            }
          ]
        }
      ]
    }
  ];
  
  const vault = vaults.find(v => v.id === vaultId);
  if (vault) {
    return vault as Vault;
  } else {
    throw new Error(`Vault with ID ${vaultId} not found`);
  }
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
  await mockApiDelay(700);
  
  const newVault: Vault = {
    id: `vault_${Math.random().toString(36).substring(2, 9)}`,
    userId: "user1", // Assuming current user
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
    vaultId: "vault1", // Default vault
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
