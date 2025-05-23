
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Key, RefreshCw, Copy } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const TokenManagement = () => {
  const navigate = useNavigate();
  const { id: appId } = useParams();
  const user = getCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [applicationName, setApplicationName] = useState('');
  
  // Updated token data to show application-level access keys
  const [tokens, setTokens] = useState([
    {
      id: '1',
      name: 'API Access Key',
      type: 'api_token',
      applicationName: 'All Applications',
      applicationId: null,
      token: 'tk_live_' + uuidv4().split('-')[0],
      createdAt: '2025-04-15T10:30:00Z',
      expiresAt: '2026-04-15T10:30:00Z',
      lastUsed: '2025-05-10T14:22:33Z',
    },
    {
      id: '2',
      name: 'Application Access Key',
      type: 'access_key',
      applicationName: 'Payment Gateway',
      applicationId: 'app-2',
      token: 'app_tk_' + uuidv4().split('-')[0],
      createdAt: '2025-03-22T08:15:00Z',
      expiresAt: '2025-09-22T08:15:00Z',
      lastUsed: '2025-05-11T09:45:12Z',
    },
    {
      id: '3',
      name: 'Application Access Key',
      type: 'access_key',
      applicationName: 'KYC Application',
      applicationId: 'app-1',
      token: 'app_tk_' + uuidv4().split('-')[0],
      createdAt: '2025-04-10T11:20:00Z',
      expiresAt: '2025-10-10T11:20:00Z',
      lastUsed: '2025-05-12T16:30:45Z',
    },
  ]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // If we have an appId, filter tokens by that application
    if (appId) {
      // Find application name for the header
      const appToken = tokens.find(t => t.applicationId === appId);
      if (appToken) {
        setApplicationName(appToken.applicationName);
      } else {
        // If no matching application found, show all tokens
        setApplicationName('Unknown Application');
      }
    }
  }, [user, navigate, appId, tokens]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast('Access Key Copied', {
      description: 'The access key has been copied to your clipboard',
    });
  };

  const handleRegenerateToken = (id: string) => {
    const newToken = 
      tokens.find(t => t.id === id)?.type === 'api_token' 
        ? 'tk_live_' + uuidv4().split('-')[0] 
        : 'app_tk_' + uuidv4().split('-')[0];
    
    setTokens(tokens.map(token => 
      token.id === id 
        ? {...token, token: newToken, createdAt: new Date().toISOString()} 
        : token
    ));
    toast('Access Key Regenerated', {
      description: 'A new access key has been generated',
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
      id: uuidv4(),
      name: appId ? 'Application Access Key' : 'API Access Key',
      type: appId ? 'access_key' : 'api_token',
      applicationName: applicationName || 'All Applications',
      applicationId: appId || null,
      token: appId ? 'app_tk_' + uuidv4().split('-')[0] : 'tk_live_' + uuidv4().split('-')[0],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
      lastUsed: new Date().toISOString(),
    };
    
    setTokens([...tokens, newToken]);
    
    toast('New Access Key Created', {
      description: 'A new API access key has been created',
    });
  };

  // Filter tokens by application if appId is provided, otherwise show all
  const filteredTokens = tokens
    .filter(token => appId ? token.applicationId === appId || token.type === 'api_token' : true)
    .filter(token => 
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      token.applicationName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-1 justify-center">
          <main className="w-full max-w-5xl pt-20 px-6 pb-6 overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {appId ? `${applicationName} - Access Keys` : 'Access Key Management'}
                </h1>
                <p className="text-muted-foreground">
                  Manage access keys for your applications
                </p>
              </div>
              <Button onClick={handleCreateNewToken}>
                <Key className="mr-2 h-4 w-4" />
                Create New Key
              </Button>
            </div>

            <div className="mb-6">
              <Input
                placeholder="Search keys or applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Access Keys</CardTitle>
                <CardDescription>
                  API Access Keys work across all your applications, while Application Access Keys are assigned to specific applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Application</TableHead>
                      <TableHead>Key</TableHead>
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
    </div>
  );
};

export default TokenManagement;
