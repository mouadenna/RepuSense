"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, Clock, CheckCircle2, TrendingUp } from "lucide-react"
import { useEffect } from "react"
import { apiService } from "@/lib/api"
import { useCompany } from "@/contexts/CompanyContext"
import { useRecommendation } from "@/contexts/RecommendationContext"

interface Recommendation {
  issue: string
  recommendation: string
  urgency: "High" | "Medium" | "Low"
  related_topics: string[]
  impact_score: number
}

export function RecommendationsList() {
  const { selectedCompany } = useCompany()
  const { 
    recommendations, 
    setRecommendations, 
    selectedRecommendation, 
    setSelectedRecommendation,
    loading,
    setLoading,
    error,
    setError
  } = useRecommendation()

  useEffect(() => {
    async function fetchRecommendations() {
      if (!selectedCompany) return

      setLoading(true)
      setError(null)

      try {
        const data = await apiService.getCompanyRecommendations(selectedCompany)
        if (data && data.recommendations) {
          setRecommendations(data.recommendations)
          if (data.recommendations.length > 0) {
            setSelectedRecommendation(data.recommendations[0])
          }
        } else {
          setRecommendations([])
          setSelectedRecommendation(null)
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err)
        setError("Failed to load recommendations")
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [selectedCompany, setRecommendations, setSelectedRecommendation, setLoading, setError])

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="p-3">
            <div className="flex items-start gap-2">
              <div className="h-5 w-5 mt-0.5 flex-shrink-0 bg-muted rounded animate-pulse" />
              <div className="space-y-2 w-full">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="flex items-center justify-between">
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>
  }

  if (recommendations.length === 0) {
    return <div className="text-sm text-muted-foreground">No recommendations available</div>
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "High":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "Medium":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "Low":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      default:
        return null
    }
  }

  const handleCardClick = (recommendation: Recommendation) => {
    setSelectedRecommendation(recommendation)
  }

  return (
    <div className="space-y-3">
      {recommendations.map((recommendation, index) => (
        <Card
          key={index}
          className={`p-3 cursor-pointer hover:border-primary transition-colors ${
            recommendation === selectedRecommendation ? "border-primary bg-primary/5" : ""
          }`}
          onClick={() => handleCardClick(recommendation)}
        >
          <div className="flex items-start gap-2">
            {getUrgencyIcon(recommendation.urgency)}
            <div className="space-y-1 w-full">
              <h3 className="font-medium text-sm">{recommendation.issue}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {recommendation.recommendation}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-primary" />
                  <span>Impact: {recommendation.impact_score}</span>
                </div>
                <Badge
                  variant={recommendation.urgency === "High" ? "destructive" : "outline"}
                  className="text-[10px] px-1 h-4"
                >
                  {recommendation.urgency}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      ))}
      {recommendations.length > 0 && (
        <Button variant="outline" size="sm" className="w-full">
          View archived recommendations
        </Button>
      )}
    </div>
  )
}
