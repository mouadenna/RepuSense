"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { apiService } from "@/lib/api"
import { useCompany } from "@/contexts/CompanyContext"

interface EngagementItem {
  post_id: number;
  comment_count: number;
}

export function EngagementChart() {
  const { selectedCompany } = useCompany();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!selectedCompany) return;
      
      setIsLoading(true);
      
      try {
        const engagementData = await apiService.getCompanyEngagement(selectedCompany);
        
        if (engagementData && engagementData.length > 0) {
          // Sort by engagement count (descending)
          const sortedData = [...engagementData]
            .sort((a, b) => b.comment_count - a.comment_count)
            .slice(0, 10); // Top 10 most engaged posts
          
          // Transform data for the chart
          const chartData = sortedData.map((item: EngagementItem, index: number) => ({
            name: `Post ${index + 1}`,
            postId: item.post_id,
            engagement: item.comment_count
          }));
          
          setData(chartData);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching engagement data:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [selectedCompany]);

  return (
    <div className="h-[300px] w-full">
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading engagement data...</div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-sm text-muted-foreground">No engagement data available</div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 50,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={70}
            />
            <YAxis label={{ value: 'Comments', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value) => [`${value} comments`, "Engagement"]}
              labelFormatter={(label, payload) => `Post ${payload[0]?.payload?.postId}`}
            />
            <Bar dataKey="engagement" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
} 