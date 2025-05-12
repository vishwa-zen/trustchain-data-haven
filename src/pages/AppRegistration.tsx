
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Server, CalendarDays, Plus, X } from 'lucide-react';
import { getVaults, registerApplication, generateAccessToken } from '@/lib/vault';
import { isAuthenticated, hasRole, getCurrentUser } from '@/lib/auth';
import { Vault, AppRegistration, DataSet } from '@/types';
import { toast } from '@/hooks/use-toast';

const AppRegistrationPage = () => {
  const navigate = useNavigate();

  const [vaults, setVaults] = useState<Vault[]>([]);
  const [selectedVaultId, setSelectedVaultId] = useState('');
  const [appName, setAppName] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Data set selections
  const [selectedTables, setSelectedTables] = useState<Record<string, DataSet>>({});

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (!hasRole(['app-owner'])) {
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

  // Handle vault selection change
  const handleVaultChange = (vaultId: string) => {
    setSelectedVaultId(vaultId);
    // Reset selected tables when vault changes
    setSelectedTables({});
  };

  // Toggle table selection
  const toggleTableSelection = (tableName: string) => {
    const selectedVault = vaults.find(v => v.id === selectedVaultId);
    if (!selectedVault || !selectedVault.tables) return;

    const table = selectedVault.tables.find(t => t.tableName === tableName);
    if (!table) return;

    if (selectedTables[tableName]) {
      // Remove selection
      const { [tableName]: _, ...rest } = selectedTables;
      setSelectedTables(rest);
    } else {
      // Add selection
      const newDataSet: DataSet = {
        name: tableName,
        accessToken: generateAccessToken(),
        fields: table.fields.map(field => ({ name: field.name })),
        purpose: [...table.purpose],
        status: 'requested',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
      };

      setSelectedTables({
        ...selectedTables,
        [tableName]: newDataSet
      });
    }
  };

  // Toggle field selection
  const toggleFieldSelection = (tableName: string, fieldName: string) => {
    if (!selectedTables[tableName]) return;

    const fieldExists = selectedTables[tableName].fields.some(f => f.name === fieldName);

    if (fieldExists) {
      // Remove field
      setSelectedTables({
        ...selectedTables,
        [tableName]: {
          ...selectedTables[tableName],
          fields: selectedTables[tableName].fields.filter(f => f.name !== fieldName)
        }
      });
    } else {
      // Add field
      setSelectedTables({
        ...selectedTables,
        [tableName]: {
          ...selectedTables[tableName],
          fields: [...selectedTables[tableName].fields, { name: fieldName }]
        }
      });
    }
  };

  // Handle purpose change
  const handlePurposeChange = (tableName: string, purpose: string) => {
    if (!selectedTables[tableName]) return;

    const purposeExists = selectedTables[tableName].purpose.includes(purpose);

    if (purposeExists) {
      // Remove purpose
      setSelectedTables({
        ...selectedTables,
        [tableName]: {
          ...selectedTables[tableName],
          purpose: selectedTables[tableName].purpose.filter(p => p !== purpose)
        }
      });
    } else {
      // Add purpose
      setSelectedTables({
        ...selectedTables,
        [tableName]: {
          ...selectedTables[tableName],
          purpose: [...selectedTables[tableName].purpose, purpose]
        }
      });
    }
  };

  // Handle expiry date change
  const handleExpiryDateChange = (tableName: string, date: string) => {
    if (!selectedTables[tableName]) return;

    setSelectedTables({
      ...selectedTables,
      [tableName]: {
        ...selectedTables[tableName],
        expiryDate: date
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = getCurrentUser();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to register an application",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedVaultId || !appName || !appDescription || Object.keys(selectedTables).length === 0) {
      toast({
        title: "Error",
        description: "Please complete all required fields and select at least one table",
        variant: "destructive"
      });
      return;
    }

    // Validate that each selected table has at least one field and purpose
    let isValid = true;
    for (const table of Object.values(selectedTables)) {
      if (table.fields.length === 0) {
        toast({
          title: "Error",
          description: `Please select at least one field for table ${table.name}`,
          variant: "destructive"
        });
        isValid = false;
        break;
      }
      
      if (table.purpose.length === 0) {
        toast({
          title: "Error",
          description: `Please select at least one purpose for table ${table.name}`,
          variant: "destructive"
        });
        isValid = false;
        break;
      }
    }

    if (!isValid) return;
    
    setSubmitting(true);
    
    try {
      const registration: AppRegistration = {
        userId: user.id,
        vaultId: selectedVaultId,
        name: appName,
        description: appDescription,
        status: 'pending',
        dataSets: Object.values(selectedTables)
      };
      
      await registerApplication(registration);
      
      toast({
        title: "Success",
        description: "Application registration submitted successfully",
      });
      
      navigate('/applications');
    } catch (error) {
      console.error('Error registering application:', error);
      toast({
        title: "Error",
        description: "Failed to register application",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedVault = vaults.find(v => v.id === selectedVaultId);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Server className="h-6 w-6 mr-2 text-highlight-700" />
                Register Application
              </h1>
              <p className="text-muted-foreground mt-1">
                Register your application to request access to vault data
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
                <CardDescription>
                  Provide information about your application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="appName">Application Name</Label>
                  <Input
                    id="appName"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="e.g., KYC-App"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="appDescription">Description</Label>
                  <Textarea
                    id="appDescription"
                    value={appDescription}
                    onChange={(e) => setAppDescription(e.target.value)}
                    placeholder="Describe how your application will use the data"
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="vaultSelect">Select Vault</Label>
                  <Select value={selectedVaultId} onValueChange={handleVaultChange}>
                    <SelectTrigger id="vaultSelect">
                      <SelectValue placeholder="Select a vault" />
                    </SelectTrigger>
                    <SelectContent>
                      {loading ? (
                        <SelectItem value="loading" disabled>Loading vaults...</SelectItem>
                      ) : vaults.length === 0 ? (
                        <SelectItem value="empty" disabled>No vaults available</SelectItem>
                      ) : (
                        vaults.map(vault => (
                          <SelectItem key={vault.id} value={vault.id}>
                            {vault.vaultName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {selectedVault && selectedVault.tables && selectedVault.tables.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Data Access Request</CardTitle>
                  <CardDescription>
                    Select tables and fields your application needs access to
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedVault.tables.map((table, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Checkbox
                          id={`table-${table.tableName}`}
                          checked={!!selectedTables[table.tableName]}
                          onCheckedChange={() => toggleTableSelection(table.tableName)}
                        />
                        <Label htmlFor={`table-${table.tableName}`} className="text-lg font-medium">
                          {table.tableName}
                        </Label>
                      </div>
                      
                      {selectedTables[table.tableName] && (
                        <>
                          <div className="ml-6 space-y-4">
                            <div>
                              <Label className="text-sm font-medium block mb-2">Fields</Label>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {table.fields.map((field, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <Checkbox
                                      id={`${table.tableName}-field-${field.name}`}
                                      checked={selectedTables[table.tableName].fields.some(f => f.name === field.name)}
                                      onCheckedChange={() => toggleFieldSelection(table.tableName, field.name)}
                                    />
                                    <div className="grid gap-0.5">
                                      <Label 
                                        htmlFor={`${table.tableName}-field-${field.name}`}
                                        className="text-sm"
                                      >
                                        {field.name}
                                      </Label>
                                      <span className={`text-xs security-badge-${field.sensitivity.toLowerCase()}`}>
                                        {field.sensitivity}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium block mb-2">Purposes</Label>
                              <div className="flex flex-wrap gap-2">
                                {table.purpose.map((purpose, i) => (
                                  <div key={i}
                                    className={`px-3 py-1 text-sm rounded-full cursor-pointer select-none transition-colors ${
                                      selectedTables[table.tableName].purpose.includes(purpose)
                                        ? 'bg-vault-600 text-white'
                                        : 'bg-vault-100 text-vault-800 hover:bg-vault-200'
                                    }`}
                                    onClick={() => handlePurposeChange(table.tableName, purpose)}
                                  >
                                    {purpose}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor={`${table.tableName}-expiry`} className="text-sm font-medium block mb-2">
                                Access Expiry Date
                              </Label>
                              <Input
                                id={`${table.tableName}-expiry`}
                                type="date"
                                value={selectedTables[table.tableName].expiryDate.split('T')[0]}
                                onChange={(e) => handleExpiryDateChange(
                                  table.tableName, 
                                  `${e.target.value}T23:59:59Z`
                                )}
                                min={new Date().toISOString().split('T')[0]}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={
                  loading || 
                  submitting || 
                  !selectedVaultId || 
                  !appName || 
                  Object.keys(selectedTables).length === 0
                }
              >
                {submitting ? 'Submitting...' : 'Register Application'}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AppRegistrationPage;
