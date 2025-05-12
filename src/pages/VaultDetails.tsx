
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import TableForm from '@/components/TableForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, CalendarDays, Plus, Shield } from 'lucide-react';
import { getVaultById, createVaultTables } from '@/lib/vault';
import { isAuthenticated, hasRole, getCurrentUser } from '@/lib/auth';
import { Vault, VaultTable } from '@/types';
import { toast } from '@/hooks/use-toast';

const VaultDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [vault, setVault] = useState<Vault | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddTable, setShowAddTable] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
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

    if (!id) {
      navigate('/vaults');
      return;
    }

    const loadVault = async () => {
      setLoading(true);
      try {
        const vaultData = await getVaultById(id);
        if (vaultData) {
          setVault(vaultData);
        } else {
          toast({
            title: "Error",
            description: "Vault not found",
            variant: "destructive"
          });
          navigate('/vaults');
        }
      } catch (error) {
        console.error('Error loading vault:', error);
        toast({
          title: "Error",
          description: "Failed to load vault details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadVault();
  }, [id, navigate]);

  const handleAddTable = async (table: VaultTable) => {
    if (!vault || !id) return;
    
    try {
      const user = getCurrentUser();
      if (!user) throw new Error("Not authenticated");
      
      const updatedVault = await createVaultTables({
        userId: user.id,
        vaultId: id,
        vaultName: vault.vaultName,
        tables: [...(vault.tables || []), table]
      });
      
      setVault(updatedVault);
      setShowAddTable(false);
      
      toast({
        title: "Success",
        description: "Table added successfully",
      });
    } catch (error) {
      console.error('Error adding table:', error);
      toast({
        title: "Error",
        description: "Failed to add table",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex justify-center items-center h-full">
              <p>Loading vault details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!vault) return null;

  const createdDate = new Date(vault.createdAt).toLocaleDateString();
  const tables = vault.tables || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Database className="h-6 w-6 mr-2 text-vault-700" />
                {vault.vaultName}
              </h1>
              <p className="text-muted-foreground mt-1">{vault.vaultDesc}</p>
            </div>
            <div>
              <Button 
                onClick={() => {
                  setActiveTab('tables');
                  setShowAddTable(true);
                }}
                disabled={showAddTable}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Table
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tables">Tables</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Vault Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-sm font-medium">ID</span>
                    <span className="text-sm font-mono">{vault.id}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-sm font-medium">Created On</span>
                    <span className="text-sm flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      {createdDate}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-sm font-medium">Tables</span>
                    <span className="text-sm">{tables.length}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                  <CardDescription>Key metrics about your vault</CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-vault-50 rounded-md p-4">
                    <div className="text-sm text-vault-700 font-medium">Total Tables</div>
                    <div className="text-2xl font-bold text-vault-900">{tables.length}</div>
                  </div>
                  <div className="bg-security-50 rounded-md p-4">
                    <div className="text-sm text-security-700 font-medium">Total Fields</div>
                    <div className="text-2xl font-bold text-security-900">
                      {tables.reduce((acc, table) => acc + table.fields.length, 0)}
                    </div>
                  </div>
                  <div className="bg-highlight-50 rounded-md p-4">
                    <div className="text-sm text-highlight-700 font-medium">High Sensitivity Fields</div>
                    <div className="text-2xl font-bold text-highlight-900">
                      {tables.reduce(
                        (acc, table) => acc + table.fields.filter(f => f.sensitivity === 'HIGH').length, 
                        0
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tables" className="space-y-4">
              {showAddTable ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Table</CardTitle>
                    <CardDescription>
                      Define the schema for a new table in this vault
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TableForm 
                      onSubmit={handleAddTable}
                      onCancel={() => setShowAddTable(false)}
                    />
                  </CardContent>
                </Card>
              ) : tables.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No Tables Defined</CardTitle>
                    <CardDescription>
                      This vault doesn't have any tables defined yet.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => setShowAddTable(true)}>
                      <Plus className="h-4 w-4 mr-2" /> Add First Table
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {tables.map((table, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle>{table.tableName}</CardTitle>
                          <div className="text-xs bg-vault-100 text-vault-800 px-2 py-1 rounded-full">
                            {table.fields.length} fields
                          </div>
                        </div>
                        <CardDescription>{table.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-2">
                          <div className="text-sm font-medium">Purpose:</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {table.purpose.map((p, i) => (
                              <span 
                                key={i}
                                className="text-xs bg-vault-100 text-vault-800 px-2 py-0.5 rounded-full"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="border rounded-md overflow-hidden mt-4">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-muted">
                                <th className="py-2 px-4 text-left">Field</th>
                                <th className="py-2 px-4 text-left">Type</th>
                                <th className="py-2 px-4 text-left">Sensitivity</th>
                                <th className="py-2 px-4 text-left">Access Control</th>
                              </tr>
                            </thead>
                            <tbody>
                              {table.fields.map((field, i) => (
                                <tr key={i} className="border-t">
                                  <td className="py-2 px-4 font-medium">{field.name}</td>
                                  <td className="py-2 px-4">{field.type}</td>
                                  <td className="py-2 px-4">
                                    <span className={`security-badge-${field.sensitivity.toLowerCase()}`}>
                                      {field.sensitivity}
                                    </span>
                                  </td>
                                  <td className="py-2 px-4">
                                    <div className="flex flex-wrap gap-1">
                                      {field.accessControl.map((role, j) => (
                                        <span key={j} className="text-xs bg-slate-100 px-1 py-0.5 rounded">
                                          {role}
                                        </span>
                                      ))}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Configuration</CardTitle>
                  <CardDescription>
                    Security settings and encryption for this vault
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-green-50 text-green-800 rounded-md">
                    <Shield className="h-5 w-5" />
                    <span>Encryption is enabled for this vault</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Access Control Summary</h4>
                    <div className="space-y-2">
                      {tables.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No access control rules defined yet. Add tables to configure access.
                        </p>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-muted rounded-md">
                              <div className="text-sm font-medium">Total Access Roles</div>
                              <div className="text-xl font-bold mt-1">
                                {new Set(
                                  tables.flatMap(t => 
                                    t.fields.flatMap(f => f.accessControl)
                                  )
                                ).size}
                              </div>
                            </div>
                            <div className="p-3 bg-muted rounded-md">
                              <div className="text-sm font-medium">High Sensitivity Fields</div>
                              <div className="text-xl font-bold mt-1">
                                {tables.reduce(
                                  (acc, table) => acc + table.fields.filter(f => f.sensitivity === 'HIGH').length, 
                                  0
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <h5 className="text-sm font-medium mb-2">Access Roles</h5>
                            <div className="flex flex-wrap gap-2">
                              {Array.from(
                                new Set(
                                  tables.flatMap(t => 
                                    t.fields.flatMap(f => f.accessControl)
                                  )
                                )
                              ).map((role, i) => (
                                <div 
                                  key={i}
                                  className="bg-security-100 text-security-800 px-3 py-1 rounded-md text-sm"
                                >
                                  {role}
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default VaultDetails;
