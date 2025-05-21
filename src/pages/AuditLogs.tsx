
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AuditLogsList from '@/components/AuditLogsList';
import { getAuditLogs } from '@/lib/audit';
import { AuditLog } from '@/types/audit-logs';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '@/lib/auth';

const AuditLogs = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadLogs = async () => {
      try {
        setIsLoading(true);
        const auditLogs = await getAuditLogs();
        setLogs(auditLogs);
      } catch (error) {
        console.error('Failed to load audit logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();
  }, [navigate, user]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
            <p className="text-muted-foreground">
              Review system activity and access patterns
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">Loading audit logs...</div>
            </div>
          ) : (
            <AuditLogsList logs={logs} />
          )}
        </main>
      </div>
    </div>
  );
};

export default AuditLogs;
