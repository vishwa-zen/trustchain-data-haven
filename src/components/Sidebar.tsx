
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Database, 
  FileText, 
  Key, 
  CheckSquare,
  BarChart
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Database, label: 'Vaults', href: '/vaults' },
    { icon: FileText, label: 'Applications', href: '/applications' },
    { icon: Key, label: 'Access Keys', href: '/tokens' },
    { icon: CheckSquare, label: 'Consent', href: '/consent' },
    { icon: BarChart, label: 'Audit Logs', href: '/audit-logs' },
    { icon: Users, label: 'Users', href: '/users' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <aside className="hidden md:block w-64 border-r border-gray-200 p-4 bg-white">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex items-center px-3 py-2 rounded-md text-sm font-medium',
              isActive(item.href)
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <item.icon className="h-4 w-4 mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
