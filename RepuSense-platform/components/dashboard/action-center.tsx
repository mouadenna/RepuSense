"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Copy,
  ExternalLink,
  Lightbulb,
  MessageSquare,
  ThumbsUp,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

// Types pour les alertes et actions
interface Alert {
  id: string
  title: string
  description: string
  severity: "high" | "medium" | "low"
  date: string
  source: string
  author?: string
  content?: string
  status: "new" | "in-progress" | "resolved"
}

interface Action {
  id: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
  type: "respond" | "publish" | "contact" | "monitor"
  template?: string
  status: "pending" | "completed"
}

// Données simulées
const alertsData: Alert[] = [
  {
    id: "a1",
    title: "Critique d'un influenceur",
    description: "@TechExpert (450K abonnés) a critiqué votre service client",
    severity: "high",
    date: "2023-05-04T09:15:00",
    source: "Twitter",
    author: "@TechExpert",
    content:
      "Déçu par le service client de @VotreEntreprise. 3 jours pour répondre à un email et toujours pas de solution à mon problème. #ServiceClient #Déception",
    status: "new",
  },
  {
    id: "a2",
    title: "Problème produit signalé",
    description: "Plusieurs utilisateurs signalent un défaut sur le modèle X500",
    severity: "medium",
    date: "2023-05-03T14:30:00",
    source: "Forums",
    status: "in-progress",
  },
  {
    id: "a3",
    title: "Pic de mentions négatives",
    description: "Augmentation de 35% des mentions négatives sur la livraison",
    severity: "medium",
    date: "2023-05-02T11:20:00",
    source: "Tous canaux",
    status: "in-progress",
  },
]

const actionsData: Action[] = [
  {
    id: "r1",
    title: "Répondre à @TechExpert",
    description: "Répondre rapidement à la critique de l'influenceur",
    impact: "high",
    type: "respond",
    template:
      "@TechExpert Nous sommes désolés pour cette expérience. Nous prenons votre feedback très au sérieux. Notre équipe va vous contacter en DM pour résoudre ce problème immédiatement.",
    status: "pending",
  },
  {
    id: "r2",
    title: "Publier un communiqué sur le problème X500",
    description: "Reconnaître le problème et annoncer un correctif",
    impact: "high",
    type: "publish",
    status: "pending",
  },
  {
    id: "r3",
    title: "Améliorer la communication sur les délais de livraison",
    description: "Mettre à jour les pages produits avec des informations plus précises",
    impact: "medium",
    type: "publish",
    status: "pending",
  },
  {
    id: "r4",
    title: "Contacter les clients ayant signalé le problème X500",
    description: "Proposer un remplacement ou une réparation gratuite",
    impact: "medium",
    type: "contact",
    status: "completed",
  },
]

