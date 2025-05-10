"use client"

import { AlertTriangle, ArrowRight, Bell } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Données simulées pour les alertes
const alertsData = [
  {
    id: 1,
    title: "Pic de mentions négatives",
    description: "Augmentation de 35% des mentions négatives concernant la livraison",
    severity: "high",
    date: "2023-05-04T10:15:00",
  },
  {
    id: 2,
    title: "Nouvelle tendance détectée",
    description: "Discussions croissantes sur les problèmes de l'application mobile",
    severity: "medium",
    date: "2023-05-03T14:30:00",
  },
  {
    id: 3,
    title: "Baisse du sentiment global",
    description: "Le sentiment global a diminué de 5% au cours des dernières 24h",
    severity: "low",
    date: "2023-05-02T09:45:00",
  },
]

export default function AlertsPanel() {
  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Aujourd'hui"
    } else if (diffDays === 1) {
      return "Hier"
    } else {
      return `Il y a ${diffDays} jours`
    }
  }

  // Couleur en fonction de la sévérité
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300"
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Card className="border-blue-100 dark:border-blue-900/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-blue-500" />
            <CardTitle>Alertes</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50"
          >
            Voir toutes
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
        <CardDescription>Alertes et notifications importantes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alertsData.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">Aucune alerte active pour le moment.</div>
          ) : (
            alertsData.map((alert) => (
              <div key={alert.id} className={`rounded-md p-3 ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{alert.title}</div>
                      <div className="text-xs">{formatDate(alert.date)}</div>
                    </div>
                    <div className="mt-1 text-sm">{alert.description}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
