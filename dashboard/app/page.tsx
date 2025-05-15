"use client";

import { Lightbulb, MessageSquare, PieChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecommendationsList } from "@/components/dashboard/recommendations-list"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { LandingPage } from "@/components/landing-page"
import { useCompany } from "@/contexts/CompanyContext"
import { useEffect, useState } from "react"
import { apiService } from "@/lib/api"
import { KeywordsCloud } from "@/components/dashboard/keywords-cloud"
import { DataSources } from "@/components/dashboard/data-sources"
import { VisualizationIframe } from "@/components/dashboard/visualization-iframe"

export default function DashboardPage() {
  const { isCompanySelected, selectedCompany } = useCompany();
  const [metrics, setMetrics] = useState({
    totalMentions: "...",
    sentimentScore: "...",
    recommendationCount: "..."
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function loadDashboardData() {
      if (!selectedCompany) return;
      
      setIsLoading(true);
      
      try {
        // Fetch basic metrics
        const companyInfo = await apiService.getCompanyInfo(selectedCompany);
        const sentimentData = await apiService.getCompanySentiment(selectedCompany);
        const recommendations = await apiService.getCompanyRecommendations(selectedCompany);
        const contentStats = await apiService.getCompanyContentStats(selectedCompany);
        
        // Use content stats if available, fallback to sentiment data length
        const totalMentions = contentStats ? contentStats.total_content : 
                             (sentimentData ? sentimentData.length : 0);
        
        // Calculate average sentiment score using formula
        let avgSentiment = 0;
        if (sentimentData && sentimentData.length > 0) {
          // Count sentiment categories
          const counts = {positive: 0, neutral: 0, negative: 0};
          
          sentimentData.forEach((item: { sentiment: string }) => {
            if (item.sentiment) {
              counts[item.sentiment.toLowerCase() as 'positive' | 'neutral' | 'negative'] = 
                (counts[item.sentiment.toLowerCase() as 'positive' | 'neutral' | 'negative'] || 0) + 1;
            }
          });
          
          const total = counts.positive + counts.neutral + counts.negative;
          if (total > 0) {
            // Formula: (0.5*neutral% + 1*positive% + 0*negative%)/(total%)
            avgSentiment = ((0.5 * counts.neutral) + (1.0 * counts.positive) + (0 * counts.negative)) / total;
            // Scale to 0-10
            avgSentiment = avgSentiment * 10;
          }
        }
        
        // Get count from recommendations
        const recCount = recommendations && recommendations.recommendations ? recommendations.recommendations.length : 0;
        
        setMetrics({
          totalMentions: totalMentions.toLocaleString(),
          sentimentScore: avgSentiment.toFixed(1) + "/10",
          recommendationCount: recCount.toString()
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDashboardData();
  }, [selectedCompany]);
  
  if (!isCompanySelected) {
    return <LandingPage />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-4 md:gap-8">
        <DashboardHeader />

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Posts, Articles, Comments</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalMentions}</div>
              <p className="text-xs text-muted-foreground">From all data sources</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sentiment Score</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.sentimentScore}</div>
              <p className="text-xs text-muted-foreground">Overall reputation score</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.recommendationCount}</div>
              <p className="text-xs text-muted-foreground">{parseInt(metrics.recommendationCount) > 0 ? `${Math.min(5, parseInt(metrics.recommendationCount))} action items` : 'No recommendations'}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sentiment" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
            <TabsTrigger value="topics">Topic Analysis</TabsTrigger>
            <TabsTrigger value="engagement">Engagement Analysis</TabsTrigger>
            <TabsTrigger value="keywords">Keywords Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="sentiment" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <VisualizationIframe
                title="Sentiment Distribution"
                description="Distribution of sentiment across all mentions"
                fetchHtml={apiService.getCompanySentimentDistributionHtml}
                className="h-[600px]"
              />
              <Card>
                <CardHeader>
                  <CardTitle>Sentiment-Based Recommendations</CardTitle>
                  <CardDescription>Actions to improve sentiment metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecommendationsList extended={false} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="topics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <VisualizationIframe
                title="Topic Clusters"
                description="Interactive visualization of topic clusters"
                fetchHtml={apiService.getCompanyTopicVisualizationHtml}
                className="h-[600px]"
              />
              <VisualizationIframe
                title="Topic Distribution"
                description="Distribution of topics across mentions"
                fetchHtml={apiService.getCompanyTopicBarchartHtml}
                className="h-[600px]"
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Data Sources</CardTitle>
                <CardDescription>Overview of data collected from different platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <DataSources />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <VisualizationIframe
                title="Top Engaged Posts"
                description="Posts with highest engagement levels"
                fetchHtml={apiService.getCompanyTopEngagedPostsHtml}
                className="h-[600px]"
              />
              <VisualizationIframe
                title="Engagement Distribution"
                description="Distribution of engagement across posts"
                fetchHtml={apiService.getCompanyEngagementDistributionHtml}
                className="h-[600px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="keywords" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Keywords Overview</CardTitle>
                  <CardDescription>Most frequent keywords in mentions</CardDescription>
                </CardHeader>
                <CardContent>
                  <KeywordsCloud />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Strategic Recommendations</CardTitle>
                  <CardDescription>Actionable insights related to trending keywords</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecommendationsList extended={true} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
