
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Shield, 
  Database, 
  Key, 
  Settings, 
  Lock,
  Users,
  Server
} from 'lucide-react';
import { getCurrentUser, hasRole } from '@/lib/auth';

const Sidebar: React.FC = () => {
  const user = getCurrentUser();
  
  if (!user) return null;
  
  const canManageVaults = hasRole(['data-steward', 'admin']);
  const canManageConsent = hasRole(['data-steward', 'admin', 'cto-user', 'dpo-user', 'csio-user']);
  
  return (
    <div className="w-64 min-h-screen border-r bg-background px-3 py-6 flex flex-col">
      <div className="space-y-1">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link-inactive'}
        >
          <Shield size={18} />
          <span>Dashboard</span>
        </NavLink>
        
        {canManageVaults && (
          <NavLink 
            to="/vaults" 
            className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link-inactive'}
          >
            <Database size={18} />
            <span>Vaults</span>
          </NavLink>
        )}
        
        {user.role === 'app-owner' && (
          <NavLink 
            to="/applications" 
            className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link-inactive'}
          >
            <Server size={18} />
            <span>Applications</span>
          </NavLink>
        )}
        
        <NavLink 
          to="/tokens" 
          className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link-inactive'}
        >
          <Key size={18} />
          <span>Tokens</span>
        </NavLink>
        
        {canManageConsent && (
          <NavLink 
            to="/consent" 
            className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link-inactive'}
          >
            <Lock size={18} />
            <span>Consent Management</span>
          </NavLink>
        )}
        
        {user.role === 'admin' && (
          <NavLink 
            to="/users" 
            className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link-inactive'}
          >
            <Users size={18} />
            <span>Users</span>
          </NavLink>
        )}
        
        <NavLink 
          to="/settings" 
          className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link-inactive'}
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
      </div>
      
      <div className="mt-auto pt-4 border-t">
        <div className="rounded-md bg-vault-50 p-3">
          <h3 className="flex items-center text-xs font-medium text-vault-800">
            <Lock size={14} className="mr-1" />
            Security Status
          </h3>
          <p className="text-xs text-vault-600 mt-1">
            All data is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
