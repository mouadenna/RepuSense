import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, ArrowRight, Calendar, MessageSquare, TrendingDown, User } from "lucide-react"

export function IssueDetails() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Issue Summary</h3>
            <p className="text-sm text-muted-foreground">
              Average customer service response time of 24 hours is causing significant customer frustration and
              negative reviews. This issue has been consistently mentioned across multiple platforms, with particular
              emphasis on social media and review sites. The slow response time is leading to customer churn and
              damaging brand reputation.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Mentions</div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">342</span>
                  <TrendingDown className="h-4 w-4 text-red-500 rotate-180" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">First Detected</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Mar 15, 2023</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Category</div>
                <Badge variant="secondary">Customer Service</Badge>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Status</div>
                <Badge variant="outline">Active</Badge>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Assigned To</h3>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium">Sarah Johnson</div>
                <div className="text-xs text-muted-foreground">Customer Experience Manager</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Impact Assessment</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Reputation Impact</span>
                  <span className="font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Customer Satisfaction Impact</span>
                  <span className="font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Revenue Impact</span>
                  <span className="font-medium">62%</span>
                </div>
                <Progress value={62} className="h-2" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Sentiment Distribution</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center p-2 rounded-md bg-red-500/10">
                <span className="text-xs text-muted-foreground">Negative</span>
                <span className="text-lg font-bold text-red-500">76%</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-md bg-gray-500/10">
                <span className="text-xs text-muted-foreground">Neutral</span>
                <span className="text-lg font-bold text-gray-500">18%</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-md bg-green-500/10">
                <span className="text-xs text-muted-foreground">Positive</span>
                <span className="text-lg font-bold text-green-500">6%</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Priority Recommendations</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-sm">Implement 24/7 customer service team</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-sm">Deploy AI-powered chatbot for common inquiries</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-sm">Establish 6-hour response time SLA</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between">
        <Button variant="outline" size="sm">
          Mark as Resolved
        </Button>
        <Button size="sm" className="gap-1">
          View Recommendations
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
