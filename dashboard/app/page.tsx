import type { Metadata } from "next"
import { AlertCircle, Lightbulb, MessageSquare, PieChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SentimentChart } from "@/components/dashboard/sentiment-chart"
import { TopicClusterMap } from "@/components/dashboard/topic-cluster-map"
import { RecommendationsList } from "@/components/dashboard/recommendations-list"
import { ProblemSummary } from "@/components/dashboard/problem-summary"
import { SourceDistribution } from "@/components/dashboard/source-distribution"
import { TrendAnalysis } from "@/components/dashboard/trend-analysis"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export const metadata: Metadata = {
  title: "Dashboard | RepuSense",
  description: "Overview of your e-reputation analysis",
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-4 md:gap-8">
        <DashboardHeader />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Mentions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,543</div>
              <p className="text-xs text-muted-foreground">+18% from previous period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sentiment Score</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6.8/10</div>
              <p className="text-xs text-muted-foreground">-0.5 from previous period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Problems</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">3 high priority issues</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">5 high impact actions</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="problems">Problem Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Sentiment Analysis</CardTitle>
                  <CardDescription>Distribution of sentiment across all mentions</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <SentimentChart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Source Distribution</CardTitle>
                  <CardDescription>Mentions by platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <SourceDistribution />
                </CardContent>
              </Card>
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Topic Clusters</CardTitle>
                  <CardDescription>Key discussion topics with sentiment indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <TopicClusterMap />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Priority Recommendations</CardTitle>
                  <CardDescription>Top actions to improve reputation</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecommendationsList />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="problems" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Problem Summary</CardTitle>
                  <CardDescription>Identified issues requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProblemSummary />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Strategic Recommendations</CardTitle>
                  <CardDescription>Actionable insights to improve your e-reputation</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecommendationsList extended={true} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Reputation Trend Analysis</CardTitle>
                  <CardDescription>Historical patterns and future projections</CardDescription>
                </CardHeader>
                <CardContent>
                  <TrendAnalysis />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
