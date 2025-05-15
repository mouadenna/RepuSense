"use client"
import { createContext, useContext, useState, ReactNode } from "react"

interface Recommendation {
  issue: string
  recommendation: string
  urgency: "High" | "Medium" | "Low"
  related_topics: string[]
  impact_score: number
}

interface RecommendationContextType {
  selectedRecommendation: Recommendation | null
  recommendations: Recommendation[]
  setSelectedRecommendation: (recommendation: Recommendation | null) => void
  setRecommendations: (recommendations: Recommendation[]) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
}

const RecommendationContext = createContext<RecommendationContextType | undefined>(undefined)

export function RecommendationProvider({ children }: { children: ReactNode }) {
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  return (
    <RecommendationContext.Provider
      value={{
        selectedRecommendation,
        recommendations,
        setSelectedRecommendation,
        setRecommendations,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </RecommendationContext.Provider>
  )
}

export function useRecommendation() {
  const context = useContext(RecommendationContext)
  if (context === undefined) {
    throw new Error("useRecommendation must be used within a RecommendationProvider")
  }
  return context
} 