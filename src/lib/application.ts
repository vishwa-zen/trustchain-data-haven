
import { AppRegistration, DataSet, DataSetFieldAction } from '@/types';
import { mockApiDelay } from '@/lib/utils';

/**
 * Application Management APIs
 */

// Get all applications
export async function getAllApplications(): Promise<AppRegistration[]> {
  console.log('API Call: Getting all applications');
  await mockApiDelay(700);
  
  return [
    {
      id: "app1",
      userId: "user1",
      vaultId: "vault1",
      name: "CRM Dashboard",
      description: "Customer relationship management dashboard",
      status: "approved",
      dataSets: getDataSets("app1"),
      clientId: "client_id_12345",
      clientSecret: "client_secret_12345",
      redirectUris: ["https://app.example.com/auth/callback"],
      createdAt: "2025-01-10T09:00:00Z"
    },
    {
      id: "app2",
      userId: "user2",
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
      userId: "user3",
      vaultId: "vault2",
      name: "Internal Admin Tool",
      description: "Administrative tool for internal use",
      status: "rejected",
      dataSets: [],
      clientId: "client_id_abcdef",
      clientSecret: "client_secret_abcdef",
      redirectUris: ["https://admin.example.com/auth/callback"],
      createdAt: "2025-03-20T13:45:00Z"
    },
    {
      id: "abc123",
      userId: "user1",
      vaultId: "vault1",
      name: "Analytics Dashboard",
      description: "Business intelligence and analytics platform",
      status: "approved",
      dataSets: getDataSets("abc123"),
      clientId: "client_id_abc123",
      clientSecret: "client_secret_abc123",
      redirectUris: ["https://analytics-dashboard.example.com/auth/callback"],
      createdAt: "2025-01-05T08:15:00Z"
    },
    {
      id: "def456",
      userId: "user2",
      vaultId: "vault2",
      name: "Customer Portal",
      description: "Self-service customer portal",
      status: "approved",
      dataSets: getDataSets("def456"),
      clientId: "client_id_def456",
      clientSecret: "client_secret_def456",
      redirectUris: ["https://customer-portal.example.com/auth/callback"],
      createdAt: "2025-02-08T10:20:00Z"
    },
    {
      id: "ghi789",
      userId: "user3",
      vaultId: "vault3",
      name: "Support System",
      description: "Customer service and ticketing system",
      status: "approved",
      dataSets: getDataSets("ghi789"),
      clientId: "client_id_ghi789",
      clientSecret: "client_secret_ghi789",
      redirectUris: ["https://support-system.example.com/auth/callback"],
      createdAt: "2025-03-12T14:40:00Z"
    }
  ];
}

// Helper function to get datasets for an application
function getDataSets(appId: string): DataSet[] {
  switch (appId) {
    case "app1":
      return [
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
      ];
    case "abc123":
      return [
        {
          name: "customers",
          accessToken: "at_customers_abc123",
          fields: [
            { name: "email", actions: ["read"] },
            { name: "phone", actions: ["read", "write"] },
            { name: "address", actions: ["read"] }
          ],
          purpose: ["Customer Communication", "Account Verification", "Shipping"],
          status: "approved",
          expiryDate: "2026-04-10T14:30:00Z"
        },
        {
          name: "orders",
          accessToken: "at_orders_abc123",
          fields: [
            { name: "orderDate", actions: ["read"] },
            { name: "totalAmount", actions: ["read"] }
          ],
          purpose: ["Analytics"],
          status: "approved",
          expiryDate: "2026-04-10T14:35:00Z"
        }
      ];
    case "def456":
      return [
        {
          name: "customers",
          accessToken: "at_customers_def456",
          fields: [
            { name: "name", actions: ["read"] },
            { name: "email", actions: ["read", "write"] }
          ],
          purpose: ["User Interface", "Communication"],
          status: "approved",
          expiryDate: "2026-04-12T10:20:00Z"
        },
        {
          name: "orders",
          accessToken: "at_orders_def456",
          fields: [
            { name: "amount", actions: ["read"] },
            { name: "payment_method", actions: ["read"] }
          ],
          purpose: ["Order Processing", "Payment Processing"],
          status: "approved",
          expiryDate: "2026-04-12T10:15:00Z"
        }
      ];
    case "ghi789":
      return [
        {
          name: "tickets",
          accessToken: "at_tickets_ghi789",
          fields: [
            { name: "status", actions: ["read", "write"] },
            { name: "priority", actions: ["read"] }
          ],
          purpose: ["Customer Support"],
          status: "approved",
          expiryDate: "2026-04-08T16:45:00Z"
        }
      ];
    default:
      return [];
  }
}

