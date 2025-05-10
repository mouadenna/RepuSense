import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, ChevronRight, Clock, Lightbulb, TrendingUp } from "lucide-react"

interface RecommendationsListProps {
  extended?: boolean
}

export function RecommendationsList({ extended = false }: RecommendationsListProps) {
  const recommendations = [
    {
      id: 1,
      title: "Improve customer service response time",
      description: "Reduce average response time from 24 hours to under 6 hours to address the most common complaint.",
      impact: "high",
      effort: "medium",
      category: "Customer Service",
      status: "pending",
    },
    {
      id: 2,
      title: "Create educational content about product durability",
      description: "Develop blog posts and videos showcasing product testing and durability features.",
      impact: "medium",
      effort: "low",
      category: "Content Strategy",
      status: "in-progress",
    },
    {
      id: 3,
      title: "Revise shipping policy and partner with faster carriers",
      description: "Address delivery complaints by improving shipping speed and providing better tracking.",
      impact: "high",
      effort: "high",
      category: "Logistics",
      status: "pending",
    },
    {
      id: 4,
      title: "Launch transparency campaign about pricing",
      description: "Create content explaining value proposition and pricing structure to address concerns.",
      impact: "medium",
      effort: "medium",
      category: "Marketing",
      status: "pending",
    },
    {
      id: 5,
      title: "Optimize mobile checkout experience",
      description: "Simplify the checkout process on mobile devices to reduce cart abandonment.",
      impact: "medium",
      effort: "medium",
      category: "Website",
      status: "completed",
    },
  ]

  const displayRecommendations = extended ? recommendations : recommendations.slice(0, 3)

  return (
    <div className="space-y-4">
      {displayRecommendations.map((recommendation) => (
        <div key={recommendation.id} className="flex flex-col space-y-2 border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h3 className="font-medium">{recommendation.title}</h3>
            </div>
            <Badge variant={recommendation.impact === "high" ? "destructive" : "outline"} className="ml-auto">
              {recommendation.impact} impact
            </Badge>
          </div>

          {extended && <p className="text-sm text-muted-foreground">{recommendation.description}</p>}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="text-xs">
                {recommendation.category}
              </Badge>
              <span className="flex items-center gap-1 ml-2">
                {recommendation.status === "completed" ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : recommendation.status === "in-progress" ? (
                  <Clock className="h-3 w-3 text-amber-500" />
                ) : (
                  <TrendingUp className="h-3 w-3 text-primary" />
                )}
                {recommendation.status}
              </span>
            </div>
            <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs">
              Details
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}

      {!extended && (
        <Button variant="outline" size="sm" className="w-full">
          View all recommendations
        </Button>
      )}
    </div>
  )
}
