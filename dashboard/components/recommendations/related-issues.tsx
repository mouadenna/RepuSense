import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, ArrowRight, MessageSquare, TrendingDown } from "lucide-react"

export function RelatedIssues() {
  const relatedIssues = [
    {
      id: 1,
      title: "Slow customer service response time",
      description:
        "Average response time of 24 hours is causing significant customer frustration and negative reviews.",
      severity: "high",
      mentions: 342,
      trend: "increasing",
      category: "Customer Service",
      impact: 85,
      relationship: "primary",
    },
    {
      id: 2,
      title: "Customer service quality inconsistency",
      description: "Variation in quality of responses between different customer service representatives.",
      severity: "medium",
      mentions: 156,
      trend: "stable",
      category: "Customer Service",
      impact: 60,
      relationship: "related",
    },
    {
      id: 3,
      title: "Limited self-service options",
      description: "Customers unable to find answers to common questions without contacting support.",
      severity: "medium",
      mentions: 124,
      trend: "increasing",
      category: "Website",
      impact: 55,
      relationship: "related",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <p>
          Issues related to this recommendation. Implementing this recommendation will address these issues either
          directly or indirectly, improving overall customer satisfaction and brand reputation.
        </p>
      </div>

      <div className="space-y-4">
        {relatedIssues.map((issue) => (
          <Card key={issue.id} className={issue.relationship === "primary" ? "border-primary" : ""}>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className={`h-5 w-5 ${issue.severity === "high" ? "text-red-500" : "text-amber-500"}`} />
                  <h3 className="font-medium">{issue.title}</h3>
                </div>
                <Badge variant={issue.relationship === "primary" ? "default" : "outline"} className="ml-auto">
                  {issue.relationship} issue
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">{issue.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Mentions</div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{issue.mentions}</span>
                    {issue.trend === "increasing" && <TrendingDown className="h-4 w-4 text-red-500 rotate-180" />}
                    {issue.trend === "decreasing" && <TrendingDown className="h-4 w-4 text-green-500" />}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Category</div>
                  <Badge variant="secondary">{issue.category}</Badge>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Reputation Impact</div>
                  <div className="flex items-center gap-2">
                    <Progress value={issue.impact} className="h-2" />
                    <span className="text-xs font-medium">{issue.impact}%</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="gap-1">
                  View Issue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