// Get application by ID
export async function getApplicationById(appId: string): Promise<AppRegistration | null> {
  console.log(`API Call: Getting application with ID ${appId}`);
  await mockApiDelay(400);
  
  const allApps = await getAllApplications();
  return allApps.find(app => app.id === appId) || null;
}

// Get applications by user ID
export async function getApplicationsByUser(userId: string): Promise<AppRegistration[]> {
  console.log(`API Call: Getting applications for user ${userId}`);
  await mockApiDelay(600);
  
  const allApps = await getAllApplications();
  return allApps.filter(app => app.userId === userId);
}

// Create new application
export async function createApplication(appData: {
  name: string;
  description: string;
  owner: string;
  vaultId?: string;
}): Promise<AppRegistration> {
  console.log('API Call: Creating application:', appData);
  await mockApiDelay(800);
  
  const newApp: AppRegistration = {
    id: `app_${Math.random().toString(36).substring(2, 9)}`,
    userId: appData.owner,
    vaultId: appData.vaultId || "vault1", // Default vault
    name: appData.name,
    description: appData.description,
    status: "pending",
    dataSets: [],
    clientId: `client_${Math.random().toString(36).substring(2, 10)}`,
    clientSecret: `secret_${Math.random().toString(36).substring(2, 15)}`,
    redirectUris: [],
    createdAt: new Date().toISOString()
  };
  
  // In a real implementation, this would save to a database
  
  return newApp;
}

// Update application
export async function updateApplication(
  appId: string,
  updates: Partial<Omit<AppRegistration, 'id' | 'userId' | 'createdAt' | 'clientId' | 'clientSecret'>>
): Promise<AppRegistration | null> {
  console.log(`API Call: Updating application ${appId}:`, updates);
  await mockApiDelay(700);
  
  const app = await getApplicationById(appId);
  if (!app) return null;
  
  const updatedApp = {
    ...app,
    ...updates
  };
  
  // In a real implementation, this would update a database record
  
  return updatedApp;
}

// Delete application
export async function deleteApplication(appId: string): Promise<boolean> {
  console.log(`API Call: Deleting application ${appId}`);
  await mockApiDelay(600);
  
  // In a real implementation, this would delete from a database
  
  return true;
}

// Approve application
export async function approveApplication(appId: string): Promise<AppRegistration | null> {
  console.log(`API Call: Approving application ${appId}`);
  await mockApiDelay(500);
  
  const app = await getApplicationById(appId);
  if (!app) return null;
  
  const updatedApp = {
    ...app,
    status: 'approved'
  };
  
  // In a real implementation, this would update a database record
  
  return updatedApp;
}

// Reject application
export async function rejectApplication(appId: string): Promise<AppRegistration | null> {
  console.log(`API Call: Rejecting application ${appId}`);
  await mockApiDelay(500);
  
  const app = await getApplicationById(appId);
  if (!app) return null;
  
  const updatedApp = {
    ...app,
    status: 'rejected'
  };
  
  // In a real implementation, this would update a database record
  
  return updatedApp;
}

// Generate access token for application
export async function generateApplicationToken(appId: string): Promise<string> {
  console.log(`API Call: Generating access token for app ${appId}`);
  await mockApiDelay(500);
  
  const token = `access_token_${Math.random().toString(36).substring(2, 15)}`;
  return token;
}

// Reset client secret
export async function resetClientSecret(appId: string): Promise<string> {
  console.log(`API Call: Resetting client secret for app ${appId}`);
  await mockApiDelay(600);
  
  const newSecret = `client_secret_${Math.random().toString(36).substring(2, 15)}`;
  
  // In a real implementation, this would update a database record
  
  return newSecret;
}

// Add redirect URI
export async function addRedirectUri(appId: string, uri: string): Promise<string[]> {
  console.log(`API Call: Adding redirect URI ${uri} for app ${appId}`);
  await mockApiDelay(400);
  
  const app = await getApplicationById(appId);
  if (!app) return [];
  
  const newUris = [...(app.redirectUris || []), uri];
  
  // In a real implementation, this would update a database record
  
  return newUris;
}

// Remove redirect URI
export async function removeRedirectUri(appId: string, uri: string): Promise<string[]> {
  console.log(`API Call: Removing redirect URI ${uri} for app ${appId}`);
  await mockApiDelay(400);
  
  const app = await getApplicationById(appId);
  if (!app) return [];
  
  const newUris = (app.redirectUris || []).filter(u => u !== uri);
  
  // In a real implementation, this would update a database record
  
  return newUris;
}
