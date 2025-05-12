
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, LogOut } from 'lucide-react';
import { logoutUser, getCurrentUser } from '@/lib/auth';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="border-b bg-white">
      <div className="flex h-16 items-center px-8">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Shield className="h-6 w-6 text-vault-700" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vault-700 to-security-600">
            Trustchain
          </span>
        </Link>
        
        <div className="ml-auto flex items-center gap-4">
          {user && (
            <>
              <span className="text-sm text-muted-foreground">
                {user.firstName} {user.lastName}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
