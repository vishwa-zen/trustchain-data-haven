
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface StatisticCardProps {
  title: string;
  description: string;
  value: string | number;
  isLoading: boolean;
  colorClass?: string;
  buttonText?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const StatisticCard: React.FC<StatisticCardProps> = ({ 
  title, 
  description, 
  value, 
  isLoading, 
  colorClass = "bg-gradient-to-br from-security-100 to-security-50",
  buttonText,
  icon,
  onClick 
}) => {
  return (
    <Card className={`${colorClass} border`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-security-900">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {buttonText && onClick ? (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onClick}
          >
            {icon && icon}
            {buttonText}
          </Button>
        ) : (
          <div className="text-2xl font-bold text-security-900">
            {isLoading ? '...' : value}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticCard;
