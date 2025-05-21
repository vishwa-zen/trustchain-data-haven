
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  FileCheck, 
  Lock, 
  BarChart4, 
  FileText, 
  AlertCircle,
  Server
} from 'lucide-react';
import { User, AppRegistration } from '@/types';
import { getApplicationsByUser } from '@/lib/vault';

interface RoleSpecificCardsProps {
  user: User;
}

const RoleSpecificCards: React.FC<RoleSpecificCardsProps> = ({ user }) => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<AppRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Load applications for all special roles (CTO, DPO, CSIO)
  useEffect(() => {
    const fetchApps = async () => {
      if (['cto-user', 'dpo-user', 'csio-user'].includes(user.role)) {
        setLoading(true);
        try {
          const appsData = await getApplicationsByUser(user.id);
          setApplications(appsData || []);
        } catch (error) {
          console.error('Error fetching applications:', error);
          // Set mock data if API fails
          setApplications([
            {
              id: 'app-1',
              userId: user.id,
              vaultId: 'vault-1',
              name: 'KYC Application',
              description: 'Customer verification system',
              status: 'approved',
              dataSets: [],
              createdAt: new Date().toISOString()
            },
            {
              id: 'app-2',
              userId: user.id,
              vaultId: 'vault-2',
              name: 'Risk Assessment Tool',
              description: 'Financial risk analysis system',
              status: 'pending',
              dataSets: [],
              createdAt: new Date().toISOString()
            },
            {
              id: 'app-3',
              userId: user.id,
              vaultId: 'vault-3',
              name: 'Compliance Monitor',
              description: 'Regulatory compliance monitoring',
              status: 'rejected',
              dataSets: [],
              createdAt: new Date().toISOString()
            }
          ]);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchApps();
  }, [user.id, user.role]);
  
  // Generate application status cards for all special roles
  const getApplicationStatusCards = () => {
    if (loading) {
      return [{
        title: 'Loading Applications',
        description: 'Please wait...',
        icon: <Server className="h-6 w-6 text-vault-700" />,
        color: 'bg-gradient-to-br from-blue-100 to-blue-50',
        action: 'Loading...',
        onClick: () => {}
      }];
    }
    
    // Group applications by status
    const approved = applications.filter(app => app.status === 'approved');
    const pending = applications.filter(app => app.status === 'pending' || app.status === 'requested');
    const rejected = applications.filter(app => app.status === 'rejected');
    
    return [
      {
        title: 'Approved Applications',
        description: `${approved.length} applications ready for use`,
        icon: <Server className="h-6 w-6 text-green-700" />,
        color: 'bg-gradient-to-br from-green-100 to-green-50',
        action: 'View Applications',
        onClick: () => navigate('/applications'),
        badge: approved.length.toString(),
        badgeColor: 'bg-green-500'
      },
      {
        title: 'Pending Applications',
        description: `${pending.length} applications awaiting review`,
        icon: <Server className="h-6 w-6 text-yellow-700" />,
        color: 'bg-gradient-to-br from-yellow-100 to-yellow-50',
        action: 'Review Applications',
        onClick: () => navigate('/applications'),
        badge: pending.length.toString(),
        badgeColor: 'bg-yellow-500'
      },
      {
        title: 'Rejected Applications',
        description: `${rejected.length} applications need attention`,
        icon: <Server className="h-6 w-6 text-red-700" />,
        color: 'bg-gradient-to-br from-red-100 to-red-50',
        action: 'View Applications',
        onClick: () => navigate('/applications'),
        badge: rejected.length.toString(),
        badgeColor: 'bg-red-500'
      }
    ];
  };
  
  // Define role-specific title
  const getRoleTitle = () => {
    switch (user.role) {
      case 'cto-user':
        return 'CTO Dashboard';
      case 'dpo-user':
        return 'DPO Dashboard';
      case 'csio-user':
        return 'CSIO Dashboard';
      default:
        return 'Dashboard';
    }
  };
  
  // Check if we have a special role that needs to show the cards
  if (!['cto-user', 'dpo-user', 'csio-user'].includes(user.role)) {
    return null;
  }
  
  // Get application cards for all special roles
  const displayedCards = getApplicationStatusCards();
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{getRoleTitle()}</h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayedCards.map((card, index) => (
          <Card key={index} className={`${card.color} border animate-fade-in`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center">
                  {card.title}
                  {card.badge && (
                    <span className={`ml-2 px-2 py-1 text-xs font-bold text-white rounded-full ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  )}
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-white/80 flex items-center justify-center">
                  {card.icon}
                </div>
              </div>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={card.onClick}
              >
                {card.action}
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {/* Consent Management Card - shown only to relevant management roles */}
        <Card className="bg-gradient-to-br from-highlight-100 to-highlight-50 border animate-fade-in">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle>Consent Management</CardTitle>
              <div className="h-8 w-8 rounded-full bg-white/80 flex items-center justify-center">
                <Lock className="h-6 w-6 text-vault-700" />
              </div>
            </div>
            <CardDescription>Manage data consent and privacy agreements</CardDescription>
          </CardHeader>
          <CardFooter className="pt-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/consent')}
            >
              Manage Consent
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RoleSpecificCards;
