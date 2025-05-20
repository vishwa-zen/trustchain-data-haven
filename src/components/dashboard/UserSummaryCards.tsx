
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import RoleSummaryCard from './RoleSummaryCard';
import StatisticCard from './StatisticCard';
import { User } from '@/types';

interface UserSummaryCardsProps {
  user: User;
  vaultsCount: number;
  applicationsCount: number;
  loading: boolean;
  canManageVaults: boolean;
  isAdmin: boolean;
  isAppOwner: boolean;
}

const UserSummaryCards: React.FC<UserSummaryCardsProps> = ({
  user,
  vaultsCount,
  applicationsCount,
  loading,
  canManageVaults,
  isAdmin,
  isAppOwner
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="grid gap-4 md:grid-cols-3">
        <RoleSummaryCard user={user} />
        
        {canManageVaults && (
          <StatisticCard
            title="Vaults"
            description="Total data vaults"
            value={vaultsCount}
            isLoading={loading}
            colorClass="bg-gradient-to-br from-security-100 to-security-50"
          />
        )}
        
        {isAppOwner && (
          <StatisticCard
            title="Applications"
            description="Registered apps"
            value={applicationsCount}
            isLoading={loading}
            colorClass="bg-gradient-to-br from-highlight-100 to-highlight-50"
          />
        )}
        
        {isAdmin && (
          <StatisticCard
            title="User Management"
            description="Admin controls"
            value=""
            isLoading={false}
            colorClass="bg-gradient-to-br from-security-100 to-security-50"
            buttonText="Manage Users"
            icon={<Users className="h-4 w-4 mr-2" />}
            onClick={() => navigate('/users')}
          />
        )}
      </div>
    </div>
  );
};

export default UserSummaryCards;
