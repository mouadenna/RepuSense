import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { RecommendationsList } from "@/components/recommendations/recommendations-list"
import { RecommendationDetails } from "@/components/recommendations/recommendation-details"
import { ImplementationPlan } from "@/components/recommendations/implementation-plan"
import { ImpactAnalysis } from "@/components/recommendations/impact-analysis"
import { RelatedIssues } from "@/components/recommendations/related-issues"

export const metadata: Metadata = {
  title: "Recommendations | RepuSense",
  description: "Strategic recommendations to improve your e-reputation",
}

export default function RecommendationsPage() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Recommendation Engine</h1>
            <p className="text-muted-foreground">Strategic recommendations to improve your e-reputation</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button size="sm">Generate New</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search recommendations..." className="w-full bg-background pl-8" />
            </div>
            <RecommendationsList />
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Improve customer service response time</CardTitle>
                <CardDescription>High impact recommendation to address customer satisfaction</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="implementation">Implementation</TabsTrigger>
                    <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
                    <TabsTrigger value="related">Related Issues</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details">
                    <RecommendationDetails />
                  </TabsContent>

                  <TabsContent value="implementation">
                    <ImplementationPlan />
                  </TabsContent>

                  <TabsContent value="impact">
                    <ImpactAnalysis />
                  </TabsContent>

                  <TabsContent value="related">
                    <RelatedIssues />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
