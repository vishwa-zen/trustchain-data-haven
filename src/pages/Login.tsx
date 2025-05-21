
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { loginUser, isAuthenticated, getUserRoleByEmail } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Handle email change and update role
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Check if email exists in our system and get role
    if (newEmail.includes('@')) {
      const role = getUserRoleByEmail(newEmail);
      setUserRole(role);
    } else {
      setUserRole(null);
    }
  };

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to get role badge color based on role
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'app-owner':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'data-steward':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cto-user':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'dpo-user':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'csio-user':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background p-4 md:p-6">
      <div className="flex flex-col items-center gap-2 mb-8 animate-fade-in">
        <img 
          src="https://static.wixstatic.com/media/574264_84849ef802594972ae3eadd463ec8dc0~mv2.png/v1/fill/w_160,h_190,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/zen_ac_color.png" 
          alt="Trustchain Logo" 
          className="h-14 w-auto hover:scale-105 transition-transform duration-300 drop-shadow-lg" 
        />
        <h1 className="text-3xl font-bold text-foreground drop-shadow-sm mt-2 text-center">
          Trustchain
        </h1>
      </div>
      
      <Card className="w-full max-w-md shadow-lg animate-fade-in border-input">
        <div className="h-1 bg-primary"></div>
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={handleEmailChange}
                required
                className="transition-all"
              />
              {userRole && (
                <div className="mt-2 animate-fade-in">
                  <div className="p-3 rounded-md bg-secondary/50 border border-border/50 flex items-center gap-3 shadow-sm">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-xs font-medium text-muted-foreground">Account type</span>
                      <Badge 
                        variant="outline" 
                        className={`mt-0.5 text-xs py-1 px-2 font-medium ${getRoleBadgeColor(userRole)}`}
                      >
                        {userRole.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Link 
                  to="/forgot-password"
                  className="text-xs text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10 transition-all"
                />
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={loading}
            >
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
        <CardFooter className="flex justify-center">
          <div className="text-sm text-center w-full">
            Don't have an account?{" "}
            <Link 
              to="/register" 
              className="text-primary hover:text-primary/80 font-medium hover:underline underline-offset-4 transition-colors"
            >
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
      
      <div className="mt-6 text-sm text-muted-foreground text-center animate-fade-in">
        Copyright © Zentience - All Rights Reserved.
      </div>
    </div>
  );
};

export default Login;
