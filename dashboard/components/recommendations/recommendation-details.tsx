"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Clock, Lightbulb, TrendingUp, User } from "lucide-react"
import { useRecommendation } from "@/contexts/RecommendationContext"

export function RecommendationDetails() {
  const { selectedRecommendation, loading } = useRecommendation()
  
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
  
  if (!selectedRecommendation) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Select a recommendation to view details</p>
      </div>
    )
  }
  
  // Impact score mapping
  const getImpactLevel = (score: number) => {
    if (score >= 80) return "High"
    if (score >= 65) return "Medium"
    return "Low"
  }
  
  const impactLevel = getImpactLevel(selectedRecommendation.impact_score)
  
  // Calculate progress values
  const progressValue = Math.min(Math.max(selectedRecommendation.impact_score, 0), 100)
  const sentimentImprovement = Math.round((selectedRecommendation.sentiment_impact.potential - selectedRecommendation.sentiment_impact.current) * 100)
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Recommendation Summary</h3>
            <p className="text-sm text-muted-foreground">
              {selectedRecommendation.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Impact</div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-medium">{impactLevel}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Impact Score</div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-medium">{selectedRecommendation.impact_score}/100</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Category</div>
                <Badge variant="secondary">{selectedRecommendation.type}</Badge>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Status</div>
                <Badge variant="outline">Pending</Badge>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {selectedRecommendation.related_topics.map((topic, index) => (
                <Badge key={index} variant="outline">{topic}</Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Expected Impact</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Overall Impact</span>
                  <span className="font-medium">{progressValue}%</span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Sentiment Improvement</span>
                  <span className="font-medium">{sentimentImprovement}%</span>
                </div>
                <Progress value={sentimentImprovement} className="h-2" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Sentiment Impact</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col items-center p-2 rounded-md bg-muted">
                <span className="text-xs text-muted-foreground">Current</span>
                <span className={`text-lg font-bold ${selectedRecommendation.sentiment_impact.current < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {selectedRecommendation.sentiment_impact.current.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-md bg-muted">
                <span className="text-xs text-muted-foreground">Potential</span>
                <span className="text-lg font-bold text-green-500">
                  {selectedRecommendation.sentiment_impact.potential.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Implementation Steps</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-sm">Analyze customer feedback related to {selectedRecommendation.related_topics[0]}</span>
              </li>
              <li className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-sm">Develop action plan to address issues</span>
              </li>
              <li className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-sm">Implement changes and monitor results</span>
              </li>
              <li className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-sm">Measure impact on sentiment and engagement</span>
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
          Create Implementation Plan
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
