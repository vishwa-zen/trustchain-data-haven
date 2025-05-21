
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AppSidebar from '@/components/AppSidebar';
import VaultCard from '@/components/VaultCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Plus } from 'lucide-react';
import { getVaults, createVault } from '@/lib/vault';
import { getCurrentUser, isAuthenticated, hasRole } from '@/lib/auth';
import { Vault } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useSidebar } from '@/components/ui/sidebar';

const VaultManagement = () => {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [vaultName, setVaultName] = useState('');
  const [vaultDesc, setVaultDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { state } = useSidebar();
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (!hasRole(['data-steward', 'admin'])) {
      navigate('/dashboard');
      return;
    }

    const loadVaults = async () => {
      setLoading(true);
      try {
        const vaultsData = await getVaults();
        setVaults(vaultsData);
      } catch (error) {
        console.error('Error loading vaults:', error);
        toast({
          title: "Error",
          description: "Failed to load vaults",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadVaults();
  }, [navigate]);

  const handleCreateVault = async () => {
    if (!vaultName || !vaultDesc) {
      toast({
        title: "Error",
        description: "Vault name and description are required",
        variant: "destructive"
      });
      return;
    }
    
    setCreating(true);
    
    try {
      const newVault = await createVault(vaultName, vaultDesc);
      setVaults([...vaults, newVault]);
      setCreateDialogOpen(false);
      setVaultName('');
      setVaultDesc('');
      
      toast({
        title: "Success",
        description: "Vault created successfully",
      });
    } catch (error) {
      console.error('Error creating vault:', error);
      toast({
        title: "Error",
        description: "Failed to create vault",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const filteredVaults = vaults.filter(vault => 
    vault.vaultName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    vault.vaultDesc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate content class based on sidebar state
  const contentClass = `flex-1 p-6 pt-20 overflow-auto ${state === "collapsed" ? "md:ml-12" : ""}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex w-full h-full">
        <Navbar />
        <AppSidebar />
        <main className={contentClass}>
          <div className="flex justify-between items-center mb-6 w-full min-w-0">
            <h1 className="text-2xl font-bold truncate pr-4">Vault Management</h1>
            <Button className="shrink-0 whitespace-nowrap ml-auto" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Create Vault
            </Button>
          </div>
          
          <div className="mb-6">
            <Input
              placeholder="Search vaults by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              [1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse-slow w-full shadow-sm">
                  <CardHeader>
                    <CardTitle className="bg-muted h-6 w-2/3 rounded-md" />
                    <CardDescription className="bg-muted h-4 w-full rounded-md mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted h-4 w-1/2 rounded-md" />
                  </CardContent>
                </Card>
              ))
            ) : filteredVaults.length === 0 ? (
              <Card className="col-span-full w-full shadow-sm">
                <CardHeader>
                  <CardTitle>No Vaults Found</CardTitle>
                  <CardDescription>
                    {searchTerm ? 'No vaults match your search criteria.' : 'Create your first vault to get started.'}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Create Vault
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              filteredVaults.map(vault => (
                <VaultCard key={vault.id} vault={vault} />
              ))
            )}
          </div>
          
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" /> Create New Vault
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="vaultName">Vault Name</Label>
                  <Input 
                    id="vaultName" 
                    value={vaultName} 
                    onChange={(e) => setVaultName(e.target.value)}
                    placeholder="e.g., kyc_vault"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vaultDesc">Description</Label>
                  <Textarea 
                    id="vaultDesc" 
                    value={vaultDesc} 
                    onChange={(e) => setVaultDesc(e.target.value)}
                    placeholder="Describe the purpose and content of this vault"
                    rows={3}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateVault} disabled={creating}>
                  {creating ? 'Creating...' : 'Create Vault'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default VaultManagement;
