
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Database, Server, Users } from 'lucide-react';

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
      </div>
    </div>
  );
};

export default QuickActionsPanel;
