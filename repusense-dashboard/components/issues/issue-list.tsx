import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, MessageSquare, TrendingDown } from "lucide-react"

export function IssueList() {
  const issues = [
    {
      id: 1,
      title: "Slow customer service response time",
      severity: "high",
      mentions: 342,
      trend: "increasing",
      category: "Customer Service",
      active: true,
    },
    {
      id: 2,
      title: "Shipping delays and poor tracking",
      severity: "high",
      mentions: 287,
      trend: "stable",
      category: "Logistics",
      active: false,
    },
    {
      id: 3,
      title: "Pricing perceived as too high",
      severity: "medium",
      mentions: 215,
      trend: "increasing",
      category: "Pricing",
      active: false,
    },
    {
      id: 4,
      title: "Mobile checkout issues",
      severity: "medium",
      mentions: 178,
      trend: "decreasing",
      category: "Website",
      active: false,
    },
    {
      id: 5,
      title: "Product durability concerns",
      severity: "medium",
      mentions: 156,
      trend: "stable",
      category: "Product Quality",
      active: false,
    },
    {
      id: 6,
      title: "Confusing return policy",
      severity: "low",
      mentions: 98,
      trend: "stable",
      category: "Policy",
      active: false,
    },
    {
      id: 7,
      title: "Inconsistent brand messaging",
      severity: "low",
      mentions: 87,
      trend: "decreasing",
      category: "Marketing",
      active: false,
    },
  ]

  return (
    <div className="space-y-3">
      {issues.map((issue) => (
        <Card
          key={issue.id}
          className={`p-3 cursor-pointer hover:border-primary transition-colors ${
            issue.active ? "border-primary bg-primary/5" : ""
          }`}
        >
          <div className="flex items-start gap-2">
            <AlertCircle
              className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                issue.severity === "high"
                  ? "text-red-500"
                  : issue.severity === "medium"
                    ? "text-amber-500"
                    : "text-blue-500"
              }`}
            />
            <div className="space-y-1 w-full">
              <h3 className="font-medium text-sm">{issue.title}</h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{issue.mentions}</span>
                  {issue.trend === "increasing" && <TrendingDown className="h-3 w-3 text-red-500 rotate-180" />}
                  {issue.trend === "decreasing" && <TrendingDown className="h-3 w-3 text-green-500" />}
                </div>
                <Badge
                  variant={
                    issue.severity === "high" ? "destructive" : issue.severity === "medium" ? "outline" : "secondary"
                  }
                  className="text-[10px] px-1 h-4"
                >
                  {issue.severity}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      ))}
      <Button variant="outline" size="sm" className="w-full">
        View archived issues
      </Button>
    </div>
  )
}
