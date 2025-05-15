"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/lib/api"
import { useCompany } from "@/contexts/CompanyContext"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"

interface Recommendation {
  issue: string
  recommendation: string
  urgency: "High" | "Medium" | "Low"
  related_topics: string[]
  impact_score: number
}

interface RecommendationsListProps {
  extended?: boolean
  priority?: "High" | "Medium" | "Low" | "all"
}

export function RecommendationsList({ extended = false, priority = "all" }: RecommendationsListProps) {
  const { selectedCompany } = useCompany()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadRecommendations() {
      if (!selectedCompany) return

      setIsLoading(true)
      try {
        const data = await apiService.getCompanyRecommendations(selectedCompany)
        if (data && data.recommendations) {
          // Filter by priority if specified
          let filtered = data.recommendations
          if (priority !== "all") {
            filtered = data.recommendations.filter(rec => rec.urgency === priority)
          }

          // Sort by urgency (High first) and then by impact score
          const sorted = [...filtered].sort((a, b) => {
            const urgencyOrder = { High: 0, Medium: 1, Low: 2 }
            if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
              return urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
            }
            return b.impact_score - a.impact_score
          })
          setRecommendations(extended ? sorted : sorted.slice(0, 3))
        }
      } catch (error) {
        console.error("Error loading recommendations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRecommendations()
  }, [selectedCompany, extended, priority])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No recommendations available
      </div>
    )
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "High":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "Medium":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Low":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      {recommendations.map((rec, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getUrgencyIcon(rec.urgency)}
                  <Badge variant="outline" className={getUrgencyColor(rec.urgency)}>
                    {rec.urgency} Priority
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Impact Score: {rec.impact_score}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-base">{rec.issue}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {rec.recommendation}
                </p>
              </div>

              {rec.related_topics.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {rec.related_topics.map((topic, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