export default function ActionCenter() {
  const [alerts, setAlerts] = useState(alertsData)
  const [actions, setActions] = useState(actionsData)
  const { toast } = useToast()

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))

    if (diffHours < 1) {
      return "Il y a moins d'une heure"
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`
    } else if (diffDays === 1) {
      return "Hier"
    } else {
      return `Il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`
    }
  }

  // Obtenir l'icône et la couleur en fonction de la sévérité
  const getSeverityDetails = (severity: Alert["severity"]) => {
    switch (severity) {
      case "high":
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          color: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400",
          badge: "bg-red-500",
        }
      case "medium":
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
          badge: "bg-amber-500",
        }
      case "low":
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
          badge: "bg-blue-500",
        }
    }
  }

  // Obtenir l'icône et la couleur en fonction du type d'action
  const getActionDetails = (type: Action["type"]) => {
    switch (type) {
      case "respond":
        return {
          icon: <MessageSquare className="h-4 w-4" />,
          color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
        }
      case "publish":
        return {
          icon: <ExternalLink className="h-4 w-4" />,
          color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
        }
      case "contact":
        return {
          icon: <MessageSquare className="h-4 w-4" />,
          color: "text-violet-600 bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400",
        }
      case "monitor":
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
        }
    }
  }

  // Mettre à jour le statut d'une alerte
  const updateAlertStatus = (id: string, status: Alert["status"]) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, status } : alert)))
    toast({
      title: "Statut mis à jour",
      description: `L'alerte a été marquée comme ${
        status === "in-progress" ? "en cours" : status === "resolved" ? "résolue" : "nouvelle"
      }`,
    })
  }

  // Marquer une action comme terminée
  const completeAction = (id: string) => {
    setActions((prev) => prev.map((action) => (action.id === id ? { ...action, status: "completed" } : action)))
    toast({
      title: "Action terminée",
      description: "L'action a été marquée comme terminée",
    })
  }

  // Copier un modèle de réponse
  const copyTemplate = (template: string) => {
    navigator.clipboard
      .writeText(template)
      .then(() => {
        toast({
          title: "Modèle copié",
          description: "Le modèle de réponse a été copié dans le presse-papier",
        })
      })
      .catch((err) => {
        toast({
          title: "Erreur",
          description: "Impossible de copier le modèle",
          variant: "destructive",
        })
      })
  }

  return (
    <Card className="border-blue-100 dark:border-blue-900/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <CardTitle>Centre d'action</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
            Tout voir
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Alertes et actions recommandées pour améliorer votre e-réputation</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="alerts">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="alerts" className="relative">
              Alertes
              {alerts.filter((a) => a.status === "new").length > 0 && (
                <Badge className="ml-2 bg-red-500" variant="default">
                  {alerts.filter((a) => a.status === "new").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="actions" className="relative">
              Actions recommandées
              {actions.filter((a) => a.status === "pending").length > 0 && (
                <Badge className="ml-2 bg-blue-500" variant="default">
                  {actions.filter((a) => a.status === "pending").length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alerts">
            <div className="space-y-3 max-h-[400px] overflow-auto pr-1">
              {alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <CheckCircle className="mb-2 h-8 w-8 text-emerald-500" />
                  <p>Aucune alerte active</p>
                  <p className="text-xs">Tout va bien pour le moment!</p>
                </div>
              ) : (
                alerts.map((alert) => {
                  const { icon, color, badge } = getSeverityDetails(alert.severity)
                  return (
                    <div
                      key={alert.id}
                      className={`rounded-lg border p-4 ${
                        alert.status === "new"
                          ? "border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-900/10"
                          : alert.status === "in-progress"
                            ? "border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-900/10"
                            : "border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/10"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 rounded-full p-1.5 ${color}`}>{icon}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium">{alert.title}</h4>
                            <Badge
                              variant={
                                alert.status === "new"
                                  ? "default"
                                  : alert.status === "in-progress"
                                    ? "outline"
                                    : "secondary"
                              }
                              className={
                                alert.status === "new"
                                  ? badge
                                  : alert.status === "in-progress"
                                    ? "border-amber-500 text-amber-500"
                                    : ""
                              }
                            >
                              {alert.status === "new"
                                ? "Nouveau"
                                : alert.status === "in-progress"
                                  ? "En cours"
                                  : "Résolu"}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>

                          {alert.content && (
                            <div className="mt-2 rounded-md border p-3">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">{alert.author?.[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{alert.author}</span>
                              </div>
                              <p className="mt-1 text-sm">{alert.content}</p>
                            </div>
                          )}

                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {alert.source}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{formatDate(alert.date)}</span>
                            </div>

                            {alert.status !== "resolved" && (
                              <div className="flex gap-2">
                                {alert.status === "new" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateAlertStatus(alert.id, "in-progress")}
                                    className="h-7 text-xs"
                                  >
                                    Prendre en charge
                                  </Button>
                                )}
                                <Button
                                  variant={alert.status === "new" ? "ghost" : "outline"}
                                  size="sm"
                                  onClick={() => updateAlertStatus(alert.id, "resolved")}
                                  className="h-7 text-xs"
                                >
                                  Marquer résolu
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="actions">
            <div className="space-y-3 max-h-[400px] overflow-auto pr-1">
              {actions.filter((a) => a.status === "pending").length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <ThumbsUp className="mb-2 h-8 w-8 text-emerald-500" />
                  <p>Aucune action en attente</p>
                  <p className="text-xs">Toutes les actions recommandées ont été traitées!</p>
                </div>
              ) : (
                actions
                  .filter((a) => a.status === "pending")
                  .map((action) => {
                    const { icon, color } = getActionDetails(action.type)
                    return (
                      <div
                        key={action.id}
                        className="rounded-lg border border-blue-100 bg-blue-50/30 p-4 dark:border-blue-900/30 dark:bg-blue-900/10"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 rounded-full p-1.5 ${color}`}>{icon}</div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium">{action.title}</h4>
                              <Badge
                                variant="outline"
                                className={`border-${
                                  action.impact === "high"
                                    ? "red-500 text-red-500"
                                    : action.impact === "medium"
                                      ? "amber-500 text-amber-500"
                                      : "blue-500 text-blue-500"
                                }`}
                              >
                                Impact: {action.impact}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>

                            {action.template && (
                              <div className="relative mt-2 rounded-md bg-gray-100 p-3 text-xs font-mono dark:bg-gray-800">
                                {action.template}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-1 top-1 h-6 w-6 opacity-50 hover:opacity-100"
                                  onClick={() => copyTemplate(action.template!)}
                                >
                                  <Copy className="h-3 w-3" />
                                  <span className="sr-only">Copier</span>
                                </Button>
                              </div>
                            )}

                            <div className="mt-3 flex justify-end">
                              <Button
                                size="sm"
                                className="h-8 bg-blue-600 text-xs hover:bg-blue-700"
                                onClick={() => completeAction(action.id)}
                              >
                                Marquer comme terminé
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
              )}

              {actions.filter((a) => a.status === "completed").length > 0 && (
                <div className="mt-4 rounded-md border p-3">
                  <h4 className="mb-2 text-sm font-medium">Actions récemment terminées</h4>
                  <div className="space-y-2">
                    {actions
                      .filter((a) => a.status === "completed")
                      .map((action) => (
                        <div
                          key={action.id}
                          className="flex items-center justify-between rounded-md p-2 hover:bg-muted"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <span className="text-sm">{action.title}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Terminé
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
