
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Shield, 
  Database, 
  Key, 
  Settings, 
  Lock,
  Users,
  Server,
  FileCheck,
  BarChart4,
  AlertCircle
} from 'lucide-react';
import { getCurrentUser, hasRole } from '@/lib/auth';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const AppSidebar: React.FC = () => {
  const user = getCurrentUser();
  
  if (!user) return null;
  
  const canManageVaults = hasRole(['data-steward', 'admin']);
  const canManageConsent = hasRole(['admin', 'cto-user', 'dpo-user', 'csio-user']);
  
  // Check for specific roles
  const isSpecialRole = ['cto-user', 'dpo-user', 'csio-user'].includes(user.role);
  const canAccessTokens = user.role === 'app-owner' && !isSpecialRole;

  // Custom NavLink wrapper to work with SidebarMenuButton
  const SidebarNavLink = ({ to, icon: Icon, children }: { to: string; icon: React.ElementType; children: React.ReactNode }) => (
    <NavLink to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
      {({ isActive }) => (
        <SidebarMenuButton isActive={isActive} tooltip={children as string}>
          <Icon size={18} />
          <span>{children}</span>
        </SidebarMenuButton>
      )}
    </NavLink>
  );
  
  return (
    <Sidebar className="pt-16"> {/* Increased padding-top to ensure content is below navbar */}
      <SidebarHeader className="invisible h-0 p-0" /> {/* Empty header to maintain spacing */}
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarNavLink to="/dashboard" icon={Shield}>
              Dashboard
            </SidebarNavLink>
          </SidebarMenuItem>
          
          {canManageVaults && (
            <SidebarMenuItem>
              <SidebarNavLink to="/vaults" icon={Database}>
                Vaults
              </SidebarNavLink>
            </SidebarMenuItem>
          )}
          
          {(user.role === 'app-owner' || isSpecialRole) && (
            <SidebarMenuItem>
              <SidebarNavLink to="/applications" icon={Server}>
                Applications
              </SidebarNavLink>
            </SidebarMenuItem>
          )}
          
          {canAccessTokens && (
            <SidebarMenuItem>
              <SidebarNavLink to="/tokens" icon={Key}>
                Tokens
              </SidebarNavLink>
            </SidebarMenuItem>
          )}
          
          {canManageConsent && (
            <SidebarMenuItem>
              <SidebarNavLink to="/consent" icon={Lock}>
                Consent Management
              </SidebarNavLink>
            </SidebarMenuItem>
          )}
          
          {user.role === 'admin' && (
            <SidebarMenuItem>
              <SidebarNavLink to="/users" icon={Users}>
                Users
              </SidebarNavLink>
            </SidebarMenuItem>
          )}
          
          <SidebarMenuItem>
            <SidebarNavLink to="/settings" icon={Settings}>
              Settings
            </SidebarNavLink>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="rounded-md bg-vault-50 p-3 mx-3 mb-3">
          <h3 className="flex items-center text-xs font-medium text-vault-800">
            <Lock size={14} className="mr-1" />
            Security Status
          </h3>
          <p className="text-xs text-vault-600 mt-1">
            All data is encrypted and secure
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
