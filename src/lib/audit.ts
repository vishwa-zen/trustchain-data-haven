
import { AuditLog } from "@/types/audit-logs";

// Mock data for audit logs
const sampleLogs: AuditLog[] = [
  {
    id: "log_1",
    action: "create",
    resourceType: "access_key",
    resourceId: "app_tk_3e8f4a2b",
    resourceName: "API Access Key",
    userId: "user1",
    userName: "John Doe",
    timestamp: "2025-05-20T14:30:00Z",
    details: "Created new API access key",
    ipAddress: "192.168.1.100"
  },
  {
    id: "log_2",
    action: "regenerate",
    resourceType: "access_key",
    resourceId: "app_tk_5d9e2c3a",
    resourceName: "Application Access Key",
    userId: "user1",
    userName: "John Doe",
    timestamp: "2025-05-19T11:45:23Z",
    details: "Regenerated access key for Payment Gateway application",
    ipAddress: "192.168.1.100"
  },
  {
    id: "log_3",
    action: "view",
    resourceType: "vault",
    resourceId: "vault1",
    resourceName: "Customer Data Vault",
    userId: "user2",
    userName: "Jane Smith",
    timestamp: "2025-05-18T09:12:47Z",
    details: "Accessed vault information",
    ipAddress: "192.168.1.101"
  },
  {
    id: "log_4",
    action: "copy",
    resourceType: "access_key",
    resourceId: "app_tk_7b2f1d8e",
    resourceName: "Application Access Key",
    userId: "user1",
    userName: "John Doe",
    timestamp: "2025-05-18T08:30:15Z",
    details: "Copied access key for Customer Portal application",
    ipAddress: "192.168.1.100"
  },
  {
    id: "log_5",
    action: "create",
    resourceType: "application",
    resourceId: "app-123",
    resourceName: "Customer Portal",
    userId: "user1",
    userName: "John Doe",
    timestamp: "2025-05-17T16:22:05Z",
    details: "Registered new application",
    ipAddress: "192.168.1.100"
  },
  {
    id: "log_6",
    action: "revoke",
    resourceType: "access_key",
    resourceId: "app_tk_9c4e3b7a",
    resourceName: "API Access Key",
    userId: "user3",
    userName: "Robert Johnson",
    timestamp: "2025-05-16T13:40:32Z",
    details: "Revoked expired access key",
    ipAddress: "192.168.1.102"
  },
  {
    id: "log_7",
    action: "view",
    resourceType: "consent",
    resourceId: "consent-456",
    resourceName: "Data Access Consent",
    userId: "user2",
    userName: "Jane Smith",
    timestamp: "2025-05-15T10:55:18Z",
    details: "Reviewed consent requests",
    ipAddress: "192.168.1.101"
  },
  {
    id: "log_8",
    action: "create",
    resourceType: "vault",
    resourceId: "vault3",
    resourceName: "Employee Data Vault",
    userId: "user1",
    userName: "John Doe",
    timestamp: "2025-05-14T15:10:45Z",
    details: "Created new data vault",
    ipAddress: "192.168.1.100"
  },
  {
    id: "log_9",
    action: "regenerate",
    resourceType: "access_key",
    resourceId: "app_tk_2d7c9f4e",
    resourceName: "Application Access Key",
    userId: "user3",
    userName: "Robert Johnson",
    timestamp: "2025-05-13T11:25:30Z",
    details: "Regenerated access key for Analytics Dashboard",
    ipAddress: "192.168.1.102"
  },
  {
    id: "log_10",
    action: "view",
    resourceType: "application",
    resourceId: "app-456",
    resourceName: "Payment Gateway",
    userId: "user1",
    userName: "John Doe",
    timestamp: "2025-05-12T09:30:15Z",
    details: "Viewed application details",
    ipAddress: "192.168.1.100"
  }
];

// Function to get all audit logs
export async function getAuditLogs(): Promise<AuditLog[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleLogs);
    }, 500);
  });
}

// Function to get audit logs for a specific resource
export async function getResourceAuditLogs(resourceType: string, resourceId: string): Promise<AuditLog[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredLogs = sampleLogs.filter(
        log => log.resourceType === resourceType && log.resourceId === resourceId
      );
      resolve(filteredLogs);
    }, 500);
  });
}

// Function to create a new audit log entry
export async function createAuditLog(logData: Omit<AuditLog, 'id' | 'timestamp' | 'ipAddress'>): Promise<AuditLog> {
  return new Promise((resolve) => {
    const newLog: AuditLog = {
      ...logData,
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.100' // Mock IP address
    };
    
    console.log('Audit log created:', newLog);
    resolve(newLog);
  });
}
