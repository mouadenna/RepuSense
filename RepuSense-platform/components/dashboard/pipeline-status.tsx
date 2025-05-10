"use client"

import type React from "react"

import { Clock, Database, RefreshCw, Server } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PipelineStage {
  name: string
  status: "completed" | "in-progress" | "pending" | "error"
  lastRun: string
  icon: React.ReactNode
  description: string
}

// Données simulées pour le statut du pipeline
const pipelineStages: PipelineStage[] = [
  {
    name: "Collecte de données",
    status: "completed",
    lastRun: "2023-05-04T08:30:00",
    icon: <RefreshCw className="h-4 w-4" />,
    description: "Scraping et collecte via APIs des réseaux sociaux et autres sources",
  },
  {
    name: "Stockage Data Lake",
    status: "completed",
    lastRun: "2023-05-04T09:15:00",
    icon: <Database className="h-4 w-4" />,
    description: "Stockage des données brutes dans le Data Lake",
  },
  {
    name: "Analyse NLP",
    status: "completed",
    lastRun: "2023-05-04T09:45:00",
    icon: <Server className="h-4 w-4" />,
    description: "Traitement et analyse NLP (sentiment, sujets, entités)",
  },
  {
    name: "Mise à jour analytique",
    status: "in-progress",
    lastRun: "2023-05-04T10:00:00",
    icon: <Clock className="h-4 w-4" />,
    description: "Mise à jour de la base analytique et des KPIs",
  },
]

export default function PipelineStatus() {
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

  // Obtenir le statut global du pipeline
  const getPipelineStatus = () => {
    if (pipelineStages.some((stage) => stage.status === "error")) return "error"
    if (pipelineStages.some((stage) => stage.status === "in-progress")) return "in-progress"
    if (pipelineStages.every((stage) => stage.status === "completed")) return "completed"
    return "pending"
  }

  const pipelineStatus = getPipelineStatus()

  return (
    <Card className="border-blue-100 dark:border-blue-900/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium">Statut du Pipeline RepuSense</CardTitle>
            <CardDescription>Dernière exécution complète: {formatDate("2023-05-04T08:00:00")}</CardDescription>
          </div>
          <Badge
            variant={
              pipelineStatus === "completed" ? "default" : pipelineStatus === "in-progress" ? "outline" : "destructive"
            }
            className={
              pipelineStatus === "completed"
                ? "bg-blue-500"
                : pipelineStatus === "in-progress"
                  ? "border-blue-500 text-blue-500"
                  : ""
            }
          >
            {pipelineStatus === "completed"
              ? "Terminé"
              : pipelineStatus === "in-progress"
                ? "En cours"
                : pipelineStatus === "error"
                  ? "Erreur"
                  : "En attente"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {pipelineStages.map((stage, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-between rounded-md border border-blue-100 dark:border-blue-900/20 p-2 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`p-1.5 rounded-full 
                        ${
                          stage.status === "completed"
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            : stage.status === "in-progress"
                              ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                              : stage.status === "error"
                                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {stage.icon}
                      </div>
                      <span className="text-sm font-medium">{stage.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">{formatDate(stage.lastRun)}</span>
                      <div
                        className={`h-2 w-2 rounded-full 
                        ${
                          stage.status === "completed"
                            ? "bg-blue-500"
                            : stage.status === "in-progress"
                              ? "bg-amber-500"
                              : stage.status === "error"
                                ? "bg-red-500"
                                : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{stage.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Prochaine exécution prévue: {formatDate("2023-05-05T08:00:00")}
        </div>
      </CardContent>
    </Card>
  )
}
