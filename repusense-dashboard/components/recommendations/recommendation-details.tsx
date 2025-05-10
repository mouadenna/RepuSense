import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Clock, Lightbulb, TrendingUp, User } from "lucide-react"

export function RecommendationDetails() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Recommendation Summary</h3>
            <p className="text-sm text-muted-foreground">
              Reduce the average customer service response time from 24 hours to under 6 hours by implementing a
              combination of staffing changes, process improvements, and technology solutions. This recommendation
              directly addresses the highest priority issue affecting customer satisfaction and brand reputation.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Impact</div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-medium">High</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Effort</div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Medium</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Category</div>
                <Badge variant="secondary">Customer Service</Badge>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Status</div>
                <Badge variant="outline">Pending</Badge>
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
            <h3 className="text-sm font-medium mb-2">Expected Impact</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Reputation Improvement</span>
                  <span className="font-medium">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Customer Satisfaction</span>
                  <span className="font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Revenue Impact</span>
                  <span className="font-medium">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Implementation Difficulty</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center p-2 rounded-md bg-green-500/10">
                <span className="text-xs text-muted-foreground">Cost</span>
                <span className="text-lg font-bold text-green-500">Medium</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-md bg-amber-500/10">
                <span className="text-xs text-muted-foreground">Time</span>
                <span className="text-lg font-bold text-amber-500">Medium</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-md bg-blue-500/10">
                <span className="text-xs text-muted-foreground">Complexity</span>
                <span className="text-lg font-bold text-blue-500">Medium</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Key Components</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-sm">Increase customer service staff by 30%</span>
              </li>
              <li className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-sm">Implement automated ticket routing system</span>
              </li>
              <li className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-sm">Deploy AI chatbot for common inquiries</span>
              </li>
              <li className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-sm">Create standardized response templates</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between">
        <Button variant="outline" size="sm">
          Mark as Implemented
        </Button>
        <Button size="sm" className="gap-1">
          View Implementation Plan
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
