"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, MessageSquare } from "lucide-react"
import { useEffect } from "react"
import { apiService } from "@/lib/api"
import { useCompany } from "@/contexts/CompanyContext"
import { useIssue } from "@/contexts/IssueContext"

interface Alert {
  id: number
  severity: string
  title: string
  description: string
  source: string
  created_at: string
  status: string
}

export function IssueList() {
  const { selectedCompany } = useCompany()
  const { 
    issues, 
    setIssues, 
    selectedIssue, 
    setSelectedIssue,
    loading,
    setLoading,
    error,
    setError
  } = useIssue()

  useEffect(() => {
    async function fetchAlerts() {
      if (!selectedCompany) return

      setLoading(true)
      setError(null)

      try {
        const data = await apiService.getCompanyAlerts(selectedCompany)
        if (data && data.alerts) {
          setIssues(data.alerts)
          if (data.alerts.length > 0) {
            setSelectedIssue(data.alerts[0])
          }
        } else {
          setIssues([])
          setSelectedIssue(null)
        }
      } catch (err) {
        console.error("Error fetching alerts:", err)
        setError("Failed to load issues")
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [selectedCompany, setIssues, setSelectedIssue, setLoading, setError])

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

  if (issues.length === 0) {
    return <div className="text-sm text-muted-foreground">No issues detected</div>
  }

  const handleCardClick = (issue: Alert) => {
    setSelectedIssue(issue)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return "text-red-500"
      case "medium":
        return "text-amber-500"
      case "low":
      default:
        return "text-blue-500"
    }
  }

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return "destructive"
      case "medium":
        return "outline"
      case "low":
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-3">
      {issues.map((issue) => (
        <Card
          key={issue.id}
          className={`p-3 cursor-pointer hover:border-primary transition-colors ${
            issue.id === selectedIssue?.id ? "border-primary bg-primary/5" : ""
          }`}
          onClick={() => handleCardClick(issue)}
        >
          <div className="flex items-start gap-2">
            <AlertCircle
              className={`h-5 w-5 mt-0.5 flex-shrink-0 ${getSeverityColor(issue.severity)}`}
            />
            <div className="space-y-1 w-full">
              <h3 className="font-medium text-sm">{issue.title}</h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{issue.source}</span>
                </div>
                <Badge
                  variant={getSeverityBadgeVariant(issue.severity)}
                  className="text-[10px] px-1 h-4"
                >
                  {issue.severity}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      ))}
      {issues.length > 0 && (
        <Button variant="outline" size="sm" className="w-full">
          View archived issues
        </Button>
      )}
    </div>
  )
}
