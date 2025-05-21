
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Key, RefreshCw, Copy } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const TokenManagement = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock token data with user-level API tokens and app-specific access keys
  const [tokens, setTokens] = useState([
    {
      id: '1',
      name: 'API Access Token',
      type: 'api_token',
      applicationName: 'All Applications',
      applicationId: null,
      token: 'tk_live_' + crypto.randomUUID().split('-')[0],
      createdAt: '2025-04-15T10:30:00Z',
      expiresAt: '2026-04-15T10:30:00Z',
      lastUsed: '2025-05-10T14:22:33Z',
    },
    {
      id: '2',
      name: 'Access Key',
      type: 'access_key',
      applicationName: 'Payment Gateway',
      applicationId: 'app-456',
      token: 'tk_live_' + crypto.randomUUID().split('-')[0],
      createdAt: '2025-03-22T08:15:00Z',
      expiresAt: '2025-09-22T08:15:00Z',
      lastUsed: '2025-05-11T09:45:12Z',
    },
    {
      id: '3',
      name: 'Access Key',
      type: 'access_key',
      applicationName: 'Customer Portal',
      applicationId: 'app-123',
      token: 'tk_live_' + crypto.randomUUID().split('-')[0],
      createdAt: '2025-04-10T11:20:00Z',
      expiresAt: '2025-10-10T11:20:00Z',
      lastUsed: '2025-05-12T16:30:45Z',
    },
  ]);

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast({
      title: 'Token Copied',
      description: 'The token has been copied to your clipboard',
    });
  };

  const handleRegenerateToken = (id: string) => {
    const newToken = 'tk_live_' + crypto.randomUUID().split('-')[0];
    setTokens(tokens.map(token => 
      token.id === id 
        ? {...token, token: newToken, createdAt: new Date().toISOString()} 
        : token
    ));
    toast({
      title: 'Token Regenerated',
      description: 'A new token has been generated',
    });
  };

  const handleViewApplication = (applicationId: string | null) => {
    if (applicationId) {
      navigate(`/applications/${applicationId}`);
    }
  };

  const getApplicationCell = (token: any) => {
    if (token.type === 'api_token') {
      return (
        <span className="text-sm text-gray-600">
          {token.applicationName}
        </span>
      );
    } else {
      return (
        <span className="text-sm font-medium text-blue-600 cursor-pointer hover:underline" 
              onClick={() => handleViewApplication(token.applicationId)}>
          {token.applicationName}
        </span>
      );
    }
  };

  const handleCreateNewToken = () => {
    const newToken = {
      id: crypto.randomUUID(),
      name: 'API Access Token',
      type: 'api_token',
      applicationName: 'All Applications',
      applicationId: null,
      token: 'tk_live_' + crypto.randomUUID().split('-')[0],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
      lastUsed: new Date().toISOString(),
    };
    
    setTokens([...tokens, newToken]);
    
    toast({
      title: 'New Token Created',
      description: 'A new API access token has been created',
    });
  };

  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    token.applicationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Token Management</h1>
              <p className="text-muted-foreground">
                Manage access tokens for your applications
              </p>
            </div>
            <Button onClick={handleCreateNewToken}>
              <Key className="mr-2 h-4 w-4" />
              Create New Token
            </Button>
          </div>

          <div className="mb-6">
            <Input
              placeholder="Search tokens or applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Access Tokens</CardTitle>
              <CardDescription>
                API Access Tokens work across all your applications, while Access Keys are application-specific
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Application</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTokens.map((token) => (
                    <TableRow key={token.id}>
                      <TableCell className="font-medium">{token.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getApplicationCell(token)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono">{token.token.substring(0, 8)}...</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyToken(token.token)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(token.createdAt)}</TableCell>
                      <TableCell>{formatDate(token.expiresAt)}</TableCell>
                      <TableCell>{formatDate(token.lastUsed)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRegenerateToken(token.id)}
                        >
                          <RefreshCw className="h-3 w-3 mr-2" />
                          Regenerate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default TokenManagement;
