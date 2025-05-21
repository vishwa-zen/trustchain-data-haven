
import React from 'react';
import { Vault } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VaultCardProps {
  vault: Vault;
}

const VaultCard: React.FC<VaultCardProps> = ({ vault }) => {
  const navigate = useNavigate();
  const createdDate = new Date(vault.createdAt).toLocaleDateString();
  const tableCount = vault.tables?.length || 0;

  return (
    <Card className="vault-card animate-fade-in flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-vault-900">
            {vault.vaultName}
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-gradient-vault flex items-center justify-center">
            <Database className="h-4 w-4 text-white" />
          </div>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          {vault.vaultDesc}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1 h-4 w-4" />
          <span>Created on {createdDate}</span>
        </div>
        <div className="mt-2 text-sm">
          <span className="font-medium">{tableCount}</span> table{tableCount !== 1 && 's'} defined
        </div>
      </CardContent>
      <CardFooter className="mt-auto pt-2">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate(`/vaults/${vault.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VaultCard;
