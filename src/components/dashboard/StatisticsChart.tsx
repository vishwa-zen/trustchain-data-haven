
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartBarBig, ChartPie } from 'lucide-react';

interface StatisticsChartProps {
  vaultData: { name: string; count: number }[];
  applicationData: { name: string; count: number }[];
  loading: boolean;
  showVaultStats: boolean;
  showAppStats: boolean;
}

const StatisticsChart: React.FC<StatisticsChartProps> = ({ 
  vaultData, 
  applicationData, 
  loading, 
  showVaultStats, 
  showAppStats 
}) => {
  // Skip rendering if no data to show
  if ((!showVaultStats && !showAppStats) || loading) {
    return null;
  }

  // Choose which chart to show based on available data
  let chartType = "both";
  if (showVaultStats && !showAppStats) chartType = "vaults";
  if (!showVaultStats && showAppStats) chartType = "apps";

  // Combined data for bar chart
  const combinedData = vaultData.map((vault, index) => {
    // Make sure we have matching application data
    const appCount = index < applicationData.length ? applicationData[index].count : 0;
    
    return {
      name: vault.name,
      vaults: vault.count,
      applications: appCount
    };
  });

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Dashboard Analytics</h2>
        <div className="flex items-center space-x-2">
          <ChartBarBig className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Overview</CardTitle>
          <CardDescription>
            {chartType === "vaults" ? "Vault statistics" : 
             chartType === "apps" ? "Application statistics" : 
             "Vault and application statistics"}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center">
              <span className="text-muted-foreground">Loading chart data...</span>
            </div>
          ) : (
            <ChartContainer
              config={{
                vaults: {
                  label: "Vaults",
                  theme: {
                    light: "#7E69AB", 
                    dark: "#9b87f5"
                  }
                },
                applications: {
                  label: "Applications", 
                  theme: {
                    light: "#F97316",
                    dark: "#FB923C"
                  }
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  {showVaultStats && (
                    <Bar dataKey="vaults" name="vaults" fill="var(--color-vaults)" radius={[4, 4, 0, 0]} />
                  )}
                  {showAppStats && (
                    <Bar dataKey="applications" name="applications" fill="var(--color-applications)" radius={[4, 4, 0, 0]} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsChart;
