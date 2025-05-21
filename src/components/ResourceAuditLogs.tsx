
import React, { useEffect, useState } from 'react';
import AuditLogsList from '@/components/AuditLogsList';
import { getResourceAuditLogs } from '@/lib/audit';
import { AuditLog } from '@/types/audit-logs';

interface ResourceAuditLogsProps {
  resourceType: 'access_key' | 'vault' | 'application' | 'consent';
  resourceId: string;
}

const ResourceAuditLogs = ({ resourceType, resourceId }: ResourceAuditLogsProps) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResourceLogs = async () => {
      try {
        setIsLoading(true);
        const resourceLogs = await getResourceAuditLogs(resourceType, resourceId);
        setLogs(resourceLogs);
      } catch (error) {
        console.error(`Failed to load ${resourceType} audit logs:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadResourceLogs();
  }, [resourceType, resourceId]);

  const getTitle = () => {
    switch (resourceType) {
      case 'access_key':
        return 'Access Key Activity';
      case 'vault':
        return 'Vault Activity';
      case 'application':
        return 'Application Activity';
      case 'consent':
        return 'Consent Activity';
      default:
        return 'Resource Activity';
    }
  };

  const getDescription = () => {
    switch (resourceType) {
      case 'access_key':
        return 'A history of actions performed on this access key';
      case 'vault':
        return 'A history of actions performed on this vault';
      case 'application':
        return 'A history of actions performed on this application';
      case 'consent':
        return 'A history of actions performed on this consent';
      default:
        return 'A history of actions performed on this resource';
    }
  };

  return isLoading ? (
    <div className="flex items-center justify-center h-32">
      <div className="text-center">Loading activity logs...</div>
    </div>
  ) : (
    <AuditLogsList 
      logs={logs} 
      title={getTitle()} 
      description={getDescription()}
      showFilters={logs.length > 5} // Only show filters if there are enough logs
    />
  );
};

export default ResourceAuditLogs;
