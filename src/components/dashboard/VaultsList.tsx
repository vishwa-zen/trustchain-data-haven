
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Database } from 'lucide-react';
import { Vault } from '@/types';

interface VaultsListProps {
  vaults: Vault[];
  loading: boolean;
}

const VaultsList: React.FC<VaultsListProps> = ({ vaults, loading }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Vaults</h2>
        <Button onClick={() => navigate('/vaults')}>
          Manage Vaults
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <Card className="animate-pulse-slow">
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
            </CardHeader>
          </Card>
        ) : (
          vaults.slice(0, 3).map(vault => (
            <Card key={vault.id} className="animate-fade-in">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{vault.vaultName}</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-gradient-vault flex items-center justify-center">
                    <Database className="h-4 w-4 text-white" />
                  </div>
                </div>
                <CardDescription>{vault.vaultDesc}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/vaults/${vault.id}`)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default VaultsList;
