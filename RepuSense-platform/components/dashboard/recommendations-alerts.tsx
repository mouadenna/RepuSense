"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Clock, Copy, ExternalLink, MessageSquare, ThumbsUp } from "lucide-react"

// Types pour les alertes et recommandations
interface Alert {
  id: string
  title: string
  description: string
  severity: "high" | "medium" | "low"
  date: string
  source: string
  status: "new" | "acknowledged" | "resolved"
}

interface Recommendation {
  id: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
  effort: "high" | "medium" | "low"
  type: "response" | "action" | "monitoring"
  template?: string
}

// Données simulées
const alertsData: Alert[] = [
  {
    id: "a1",
    title: "Pic de mentions négatives",
    description: "Augmentation soudaine de 35% des mentions négatives concernant le service client",
    severity: "high",
    date: "2023-05-04T09:15:00",
    source: "Twitter",
    status: "new",
  },
  {
    id: "a2",
    title: "Problème produit signalé",
    description: "Plusieurs utilisateurs signalent un défaut sur le modèle X500",
    severity: "medium",
    date: "2023-05-03T14:30:00",
    source: "Forums",
    status: "acknowledged",
  },
  {
    id: "a3",
    title: "Influenceur critique",
    description: "L'influenceur @TechReviewer (500K abonnés) a publié une critique négative",
    severity: "medium",
    date: "2023-05-02T11:20:00",
    source: "YouTube",
    status: "acknowledged",
  },
  {
    id: "a4",
    title: "Comparaison concurrentielle défavorable",
    description: "Article comparatif plaçant votre produit en dernière position",
    severity: "low",
    date: "2023-05-01T16:45:00",
    source: "Blog",
    status: "resolved",
  },
]

const recommendationsData: Recommendation[] = [
  {
    id: "r1",
    title: "Répondre aux critiques sur Twitter",
    description: "Utiliser le modèle de réponse pour les problèmes de service client",
    impact: "high",
    effort: "low",
    type: "response",
    template:
      "Bonjour @utilisateur, nous sommes désolés pour cette expérience. Notre équipe va vous contacter en DM pour résoudre ce problème rapidement.",
  },
  {
    id: "r2",
    title: "Publier un communiqué sur le problème X500",
    description: "Reconnaître le problème et annoncer un correctif",
    impact: "high",
    effort: "medium",
    type: "action",
  },
  {
    id: "r3",
    title: "Contacter l'influenceur @TechReviewer",
    description: "Proposer un test du nouveau modèle amélioré",
    impact: "medium",
    effort: "medium",
    type: "action",
  },
  {
    id: "r4",
    title: "Surveiller les mentions du concurrent A",
    description: "Configurer une alerte spécifique pour les comparaisons avec le concurrent A",
    impact: "low",
    effort: "low",
    type: "monitoring",
  },
]

