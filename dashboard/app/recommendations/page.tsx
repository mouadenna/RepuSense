"use client"

import { useEffect, useState } from "react"
import { apiService } from "@/lib/api"
import { useCompany } from "@/contexts/CompanyContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RecommendationsList } from "@/components/dashboard/recommendations-list"
import { LandingPage } from "@/components/landing-page"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, MessageSquare, PieChart } from "lucide-react"

export default function RecommendationsPage() {
  const { isCompanySelected, selectedCompany } = useCompany()
  const [metrics, setMetrics] = useState({
    totalMentions: "...",
    sentimentScore: "...",
    recommendationCount: "..."
  })
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    async function loadDashboardData() {
      if (!selectedCompany) return

      setIsLoading(true)
      try {
        const companyInfo = await apiService.getCompanyInfo(selectedCompany)
        const sentimentData = await apiService.getCompanySentiment(selectedCompany)
        const recommendations = await apiService.getCompanyRecommendations(selectedCompany)
        const contentStats = await apiService.getCompanyContentStats(selectedCompany)

        const totalMentions = contentStats ? contentStats.total_content :
          (sentimentData ? sentimentData.length : 0)

        let avgSentiment = 0
        if (sentimentData && sentimentData.length > 0) {
          const counts = { positive: 0, neutral: 0, negative: 0 }

          sentimentData.forEach((item: { sentiment: string }) => {
            if (item.sentiment) {
              counts[item.sentiment.toLowerCase() as 'positive' | 'neutral' | 'negative'] =
                (counts[item.sentiment.toLowerCase() as 'positive' | 'neutral' | 'negative'] || 0) + 1
            }
          })

          const total = counts.positive + counts.neutral + counts.negative
          if (total > 0) {
            avgSentiment = ((0.5 * counts.neutral) + (1.0 * counts.positive) + (0 * counts.negative)) / total
            avgSentiment = avgSentiment * 10
          }
        }

        const recCount = recommendations && recommendations.recommendations ? recommendations.recommendations.length : 0

        setMetrics({
          totalMentions: totalMentions.toLocaleString(),
          sentimentScore: avgSentiment.toFixed(1) + "/10",
          recommendationCount: recCount.toString()
        })
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [selectedCompany])

  if (!isCompanySelected) {
    return <LandingPage />
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
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.recommendationCount}</div>
              <p className="text-xs text-muted-foreground">Action items identified</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Recommendations</TabsTrigger>
            <TabsTrigger value="high">High Priority</TabsTrigger>
            <TabsTrigger value="medium">Medium Priority</TabsTrigger>
            <TabsTrigger value="low">Low Priority</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Recommendations</CardTitle>
                <CardDescription>Complete list of recommendations based on analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <RecommendationsList extended={true} priority="all" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="high" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>High Priority Recommendations</CardTitle>
                <CardDescription>Critical issues requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <RecommendationsList extended={true} priority="High" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medium" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Medium Priority Recommendations</CardTitle>
                <CardDescription>Important issues to address in the near term</CardDescription>
              </CardHeader>
              <CardContent>
                <RecommendationsList extended={true} priority="Medium" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="low" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Low Priority Recommendations</CardTitle>
                <CardDescription>Issues to consider for future improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <RecommendationsList extended={true} priority="Low" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
