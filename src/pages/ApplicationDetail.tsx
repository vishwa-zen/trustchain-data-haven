
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { generateAccessToken } from '@/lib/vault';
import { toast } from '@/hooks/use-toast';
import { Copy, RefreshCw } from 'lucide-react';
import ResourceAuditLogs from '@/components/ResourceAuditLogs';
import { getApplicationById, Application } from '@/lib/applications';

interface ExtendedApplication extends Application {
  // Add any additional properties needed for the component
}

const ApplicationDetail = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [application, setApplication] = useState<ExtendedApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const loadApplication = async () => {
      if (!applicationId) {
        console.error("No applicationId provided");
        return;
      }
      try {
        setIsLoading(true);
        const app = await getApplicationById(applicationId);
        setApplication(app as ExtendedApplication);
      } catch (error) {
        console.error("Failed to load application:", error);
        toast({
          title: "Error",
          description: "Failed to load application details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadApplication();
  }, [applicationId]);

  const handleGenerateAccessToken = async () => {
    if (!applicationId) {
      toast({
        title: "Error",
        description: "Application ID is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = await generateAccessToken(applicationId);
      setAccessToken(token);
      toast({
        title: "Access Key Generated",
        description: "A new access key has been generated for this application.",
      });
    } catch (error) {
      console.error("Failed to generate access key:", error);
      toast({
        title: "Error",
        description: "Failed to generate access key.",
        variant: "destructive",
      });
    }
  };

  const handleCopyAccessToken = () => {
    if (accessToken) {
      navigator.clipboard.writeText(accessToken);
      toast({
        title: "Access Key Copied",
        description: "The access key has been copied to your clipboard.",
      });
    } else {
      toast({
        title: "No Key",
        description: "No access key available to copy.",
        variant: "destructive", // Changed from "warning" to "destructive"
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            {isLoading ? (
              <div>Loading application details...</div>
            ) : application ? (
              <>
                <h1 className="text-2xl font-bold tracking-tight">{application.name}</h1>
                <p className="text-muted-foreground">
                  {application.description}
                </p>
              </>
            ) : (
              <div>Application not found.</div>
            )}
          </div>
          
          {application && (
            <>
              <Tabs defaultValue="details" className="mt-6">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="access-keys">Access Keys</TabsTrigger>
                  <TabsTrigger value="activity">Activity Logs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <Card>
                    <CardHeader>
                      <CardTitle>Application Details</CardTitle>
                      <CardDescription>
                        View detailed information about this application.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <span className="font-semibold">Name:</span> {application.name}
                        </div>
                        <div>
                          <span className="font-semibold">Description:</span> {application.description}
                        </div>
                        <div>
                          <span className="font-semibold">Status:</span> {application.status}
                        </div>
                        <div>
                          <span className="font-semibold">Vault ID:</span> {application.vaultId}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="access-keys">
                  <Card>
                    <CardHeader>
                      <CardTitle>Access Keys</CardTitle>
                      <CardDescription>
                        Manage access keys for this application.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {accessToken ? (
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono">{accessToken.substring(0, 15)}...</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopyAccessToken}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p>No access key generated for this application.</p>
                        )}
                        <Button onClick={handleGenerateAccessToken}>
                          <RefreshCw className="h-3 w-3 mr-2" />
                          Generate Access Key
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="activity">
                  <ResourceAuditLogs 
                    resourceType="application" 
                    resourceId={application.id} 
                  />
                </TabsContent>
              </Tabs>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ApplicationDetail;
