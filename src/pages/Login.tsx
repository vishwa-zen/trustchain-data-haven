
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { loginUser, isAuthenticated } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Redirect to dashboard if already logged in
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      const user = await loginUser(email, password);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.firstName}!`,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-vault-50 p-4">
      <div className="flex flex-col items-center gap-2 mb-8">
        <img 
          src="https://static.wixstatic.com/media/574264_84849ef802594972ae3eadd463ec8dc0~mv2.png/v1/fill/w_160,h_190,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/zen_ac_color.png" 
          alt="Trustchain Logo" 
          className="h-12 w-auto" 
        />
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vault-700 to-security-600">
          Trustchain
        </h1>
      </div>
      
      <Card className="w-full max-w-md shadow-card animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  to="/forgot-password"
                  className="text-xs text-vault-700 hover:text-vault-900 underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4 animate-pulse" /> Logging in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-center w-full">
            Don't have an account?{" "}
            <Link 
              to="/register" 
              className="text-vault-700 hover:text-vault-900 font-medium hover:underline underline-offset-4"
            >
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
      
      <div className="mt-6 text-sm text-muted-foreground text-center">
        Copyright © Zentience - All Rights Reserved.
      </div>
    </div>
  );
};

export default Login;
