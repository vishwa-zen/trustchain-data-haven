
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  FileCheck, 
  Lock, 
  BarChart4, 
  FileText, 
  AlertCircle
} from 'lucide-react';
import { User } from '@/types';

interface RoleSpecificCardsProps {
  user: User;
}

const RoleSpecificCards: React.FC<RoleSpecificCardsProps> = ({ user }) => {
  const navigate = useNavigate();
  
  // Define role-specific content
  const roleContent = {
    'cto-user': {
      title: 'CTO Dashboard',
      cards: [
        {
          title: 'Data Architecture',
          description: 'Review data flow architecture and API gateways',
          icon: <BarChart4 className="h-6 w-6 text-vault-700" />,
          color: 'bg-gradient-to-br from-blue-100 to-blue-50',
          action: 'Review Architecture',
          onClick: () => navigate('/consent')
        },
        {
          title: 'API Security',
          description: 'Monitor API security and access patterns',
          icon: <Shield className="h-6 w-6 text-vault-700" />,
          color: 'bg-gradient-to-br from-blue-100 to-blue-50',
          action: 'View API Security',
          onClick: () => navigate('/consent')
        }
      ]
    },
    'dpo-user': {
      title: 'DPO Dashboard',
      cards: [
        {
          title: 'Compliance Status',
          description: 'GDPR, CCPA and other regulatory compliance',
          icon: <FileCheck className="h-6 w-6 text-vault-700" />,
          color: 'bg-gradient-to-br from-green-100 to-green-50',
          action: 'Review Compliance',
          onClick: () => navigate('/consent')
        },
        {
          title: 'Privacy Policies',
          description: 'Update and manage privacy documentation',
          icon: <FileText className="h-6 w-6 text-vault-700" />,
          color: 'bg-gradient-to-br from-green-100 to-green-50',
          action: 'Manage Policies',
          onClick: () => navigate('/consent')
        }
      ]
    },
    'csio-user': {
      title: 'CSIO Dashboard',
      cards: [
        {
          title: 'Security Overview',
          description: 'System security status and threat detection',
          icon: <Shield className="h-6 w-6 text-vault-700" />,
          color: 'bg-gradient-to-br from-security-100 to-security-50',
          action: 'View Security',
          onClick: () => navigate('/consent')
        },
        {
          title: 'Data Access Alerts',
          description: 'Review recent critical data access events',
          icon: <AlertCircle className="h-6 w-6 text-vault-700" />,
          color: 'bg-gradient-to-br from-security-100 to-security-50',
          action: 'View Alerts',
          onClick: () => navigate('/consent')
        }
      ]
    }
  };
  
  // Check if we have specific content for this role
  const content = roleContent[user.role as keyof typeof roleContent];
  if (!content) return null;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{content.title}</h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {content.cards.map((card, index) => (
          <Card key={index} className={`${card.color} border animate-fade-in`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{card.title}</CardTitle>
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
        
        {/* Common card for all these roles - Consent Management */}
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
