
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Database, Server, Users, Lock, FileCheck, Shield } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';

interface QuickActionsPanelProps {
  isAdmin: boolean;
  canManageVaults: boolean;
  isAppOwner: boolean;
}

const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ 
  isAdmin, 
  canManageVaults, 
  isAppOwner 
}) => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const isCtoUser = user?.role === 'cto-user';
  const isDpoUser = user?.role === 'dpo-user';
  const isCsioUser = user?.role === 'csio-user';
  const isSpecialRole = isCtoUser || isDpoUser || isCsioUser;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {canManageVaults && (
          <Button 
            variant="outline" 
            className="h-24 flex flex-col gap-2"
            onClick={() => navigate('/vaults')}
          >
            <Database className="h-5 w-5" />
            <span>Manage Vaults</span>
          </Button>
        )}
        
        {isAppOwner && (
          <Button 
            variant="outline" 
            className="h-24 flex flex-col gap-2"
            onClick={() => navigate('/applications/new')}
          >
            <Server className="h-5 w-5" />
            <span>Register Application</span>
          </Button>
        )}
        
        {isAdmin && (
          <Button 
            variant="outline" 
            className="h-24 flex flex-col gap-2"
            onClick={() => navigate('/users')}
          >
            <Users className="h-5 w-5" />
            <span>Manage Users</span>
          </Button>
        )}

        {isSpecialRole && (
          <Button 
            variant="outline" 
            className="h-24 flex flex-col gap-2"
            onClick={() => navigate('/consent')}
          >
            <Lock className="h-5 w-5" />
            <span>Consent Management</span>
          </Button>
        )}

        {isDpoUser && (
          <Button 
            variant="outline" 
            className="h-24 flex flex-col gap-2"
            onClick={() => navigate('/consent')}
          >
            <FileCheck className="h-5 w-5" />
            <span>Compliance Review</span>
          </Button>
        )}

        {isCsioUser && (
          <Button 
            variant="outline" 
            className="h-24 flex flex-col gap-2"
            onClick={() => navigate('/consent')}
          >
            <Shield className="h-5 w-5" />
            <span>Security Overview</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuickActionsPanel;
