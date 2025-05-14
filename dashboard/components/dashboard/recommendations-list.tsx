"use client"

import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown, ArrowUp, ArrowDown } from "lucide-react"
import { apiService } from "@/lib/api"
import { useCompany } from "@/contexts/CompanyContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import React from "react"

interface Recommendation {
  id: number
  type: string
  title: string
  description: string
  impact_score: number
  related_topics: string[]
  sentiment_impact: {
    current: number
    potential: number
  }
}

interface RecommendationsListProps {
  extended?: boolean
}

export function RecommendationsList({ extended = false }: RecommendationsListProps) {
  const { selectedCompany } = useCompany()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [expandedIds, setExpandedIds] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRecommendations() {
      if (!selectedCompany) return

      setIsLoading(true)

      try {
        const data = await apiService.getCompanyRecommendations(selectedCompany)
        if (data && data.recommendations) {
          // Sort by impact score in descending order and ensure IDs are present
          const sortedRecs = [...data.recommendations]
            .map((rec, index) => ({
              ...rec,
              id: rec.id || `fallback-id-${index}` // Ensure each recommendation has an ID
            }))
            .sort((a, b) => b.impact_score - a.impact_score)
          
          setRecommendations(sortedRecs)
          
          // If in extended mode, expand all by default
          if (extended) {
            setExpandedIds(sortedRecs.map(rec => rec.id))
          } else {
            // Otherwise just expand the top recommendation
            setExpandedIds(sortedRecs.length > 0 ? [sortedRecs[0].id] : [])
          }
        } else {
          setRecommendations([])
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error)
        setRecommendations([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [selectedCompany, extended])

  const toggleExpand = (id: number) => {
    setExpandedIds(prevIds => 
      prevIds.includes(id) 
        ? prevIds.filter(prevId => prevId !== id)
        : [...prevIds, id]
    )
  }

  const displayRecs = extended ? recommendations : recommendations.slice(0, 3)

  const getTypeColor = (type: string) => {
    if (!type) return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    
    switch(type.toLowerCase()) {
      case 'high': return "bg-red-100 text-red-800 hover:bg-red-200"
      case 'medium': return "bg-orange-100 text-orange-800 hover:bg-orange-200" 
      case 'low': return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading recommendations...</div>
        </div>
      ) : displayRecs.length === 0 ? (
        <div className="flex h-40 items-center justify-center">
          <div className="text-sm text-muted-foreground">No recommendations available</div>
            </div>
      ) : (
        <div className="space-y-3">
          {displayRecs.map((rec, index) => (
            <Card key={`recommendation-${rec.id}-${index}`} className="overflow-hidden">
              <CardContent className="pt-4">
                <div className="mb-2 flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getTypeColor(rec.type)}>
                        {rec.type ? `${rec.type.charAt(0).toUpperCase() + rec.type.slice(1)} Priority` : 'Unknown Priority'}
            </Badge>
                      <span className="text-sm text-muted-foreground">Impact Score: {rec.impact_score}</span>
                    </div>
                    <h4 className="font-medium">{rec.title}</h4>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleExpand(rec.id)}
                    className="ml-2"
                  >
                    {expandedIds.includes(rec.id) ? <ChevronUp /> : <ChevronDown />}
                  </Button>
          </div>

                {expandedIds.includes(rec.id) && (
                  <div className="mt-2 space-y-3">
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {rec.related_topics && rec.related_topics.map((topic, i) => (
                        <Badge key={`topic-${rec.id}-${i}`} variant="secondary" className="text-xs">
                          {topic}
              </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-1">
                      {rec.sentiment_impact && (
                        <React.Fragment key={`sentiment-impact-${rec.id}`}>
                          <div key={`impact-current-${rec.id}`} className="flex items-center">
                            <span className="text-xs text-muted-foreground mr-1">Current impact:</span>
                            <span className={`text-sm font-medium flex items-center ${rec.sentiment_impact.current < 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {rec.sentiment_impact.current < 0 ? <ArrowDown className="h-3 w-3 mr-1" /> : <ArrowUp className="h-3 w-3 mr-1" />}
                              {Math.abs(rec.sentiment_impact.current).toFixed(2)}
                            </span>
                          </div>
                          <div key={`impact-potential-${rec.id}`} className="flex items-center">
                            <span className="text-xs text-muted-foreground mr-1">Potential gain:</span>
                            <span className="text-sm font-medium text-green-600 flex items-center">
                              <ArrowUp className="h-3 w-3 mr-1" />
                              {rec.sentiment_impact.potential.toFixed(2)}
              </span>
            </div>
                        </React.Fragment>
                      )}
                    </div>
          </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!extended && recommendations.length > 3 && (
        <CardFooter className="px-0 pt-2">
          <Button variant="link" className="w-full">View all {recommendations.length} recommendations</Button>
        </CardFooter>
      )}
    </div>
  )
}
