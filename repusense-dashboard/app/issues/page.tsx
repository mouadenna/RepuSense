import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { IssueList } from "@/components/issues/issue-list"
import { IssueDetails } from "@/components/issues/issue-details"
import { RootCauseAnalysis } from "@/components/issues/root-cause-analysis"
import { IssueTimeline } from "@/components/issues/issue-timeline"
import { RelatedMentions } from "@/components/issues/related-mentions"

export const metadata: Metadata = {
  title: "Issue Analyzer | RepuSense",
  description: "Comprehensive problem analysis and diagnostics",
}

export default function IssuesPage() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Issue Analyzer</h1>
            <p className="text-muted-foreground">Comprehensive problem analysis and diagnostics</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button size="sm">New Issue</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search issues..." className="w-full bg-background pl-8" />
            </div>
            <IssueList />
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Slow customer service response time</CardTitle>
                <CardDescription>High severity issue affecting customer satisfaction</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="root-cause">Root Cause</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="mentions">Related Mentions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details">
                    <IssueDetails />
                  </TabsContent>

                  <TabsContent value="root-cause">
                    <RootCauseAnalysis />
                  </TabsContent>

                  <TabsContent value="timeline">
                    <IssueTimeline />
                  </TabsContent>

                  <TabsContent value="mentions">
                    <RelatedMentions />
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
