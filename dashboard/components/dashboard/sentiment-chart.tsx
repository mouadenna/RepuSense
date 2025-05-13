"use client"
import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { apiService } from "@/lib/api"
import { useCompany } from "@/contexts/CompanyContext"

// Define types
interface SentimentItem {
  post_id: number;
  sentiment: string;
  score: number;
}

interface ChartDataItem {
  sentiment: string;
  count: number;
  percentage: number;
  color: string;
}

// Fallback data
const fallbackData: ChartDataItem[] = [
  { sentiment: "Very Negative", count: 245, percentage: 8, color: "#ef4444" },
  { sentiment: "Negative", count: 678, percentage: 22, color: "#f97316" },
  { sentiment: "Neutral", count: 1245, percentage: 40, color: "#a3a3a3" },
  { sentiment: "Positive", count: 567, percentage: 18, color: "#22c55e" },
  { sentiment: "Very Positive", count: 367, percentage: 12, color: "#10b981" },
]

// Sentiment color map
const sentimentColors: Record<string, string> = {
  "very negative": "#ef4444",
  "negative": "#f97316",
  "neutral": "#a3a3a3",
  "positive": "#22c55e",
  "very positive": "#10b981"
}

export function SentimentChart() {
  const { selectedCompany } = useCompany();
  const [data, setData] = useState<ChartDataItem[]>(fallbackData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!selectedCompany) return;
      
      setIsLoading(true);
      
      try {
        const sentimentData = await apiService.getCompanySentiment(selectedCompany);
        
        if (sentimentData) {
          // Process the data - group by sentiment
          const sentimentCounts: Record<string, number> = {};
          let total = 0;
          
          // Count occurrences of each sentiment
          sentimentData.forEach((item: SentimentItem) => {
            const sentiment = item.sentiment.toLowerCase();
            sentimentCounts[sentiment] = (sentimentCounts[sentiment] || 0) + 1;
            total++;
          });
          
          // Convert to chart format
          const chartData = Object.entries(sentimentCounts).map(([sentiment, count]) => ({
            sentiment: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
            count: count as number,
            percentage: Math.round((count as number / total) * 100),
            color: sentimentColors[sentiment as keyof typeof sentimentColors] || "#a3a3a3"
          }));
          
          setData(chartData.length > 0 ? chartData : fallbackData);
        }
      } catch (error) {
        console.error("Error fetching sentiment data:", error);
        setData(fallbackData);
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
          <div className="text-sm text-muted-foreground">Loading sentiment data...</div>
        </div>
      ) : (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="sentiment" />
          <YAxis />
          <Tooltip
            formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, "Count"]}
            contentStyle={{ borderRadius: "8px" }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      )}
    </div>
  )
}
