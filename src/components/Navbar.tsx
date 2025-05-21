
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { logoutUser, getCurrentUser } from '@/lib/auth';
import { SidebarTrigger } from '@/components/ui/sidebar';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b bg-vault-50 shadow-sm"> {/* Fixed z-index to be above sidebar */}
      <div className="flex h-14 items-center px-4">
        <SidebarTrigger className="mr-4 md:hidden" /> {/* Only show trigger on mobile, we'll use the rail on desktop */}
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <img 
            src="https://static.wixstatic.com/media/574264_84849ef802594972ae3eadd463ec8dc0~mv2.png/v1/fill/w_160,h_190,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/zen_ac_color.png" 
            alt="Zentience Logo" 
            className="h-8 w-auto"
          />
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
