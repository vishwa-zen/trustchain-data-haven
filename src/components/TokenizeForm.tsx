import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { tokenizeData, detokenizeData } from '@/lib/vault';
import { getCurrentUser } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';

interface TokenizeFormProps {
  vaultId: string;
  appId: string;
}

const TokenizeForm: React.FC<TokenizeFormProps> = ({ vaultId, appId }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  
  const [tokens, setTokens] = useState<Record<string, string>>({});
  const [accessKey, setAccessKey] = useState('');
  
  const [detokenizeInput, setDetokenizeInput] = useState('');
  const [detokenizeResult, setDetokenizeResult] = useState<Record<string, any>>({});
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleTokenize = async () => {
    setIsLoading(true);
    const user = getCurrentUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to tokenize data",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      const data = {
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phoneNumber,
        pan_number: panNumber,
        aadhar_number: aadharNumber
      };
      
      const response = await tokenizeData({
        userId: user.id,
        vaultId,
        appId,
        data
      });
      
      setTokens(response.tokens);
      setAccessKey(response.accessKey);
      
      toast({
        title: "Success",
        description: "Data successfully tokenized",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to tokenize data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDetokenize = async () => {
    setIsLoading(true);
    const user = getCurrentUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to detokenize data",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Parse input tokens
      let tokenList: string[] = [];
      try {
        tokenList = JSON.parse(detokenizeInput);
        if (!Array.isArray(tokenList)) {
          tokenList = [detokenizeInput];
        }
      } catch {
        tokenList = detokenizeInput.split(',').map(t => t.trim());
      }
      
      const response = await detokenizeData({
        userId: user.id,
        vaultId,
        appId,
        accessKey,
        tokens: tokenList
      });
      
      setDetokenizeResult(response.data);
      
      toast({
        title: "Success",
        description: "Data successfully detokenized",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to detokenize data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Data Tokenization</CardTitle>
        <CardDescription>
          Tokenize and detokenize sensitive data with appropriate access controls.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tokenize">
          <TabsList className="mb-4">
            <TabsTrigger value="tokenize">Tokenize</TabsTrigger>
            <TabsTrigger value="detokenize">Detokenize</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tokenize">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="panNumber">PAN Number</Label>
                  <Input
                    id="panNumber"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="aadharNumber">Aadhar Number</Label>
                  <Input
                    id="aadharNumber"
                    value={aadharNumber}
                    onChange={(e) => setAadharNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <Button 
              className="mt-6 w-full"
              onClick={handleTokenize}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Tokenize Data"}
            </Button>
            
            {Object.keys(tokens).length > 0 && (
              <div className="mt-6 p-4 border rounded-md bg-muted/40">
                <h4 className="text-sm font-medium mb-2">Tokens Generated</h4>
                <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                  {JSON.stringify(tokens, null, 2)}
                </pre>
                <div className="mt-4">
                  <Label htmlFor="accessKey">Access Key (Store securely)</Label>
                  <Input
                    id="accessKey"
                    value={accessKey}
                    readOnly
                  />
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="detokenize">
            <div className="space-y-4">
              <div>
                <Label htmlFor="accessKey">Access Key</Label>
                <Input
                  id="accessKey"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="Enter your access key"
                />
              </div>
              
              <div>
                <Label htmlFor="tokens">Tokens (comma separated or JSON array)</Label>
                <Textarea
                  id="tokens"
                  value={detokenizeInput}
                  onChange={(e) => setDetokenizeInput(e.target.value)}
                  placeholder="Enter tokens to detokenize"
                  rows={4}
                />
              </div>
              
              <Button 
                className="w-full"
                onClick={handleDetokenize}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Detokenize Data"}
              </Button>
              
              {Object.keys(detokenizeResult).length > 0 && (
                <div className="mt-4 p-4 border rounded-md bg-muted/40">
                  <h4 className="text-sm font-medium mb-2">Detokenized Data</h4>
                  <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                    {JSON.stringify(detokenizeResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TokenizeForm;