export default function RecommendationsAlerts() {
  const [activeAlerts, setActiveAlerts] = useState(alertsData)
  const [activeRecommendations, setActiveRecommendations] = useState(recommendationsData)

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Obtenir l'icône et la couleur en fonction de la sévérité
  const getSeverityDetails = (severity: Alert["severity"]) => {
    switch (severity) {
      case "high":
        return { icon: <AlertTriangle className="h-4 w-4" />, color: "text-red-500 bg-red-100 dark:bg-red-900/30" }
      case "medium":
        return { icon: <Clock className="h-4 w-4" />, color: "text-amber-500 bg-amber-100 dark:bg-amber-900/30" }
      case "low":
        return { icon: <MessageSquare className="h-4 w-4" />, color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30" }
    }
  }

  // Obtenir l'icône et la couleur en fonction du type de recommandation
  const getRecommendationDetails = (type: Recommendation["type"]) => {
    switch (type) {
      case "response":
        return { icon: <MessageSquare className="h-4 w-4" />, color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30" }
      case "action":
        return { icon: <ExternalLink className="h-4 w-4" />, color: "text-green-500 bg-green-100 dark:bg-green-900/30" }
      case "monitoring":
        return { icon: <Clock className="h-4 w-4" />, color: "text-amber-500 bg-amber-100 dark:bg-amber-900/30" }
    }
  }

  // Marquer une alerte comme traitée
  const acknowledgeAlert = (id: string) => {
    setActiveAlerts((alerts) => alerts.map((alert) => (alert.id === id ? { ...alert, status: "acknowledged" } : alert)))
  }

  // Marquer une alerte comme résolue
  const resolveAlert = (id: string) => {
    setActiveAlerts((alerts) => alerts.map((alert) => (alert.id === id ? { ...alert, status: "resolved" } : alert)))
  }

  // Copier un modèle de réponse
  const copyTemplate = (template: string) => {
    navigator.clipboard
      .writeText(template)
      .then(() => {
        // Pourrait afficher une notification de succès
        console.log("Modèle copié !")
      })
      .catch((err) => {
        console.error("Erreur lors de la copie:", err)
      })
  }

  return (
    <Card className="border-blue-100 dark:border-blue-900/30">
      <CardHeader className="pb-2">
        <CardTitle>Recommandations & Alertes</CardTitle>
        <CardDescription>Générées automatiquement par RepuSense</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="alerts">
          <TabsList className="mb-4">
            <TabsTrigger value="alerts">
              Alertes
              <Badge className="ml-2 bg-red-500" variant="default">
                {activeAlerts.filter((a) => a.status === "new").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts">
            <div className="space-y-3 max-h-[400px] overflow-auto pr-1">
              {activeAlerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>Aucune alerte active</p>
                </div>
              ) : (
                activeAlerts.map((alert) => {
                  const { icon, color } = getSeverityDetails(alert.severity)
                  return (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${
                        alert.status === "new"
                          ? "border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-900/10"
                          : alert.status === "acknowledged"
                            ? "border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-900/10"
                            : "border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/10"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2">
                          <div className={`p-1.5 rounded-full ${color} mt-0.5`}>{icon}</div>
                          <div>
                            <h4 className="text-sm font-medium">{alert.title}</h4>
                            <p className="text-xs text-muted-foreground">{alert.description}</p>
                            <div className="mt-1 flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {alert.source}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{formatDate(alert.date)}</span>
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={
                            alert.status === "new"
                              ? "default"
                              : alert.status === "acknowledged"
                                ? "outline"
                                : "secondary"
                          }
                          className={
                            alert.status === "new"
                              ? "bg-red-500"
                              : alert.status === "acknowledged"
                                ? "border-amber-500 text-amber-500"
                                : ""
                          }
                        >
                          {alert.status === "new" ? "Nouveau" : alert.status === "acknowledged" ? "En cours" : "Résolu"}
                        </Badge>
                      </div>

                      {alert.status !== "resolved" && (
                        <div className="mt-2 flex justify-end space-x-2">
                          {alert.status === "new" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => acknowledgeAlert(alert.id)}
                              className="text-xs h-7"
                            >
                              Prendre en charge
                            </Button>
                          )}
                          <Button
                            variant={alert.status === "new" ? "ghost" : "outline"}
                            size="sm"
                            onClick={() => resolveAlert(alert.id)}
                            className="text-xs h-7"
                          >
                            Marquer résolu
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="recommendations">
            <div className="space-y-3 max-h-[400px] overflow-auto pr-1">
              {activeRecommendations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ThumbsUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>Aucune recommandation active</p>
                </div>
              ) : (
                activeRecommendations.map((rec) => {
                  const { icon, color } = getRecommendationDetails(rec.type)
                  return (
                    <div
                      key={rec.id}
                      className="p-3 rounded-lg border border-blue-100 bg-blue-50/30 dark:border-blue-900/30 dark:bg-blue-900/10"
                    >
                      <div className="flex items-start space-x-2">
                        <div className={`p-1.5 rounded-full ${color} mt-0.5`}>{icon}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h4 className="text-sm font-medium">{rec.title}</h4>
                            <div className="flex items-center space-x-1">
                              <Badge variant="outline" className="text-xs">
                                Impact: {rec.impact}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Effort: {rec.effort}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{rec.description}</p>

                          {rec.template && (
                            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono relative group">
                              {rec.template}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => copyTemplate(rec.template!)}
                              >
                                <Copy className="h-3 w-3" />
                                <span className="sr-only">Copier</span>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
