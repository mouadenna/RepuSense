import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, ArrowRight, MessageSquare, TrendingDown } from "lucide-react"

export function ProblemSummary() {
  const problems = [
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
    },
    {
      id: 2,
      title: "Shipping delays and poor tracking",
      description: "Customers report packages arriving later than promised and difficulties tracking their orders.",
      severity: "high",
      mentions: 287,
      trend: "stable",
      category: "Logistics",
      impact: 78,
    },
    {
      id: 3,
      title: "Pricing perceived as too high",
      description: "Frequent mentions of products being overpriced compared to competitors.",
      severity: "medium",
      mentions: 215,
      trend: "increasing",
      category: "Pricing",
      impact: 65,
    },
    {
      id: 4,
      title: "Mobile checkout issues",
      description: "Users report difficulties completing purchases on mobile devices.",
      severity: "medium",
      mentions: 178,
      trend: "decreasing",
      category: "Website",
      impact: 60,
    },
    {
      id: 5,
      title: "Product durability concerns",
      description: "Some customers reporting products breaking or wearing out sooner than expected.",
      severity: "medium",
      mentions: 156,
      trend: "stable",
      category: "Product Quality",
      impact: 55,
    },
  ]

  return (
    <div className="space-y-6">
      {problems.map((problem) => (
        <div key={problem.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className={`h-5 w-5 ${problem.severity === "high" ? "text-red-500" : "text-amber-500"}`} />
              <h3 className="font-medium">{problem.title}</h3>
            </div>
            <Badge variant={problem.severity === "high" ? "destructive" : "outline"} className="ml-auto">
              {problem.severity} severity
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">{problem.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Mentions</div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{problem.mentions}</span>
                {problem.trend === "increasing" && <TrendingDown className="h-4 w-4 text-red-500 rotate-180" />}
                {problem.trend === "decreasing" && <TrendingDown className="h-4 w-4 text-green-500" />}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Category</div>
              <Badge variant="secondary">{problem.category}</Badge>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Reputation Impact</div>
              <div className="flex items-center gap-2">
                <Progress value={problem.impact} className="h-2" />
                <span className="text-xs font-medium">{problem.impact}%</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="gap-1">
              View Analysis
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
