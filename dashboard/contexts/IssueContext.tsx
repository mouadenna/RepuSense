"use client"
import { createContext, useContext, useState, ReactNode } from "react"

interface Alert {
  id: number
  severity: string
  title: string
  description: string
  source: string
  created_at: string
  status: string
}

interface IssueContextType {
  selectedIssue: Alert | null
  issues: Alert[]
  setSelectedIssue: (issue: Alert | null) => void
  setIssues: (issues: Alert[]) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
}

const IssueContext = createContext<IssueContextType | undefined>(undefined)

export function IssueProvider({ children }: { children: ReactNode }) {
  const [selectedIssue, setSelectedIssue] = useState<Alert | null>(null)
  const [issues, setIssues] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  return (
    <IssueContext.Provider
      value={{
        selectedIssue,
        issues,
        setSelectedIssue,
        setIssues,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </IssueContext.Provider>
  )
}

export function useIssue() {
  const context = useContext(IssueContext)
  if (context === undefined) {
    throw new Error("useIssue must be used within an IssueProvider")
  }
  return context
} 