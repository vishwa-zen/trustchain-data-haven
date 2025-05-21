
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Server } from 'lucide-react';
import { AppRegistration } from '@/types';

// Mock applications data - consistent with other files
const mockApplications = [
  {
    id: 'app-1',
    name: 'KYC Application',
    description: 'Customer verification system',
    status: 'approved',
    userId: 'c7a22ea6-6fcb-40cc-8515-7f54ce47cd39',
    vaultId: '2288e11a-658f-421c-9359-79c969316303',
    dataSets: []
  },
  {
    id: 'app-2',
    name: 'Risk Assessment Tool',
    description: 'Financial risk analysis system',
    status: 'requested',
    userId: 'c7a22ea6-6fcb-40cc-8515-7f54ce47cd39',
    vaultId: '2288e11a-658f-421c-9359-79c969316303',
    dataSets: []
  },
  {
    id: 'app-3',
    name: 'Compliance Monitor',
    description: 'Regulatory compliance monitoring',
    status: 'rejected',
    userId: 'c7a22ea6-6fcb-40cc-8515-7f54ce47cd39',
    vaultId: '2288e11a-658f-421c-9359-79c969316303',
    dataSets: []
  }
];

interface ApplicationsListProps {
  applications: AppRegistration[];
  loading: boolean;
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({ applications = [], loading }) => {
  const navigate = useNavigate();
  
  // If no applications are passed, use the mock data
  const displayedApplications = applications.length > 0 ? applications : mockApplications;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Applications</h2>
        <Button onClick={() => navigate('/applications')}>
          Manage Applications
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <Card className="animate-pulse-slow">
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
            </CardHeader>
          </Card>
        ) : (
          displayedApplications.slice(0, 3).map(app => (
            <Card key={app.id} className="animate-fade-in">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{app.name}</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-highlight-600 to-highlight-700 flex items-center justify-center">
                    <Server className="h-4 w-4 text-white" />
                  </div>
                </div>
                <CardDescription>{app.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Status:</span>
                  <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                    app.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : app.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={app.status === 'approved' ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => navigate(`/applications/${app.id}`)}
                >
                  {app.status === 'approved' ? 'Manage Tokens' : 'View Details'}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ApplicationsList;
