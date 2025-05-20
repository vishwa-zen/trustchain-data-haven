
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types';

interface RoleSummaryCardProps {
  user: User;
}

const RoleSummaryCard: React.FC<RoleSummaryCardProps> = ({ user }) => {
  return (
    <Card className="bg-gradient-to-br from-vault-100 to-vault-50 border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-vault-900">Role</CardTitle>
        <CardDescription>Your access level</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-vault-900 capitalize">
          {user.role.replace('-', ' ')}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleSummaryCard;
