
import { ConsentApproval, ConsentRequest, FieldLevelConsent, Vault, AppRegistration, VaultTable, VaultField, BatchFieldConsent } from "@/types";

export async function getConsentRequests(): Promise<ConsentRequest[]> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
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
          expiryDate: "2026-04-10T14:35:00Z"
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
          expiryDate: "2026-04-10T14:35:00Z"
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
          expiryDate: "2026-04-12T10:20:00Z"
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
          expiryDate: "2026-04-12T10:20:00Z"
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

export async function tokenizeData({ userId, vaultId, appId, data }: { 
  userId: string;
  vaultId: string;
  appId: string;
  data: Record<string, any>;
}): Promise<{ tokens: Record<string, string>; accessKey: string }> {
  // Mock implementation
  return new Promise((resolve) => {
    console.log(`Tokenizing data for ${userId} in vault ${vaultId} for app ${appId}`);
    setTimeout(() => {
      // Create mock tokens for each field
      const tokens: Record<string, string> = {};
      Object.keys(data).forEach(key => {
        tokens[key] = `tk_${Math.random().toString(36).substring(2, 15)}_${key}`;
      });
      
      const accessKey = `ak_${Math.random().toString(36).substring(2, 15)}`;
      
      resolve({ tokens, accessKey });
    }, 700);
  });
}

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
  // Mock implementation
  return new Promise((resolve) => {
    console.log(`Detokenizing data for ${userId} in vault ${vaultId} for app ${appId}`);
    setTimeout(() => {
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
      
      resolve({ data });
    }, 800);
  });
}

export async function getVaults(): Promise<Vault[]> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
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
                  sensitivity: "LOW" as const, 
                  accessControl: ["admin", "user"] 
                },
                { 
                  name: "name", 
                  type: "string", 
                  sensitivity: "MEDIUM" as const, 
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
                  sensitivity: "LOW" as const, 
                  accessControl: ["admin"] 
                },
                { 
                  name: "amount", 
                  type: "number", 
                  sensitivity: "HIGH" as const, 
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
                  sensitivity: "LOW" as const, 
                  accessControl: ["admin"] 
                },
                { 
                  name: "amount", 
                  type: "number", 
                  sensitivity: "HIGH" as const, 
                  accessControl: ["admin"] 
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
                  sensitivity: "LOW" as const, 
                  accessControl: ["admin", "finance"] 
                },
                { 
                  name: "total", 
                  type: "number", 
                  sensitivity: "MEDIUM" as const, 
                  accessControl: ["admin", "finance"] 
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
                  sensitivity: "LOW" as const, 
                  accessControl: ["admin", "hr"] 
                },
                { 
                  name: "salary", 
                  type: "number", 
                  sensitivity: "HIGH" as const, 
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
                  sensitivity: "LOW" as const, 
                  accessControl: ["admin", "finance"] 
                },
                { 
                  name: "amount", 
                  type: "number", 
                  sensitivity: "HIGH" as const, 
                  accessControl: ["admin", "finance"] 
                }
              ]
            }
          ]
        }
      ]);
    }, 600);
  });
}

export async function getApplicationsByUser(userId: string): Promise<AppRegistration[]> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "app1",
          userId: userId,
          vaultId: "vault1",
          name: "CRM Dashboard",
          description: "Customer relationship management dashboard",
          status: "approved",
          dataSets: []
        },
        {
          id: "app2",
          userId: userId,
          vaultId: "vault1",
          name: "Analytics Portal",
          description: "Data analysis and visualization tool",
          status: "pending",
          dataSets: []
        },
        {
          id: "app3",
          userId: userId,
          vaultId: "vault2",
          name: "Internal Admin Tool",
          description: "Administrative tool for internal use",
          status: "rejected",
          dataSets: []
        }
      ]);
    }, 600);
  });
}

export async function getVaultById(vaultId: string): Promise<Vault> {
  // Mock implementation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
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
                  sensitivity: "LOW" as const, 
                  accessControl: ["admin", "user"] 
                },
                { 
                  name: "name", 
                  type: "string", 
                  sensitivity: "MEDIUM" as const, 
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
                  sensitivity: "LOW" as const, 
                  accessControl: ["admin"] 
                },
                { 
                  name: "amount", 
                  type: "number", 
                  sensitivity: "HIGH" as const, 
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
                  sensitivity: "LOW" as const, 
                  accessControl: ["admin"] 
                },
                { 
                  name: "amount", 
                  type: "number", 
                  sensitivity: "HIGH" as const, 
                  accessControl: ["admin"] 
                }
              ]
            }
          ]
        }
      ];
      
      const vault = vaults.find(v => v.id === vaultId);
      if (vault) {
        resolve(vault as Vault);
      } else {
        reject(new Error(`Vault with ID ${vaultId} not found`));
      }
    }, 400);
  });
}

export async function createVaultTables(
  vaultId: string,
  tables: { name: string; fields: { name: string; type: string; sensitive: boolean }[] }[]
): Promise<boolean> {
  // Mock implementation
  return new Promise((resolve) => {
    console.log(`Creating tables in vault ${vaultId}:`, tables);
    setTimeout(() => {
      resolve(true);
    }, 800);
  });
}

export async function createVault(
  vaultName: string, 
  vaultDesc: string
): Promise<Vault> {
  // Mock implementation
  return new Promise((resolve) => {
    console.log('Creating vault:', { vaultName, vaultDesc });
    setTimeout(() => {
      const newVault: Vault = {
        id: `vault_${Math.random().toString(36).substring(2, 9)}`,
        userId: "user1", // Assuming current user
        vaultName: vaultName,
        vaultDesc: vaultDesc,
        createdAt: new Date().toISOString(),
        tables: []
      };
      
      resolve(newVault);
    }, 700);
  });
}

export async function registerApplication(appData: {
  name: string;
  description: string;
  owner: string;
}): Promise<AppRegistration> {
  // Mock implementation
  return new Promise((resolve) => {
    console.log('Registering application:', appData);
    setTimeout(() => {
      const newApp: AppRegistration = {
        id: `app_${Math.random().toString(36).substring(2, 9)}`,
        userId: appData.owner,
        vaultId: "vault1", // Default vault
        name: appData.name,
        description: appData.description,
        status: "pending",
        dataSets: []
      };
      
      resolve(newApp);
    }, 700);
  });
}

export async function generateAccessToken(appId: string): Promise<string> {
  // Mock implementation
  return new Promise((resolve) => {
    console.log(`Generating access token for app ${appId}`);
    setTimeout(() => {
      const token = `access_token_${Math.random().toString(36).substring(2, 15)}`;
      resolve(token);
    }, 500);
  });
}
