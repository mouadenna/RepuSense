"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Bell, Calendar, CheckCircle, Clock } from "lucide-react"
import { apiService } from "@/lib/api"
import { useCompany } from "@/contexts/CompanyContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Alert {
  id: number
  severity: string
  title: string
  description: string
  source: string
  created_at: string
  status: string
}

export function AlertsList() {
  const { selectedCompany } = useCompany()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAlerts() {
      if (!selectedCompany) return

      setIsLoading(true)

      try {
        const data = await apiService.getCompanyAlerts(selectedCompany)
        if (data && data.alerts) {
          // Sort by severity (critical first) and then by date (newest first)
          const sortedAlerts = [...data.alerts].sort((a, b) => {
            const severityOrder = {
              critical: 0,
              high: 1,
              medium: 2,
              low: 3
            }
            
            const aSeverity = severityOrder[a.severity as keyof typeof severityOrder] || 999
            const bSeverity = severityOrder[b.severity as keyof typeof severityOrder] || 999
            
            if (aSeverity !== bSeverity) return aSeverity - bSeverity
            
            // If same severity, sort by date (newest first)
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          })
          
          setAlerts(sortedAlerts)
        } else {
          setAlerts([])
        }
      } catch (error) {
        console.error("Error fetching alerts:", error)
        setAlerts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlerts()
  }, [selectedCompany])

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSeverityColor = (severity: string) => {
    switch(severity.toLowerCase()) {
      case 'critical': return "bg-red-100 text-red-800 hover:bg-red-200"
      case 'high': return "bg-orange-100 text-orange-800 hover:bg-orange-200" 
      case 'medium': return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case 'low': return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch(severity.toLowerCase()) {
      case 'critical':
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'medium':
        return <Bell className="h-4 w-4 text-yellow-600" />
      case 'low':
        return <Bell className="h-4 w-4 text-blue-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Active Alerts</h3>
        <Button variant="outline" size="sm" className="h-8">Mark all as read</Button>
      </div>
      
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading alerts...</div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="flex h-40 items-center justify-center">
          <div className="text-sm text-muted-foreground">No alerts available</div>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className={`overflow-hidden border-l-4 ${
              alert.severity === 'critical' ? 'border-l-red-500' :
              alert.severity === 'high' ? 'border-l-orange-500' :
              alert.severity === 'medium' ? 'border-l-yellow-500' :
              'border-l-blue-500'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {getSeverityIcon(alert.severity)}
                      <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      </Badge>
                      <Badge variant="secondary">
                        {alert.source}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(alert.created_at)}
                      </div>
                    </div>
                    <h4 className="font-medium">{alert.title}</h4>
                  </div>
                  
                  <Badge variant={alert.status === 'active' ? 'outline' : 'secondary'} className="ml-2">
                    {alert.status === 'active' ? (
                      <Clock className="h-3 w-3 mr-1" />
                    ) : (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    )}
                    {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                  </Badge>
                </div>
                
                <p className="mt-2 text-sm text-muted-foreground">{alert.description}</p>
                
                <div className="mt-3 flex justify-end space-x-2">
                  <Button variant="outline" size="sm">Dismiss</Button>
                  <Button size="sm">Take Action</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 