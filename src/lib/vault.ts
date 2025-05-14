import { ConsentApproval, ConsentRequest, FieldLevelConsent, Vault, AppRegistration } from "@/types";

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
          vaultName: "Customer Data Vault",
          vaultDesc: "Stores sensitive customer information",
          created: "2025-01-15T10:30:00Z",
          owner: "user1",
          status: "active",
          tables: ["customers", "payments"]
        },
        {
          id: "vault2",
          vaultName: "Finance Vault",
          vaultDesc: "Stores financial records and payment information",
          created: "2025-02-20T14:45:00Z",
          owner: "user2",
          status: "active",
          tables: ["transactions", "invoices"]
        },
        {
          id: "vault3",
          vaultName: "Employee Data Vault",
          vaultDesc: "Contains employee personal and payroll information",
          created: "2025-03-05T09:15:00Z",
          owner: "user1",
          status: "inactive",
          tables: ["employees", "payroll"]
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
          name: "CRM Dashboard",
          description: "Customer relationship management dashboard",
          owner: userId,
          apiKey: "api_key_1234",
          status: "approved",
          createdAt: "2025-03-10T11:20:00Z"
        },
        {
          id: "app2",
          name: "Analytics Portal",
          description: "Data analysis and visualization tool",
          owner: userId,
          apiKey: "api_key_5678",
          status: "pending",
          createdAt: "2025-03-15T13:40:00Z"
        },
        {
          id: "app3",
          name: "Internal Admin Tool",
          description: "Administrative tool for internal use",
          owner: userId,
          apiKey: "api_key_9012",
          status: "rejected",
          createdAt: "2025-03-18T09:30:00Z"
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
          vaultName: "Customer Data Vault",
          vaultDesc: "Stores sensitive customer information",
          created: "2025-01-15T10:30:00Z",
          owner: "user1",
          status: "active",
          tables: ["customers", "payments"]
        },
        {
          id: "vault2",
          vaultName: "Finance Vault",
          vaultDesc: "Stores financial records and payment information",
          created: "2025-02-20T14:45:00Z",
          owner: "user2",
          status: "active",
          tables: ["transactions", "invoices"]
        }
      ];
      
      const vault = vaults.find(v => v.id === vaultId);
      if (vault) {
        resolve(vault);
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

export async function createVault(vaultData: { 
  vaultName: string; 
  vaultDesc: string; 
  owner: string;
}): Promise<Vault> {
  // Mock implementation
  return new Promise((resolve) => {
    console.log('Creating vault:', vaultData);
    setTimeout(() => {
      const newVault: Vault = {
        id: `vault_${Math.random().toString(36).substring(2, 9)}`,
        vaultName: vaultData.vaultName,
        vaultDesc: vaultData.vaultDesc,
        created: new Date().toISOString(),
        owner: vaultData.owner,
        status: "active",
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
        name: appData.name,
        description: appData.description,
        owner: appData.owner,
        apiKey: "",
        status: "pending",
        createdAt: new Date().toISOString()
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
