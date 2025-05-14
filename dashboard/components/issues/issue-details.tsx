"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, ArrowRight, Calendar, MessageSquare } from "lucide-react"
import { useIssue } from "@/contexts/IssueContext"

export function IssueDetails() {
  const { selectedIssue, loading } = useIssue()
  
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-20 bg-muted rounded"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-12 bg-muted rounded"></div>
          <div className="h-12 bg-muted rounded"></div>
        </div>
      </div>
    )
  }
  
  if (!selectedIssue) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Select an issue to view details</p>
      </div>
    )
  }
  
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }
  
  // Convert severity to impact percentages
  const getSeverityImpact = (severity: string) => {
    switch (severity) {
      case "critical": return { reputation: 95, satisfaction: 90, revenue: 85 }
      case "high": return { reputation: 80, satisfaction: 75, revenue: 65 }
      case "medium": return { reputation: 60, satisfaction: 55, revenue: 40 }
      case "low": return { reputation: 30, satisfaction: 25, revenue: 15 }
      default: return { reputation: 50, satisfaction: 45, revenue: 30 }
    }
  }
  
  const impact = getSeverityImpact(selectedIssue.severity)
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Issue Summary</h3>
            <p className="text-sm text-muted-foreground">
              {selectedIssue.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Source</div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedIssue.source}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Detected</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatDate(selectedIssue.created_at)}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Severity</div>
                <Badge 
                  variant={selectedIssue.severity === "critical" || selectedIssue.severity === "high" 
                    ? "destructive" 
                    : selectedIssue.severity === "medium" 
                      ? "outline" 
                      : "secondary"}
                >
                  {selectedIssue.severity}
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Status</div>
                <Badge variant="outline">{selectedIssue.status}</Badge>
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
                  <span className="font-medium">{impact.reputation}%</span>
                </div>
                <Progress value={impact.reputation} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Customer Satisfaction Impact</span>
                  <span className="font-medium">{impact.satisfaction}%</span>
                </div>
                <Progress value={impact.satisfaction} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Revenue Impact</span>
                  <span className="font-medium">{impact.revenue}%</span>
                </div>
                <Progress value={impact.revenue} className="h-2" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Suggested Actions</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-sm">Investigate root causes immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-sm">Prepare communication strategy</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-sm">Develop action plan to address the issue</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-sm">Monitor sentiment changes after response</span>
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
