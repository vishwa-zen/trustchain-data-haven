
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface EmptyStateCardProps {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}

const EmptyStateCard: React.FC<EmptyStateCardProps> = ({ 
  title, 
  description, 
  buttonText, 
  onClick 
}) => {
  return (
    <div className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={onClick}>{buttonText}</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmptyStateCard;
