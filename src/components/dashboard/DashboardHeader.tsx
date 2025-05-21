
import React from 'react';
import { User } from '@/types';

interface DashboardHeaderProps {
  user: User | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  if (!user) return null;
  
  return (
    <div className="flex justify-between items-center w-full mb-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="ml-auto">
        <span className="text-sm text-muted-foreground">Welcome, {user.firstName}</span>
      </div>
    </div>
  );
};

export default DashboardHeader;
