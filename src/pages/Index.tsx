
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Database, Lock, Key } from 'lucide-react';
import { isAuthenticated } from '@/lib/auth';

const Index = () => {
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();

  React.useEffect(() => {
    // Redirect to dashboard if already logged in
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6 text-vault-700" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vault-700 to-security-600">
              Trustchain
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button onClick={() => navigate('/register')}>
              Register
            </Button>
          </div>
        </div>
      </header>
      
      <main>
        <section className="py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-vault-800 via-vault-600 to-security-700">
                Secure Data Vaults for the Modern Enterprise
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Trustchain provides a secure and compliant way to store, access, and share sensitive data with fine-grained access controls and complete audit trails.
              </p>
              <div className="mt-10 flex items-center justify-center gap-6">
                <Button size="lg" onClick={() => navigate('/register')}>
                  Get Started
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-vault-50">
          <div className="container">
            <h2 className="text-2xl font-bold text-center mb-12">
              Enterprise-grade Security Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-card">
                <div className="h-12 w-12 rounded-lg bg-gradient-vault flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2">Secure Vaults</h3>
                <p className="text-muted-foreground">
                  Create isolated data vaults with specific access controls and purpose definitions.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-card">
                <div className="h-12 w-12 rounded-lg bg-gradient-security flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2">Role-based Access</h3>
                <p className="text-muted-foreground">
                  Define granular access controls based on roles and purposes for each data field.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-card">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-highlight-600 to-highlight-700 flex items-center justify-center mb-4">
                  <Key className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2">Tokenization</h3>
                <p className="text-muted-foreground">
                  Replace sensitive data with non-sensitive tokens for secure processing and storage.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-vault-900 text-white py-10">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 font-semibold mb-4 md:mb-0">
              <Shield className="h-5 w-5 text-white" />
              <span className="text-lg font-bold text-white">
                Trustchain
              </span>
            </div>
            <div className="text-sm text-vault-100">
              © 2025 Trustchain. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
