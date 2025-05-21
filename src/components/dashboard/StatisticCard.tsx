
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface StatisticCardProps {
  title: string;
  description: string;
  value: string | number;
  isLoading: boolean;
  colorClass?: string;
  icon?: React.ReactNode;
  buttonText?: string;
  onClick?: () => void;
  priority?: boolean;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  description,
  value,
  isLoading,
  colorClass = "bg-gray-100",
  icon,
  buttonText,
  onClick,
  priority = false
}) => {
  return (
    <Card className={`${colorClass} border ${priority ? 'shadow-md ring-2 ring-primary/30' : 'shadow-sm'} animate-fade-in`}>
      <CardContent className="p-6">
        <div className="space-y-2">
          <h3 className={`text-base font-semibold ${priority ? 'text-primary' : ''}`}>{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          
          {isLoading ? (
            <Skeleton className="h-8 w-16 rounded-md" />
          ) : (
            value && <p className="text-2xl font-bold">{value}</p>
          )}
          
          {buttonText && onClick && (
            <Button 
              onClick={onClick} 
              variant={priority ? "default" : "outline"} 
              className={`mt-2 w-full ${priority ? 'bg-primary hover:bg-primary/90' : ''}`}
            >
              {icon && icon}
              {buttonText}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticCard;
