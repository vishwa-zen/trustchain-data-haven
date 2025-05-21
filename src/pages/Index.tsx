
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Database, Lock, Key, Cloud, FileLock } from 'lucide-react';
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
      <header className="border-b bg-vault-50">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <img 
              src="https://static.wixstatic.com/media/574264_84849ef802594972ae3eadd463ec8dc0~mv2.png/v1/fill/w_160,h_190,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/zen_ac_color.png" 
              alt="Zentience Logo" 
              className="h-10 w-auto"
            />
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
        
        {/* New section about encryption technology */}
        <section className="py-16 bg-vault-100">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">
                Advanced Encryption Technology
              </h2>
              <p className="text-lg text-center mb-12 text-vault-900">
                Trustchain ensures data integrity and confidentiality by securely scrambling, fragmenting, and encrypting files using proprietary algorithms.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-card border border-vault-200">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-security flex items-center justify-center">
                      <FileLock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Distributed Storage</h3>
                      <p className="text-muted-foreground">
                        Encrypted fragments are distributed across trusted networks, creating a decentralized micro-community for custodianship without granting access to the actual file content.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-xl shadow-card border border-vault-200">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-vault flex items-center justify-center">
                      <Cloud className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Robust Recovery</h3>
                      <p className="text-muted-foreground">
                        Trustchain enables robust data recovery through majority custodian approval, mimicking multi-factor authentication to ensure security and resilience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-lg font-medium text-vault-800">
                  Reimagining data privacy, empowering both individuals and enterprises to manage sensitive information with unparalleled security.
                </p>
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
      
      <footer className="bg-vault-900 text-white py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 font-semibold mb-4 md:mb-0">
              <img 
                src="https://static.wixstatic.com/media/574264_84849ef802594972ae3eadd463ec8dc0~mv2.png/v1/fill/w_160,h_190,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/zen_ac_color.png" 
                alt="Zentience Logo" 
                className="h-8 w-auto"
              />
              <span className="text-lg font-bold text-white">
                Trustchain
              </span>
            </div>
            <div className="text-sm text-vault-100">
              Copyright © Zentience - All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
