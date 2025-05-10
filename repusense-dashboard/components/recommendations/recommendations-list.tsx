import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Clock, Lightbulb, TrendingUp } from "lucide-react"

export function RecommendationsList() {
  const recommendations = [
    {
      id: 1,
      title: "Improve customer service response time",
      description: "Reduce average response time from 24 hours to under 6 hours",
      impact: "high",
      effort: "medium",
      category: "Customer Service",
      status: "pending",
      active: true,
    },
    {
      id: 2,
      title: "Create educational content about product durability",
      description: "Develop blog posts and videos showcasing product testing",
      impact: "medium",
      effort: "low",
      category: "Content Strategy",
      status: "in-progress",
      active: false,
    },
    {
      id: 3,
      title: "Revise shipping policy and partner with faster carriers",
      description: "Address delivery complaints by improving shipping speed",
      impact: "high",
      effort: "high",
      category: "Logistics",
      status: "pending",
      active: false,
    },
    {
      id: 4,
      title: "Launch transparency campaign about pricing",
      description: "Create content explaining value proposition and pricing structure",
      impact: "medium",
      effort: "medium",
      category: "Marketing",
      status: "pending",
      active: false,
    },
    {
      id: 5,
      title: "Optimize mobile checkout experience",
      description: "Simplify the checkout process on mobile devices",
      impact: "medium",
      effort: "medium",
      category: "Website",
      status: "completed",
      active: false,
    },
    {
      id: 6,
      title: "Implement AI-powered chatbot for common inquiries",
      description: "Reduce response time for frequently asked questions",
      impact: "high",
      effort: "high",
      category: "Technology",
      status: "pending",
      active: false,
    },
    {
      id: 7,
      title: "Create comprehensive knowledge base",
      description: "Develop self-service resources for customers",
      impact: "medium",
      effort: "medium",
      category: "Support",
      status: "in-progress",
      active: false,
    },
  ]

  return (
    <div className="space-y-3">
      {recommendations.map((recommendation) => (
        <Card
          key={recommendation.id}
          className={`p-3 cursor-pointer hover:border-primary transition-colors ${
            recommendation.active ? "border-primary bg-primary/5" : ""
          }`}
        >
          <div className="flex items-start gap-2">
            <Lightbulb
              className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                recommendation.impact === "high" ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <div className="space-y-1 w-full">
              <h3 className="font-medium text-sm">{recommendation.title}</h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  {recommendation.status === "completed" ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : recommendation.status === "in-progress" ? (
                    <Clock className="h-3 w-3 text-amber-500" />
                  ) : (
                    <TrendingUp className="h-3 w-3 text-primary" />
                  )}
                  <span>{recommendation.status}</span>
                </div>
                <Badge
                  variant={recommendation.impact === "high" ? "destructive" : "outline"}
                  className="text-[10px] px-1 h-4"
                >
                  {recommendation.impact}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      ))}
      <Button variant="outline" size="sm" className="w-full">
        View archived recommendations
      </Button>
    </div>
  )
}
