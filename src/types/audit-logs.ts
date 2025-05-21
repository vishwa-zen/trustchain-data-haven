
export interface AuditLog {
  id: string;
  action: 'create' | 'regenerate' | 'revoke' | 'view' | 'copy';
  resourceType: 'access_key' | 'vault' | 'application' | 'consent';
  resourceId: string;
  resourceName: string;
  userId: string;
  userName: string;
  timestamp: string;
  details?: string;
  ipAddress?: string;
}
