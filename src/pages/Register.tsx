
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { registerUser, UserRole, isAuthenticated } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('app-owner');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Redirect to dashboard if already logged in
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const user = await registerUser(firstName, lastName, email, password, role);
      toast({
        title: "Registration successful",
        description: `Welcome, ${user.firstName}!`,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
          <CardTitle className="text-2xl font-bold text-center">Register</CardTitle>
          <CardDescription className="text-center">
            Create your account to access Trustchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pr-10 transition-all"
                />
                <button 
                  type="button" 
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">Role</Label>
              <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                <SelectTrigger id="role" className="transition-all">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="app-owner">App Owner</SelectItem>
                  <SelectItem value="data-steward">Data Steward</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 animate-pulse" /> Registering...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-center w-full">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-primary hover:text-primary/80 font-medium hover:underline underline-offset-4 transition-colors"
            >
              Login
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

export default Register;
