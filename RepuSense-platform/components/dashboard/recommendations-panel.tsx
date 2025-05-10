"use client"

import { ArrowRight, Lightbulb } from "lucide-react"
import { Card as UICard, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Données simulées pour les recommandations
const recommendationsData = [
  {
    id: 1,
    title: "Améliorer le service de livraison",
    description:
      "Les retards de livraison sont la principale source de mécontentement. Envisagez de revoir vos processus logistiques ou de changer de prestataire.",
    impact: "high",
    effort: "medium",
  },
  {
    id: 2,
    title: "Corriger les bugs de l'application mobile",
    description:
      "Plusieurs utilisateurs signalent des problèmes de connexion et de paiement sur l'application mobile. Une mise à jour est recommandée.",
    impact: "medium",
    effort: "low",
  },
  {
    id: 3,
    title: "Communiquer sur les améliorations produits",
    description:
      "Les améliorations récentes de la qualité des produits sont bien perçues. Une campagne de communication pourrait renforcer cette perception positive.",
    impact: "medium",
    effort: "low",
  },
]

export default function RecommendationsPanel() {
  // Couleur en fonction de l'impact
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
      case "medium":
        return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <UICard className="border-blue-100 dark:border-blue-900/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-blue-500" />
            <CardTitle>Recommandations</CardTitle>
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
        <CardDescription>Actions recommandées basées sur l'analyse</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendationsData.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              Aucune recommandation disponible pour le moment.
            </div>
          ) : (
            recommendationsData.map((recommendation) => (
              <div key={recommendation.id} className="rounded-md border border-blue-100 dark:border-blue-900/30 p-3">
                <div className="flex items-start space-x-3">
                  <div className={`rounded-full px-2 py-1 text-xs ${getImpactColor(recommendation.impact)}`}>
                    {recommendation.impact === "high"
                      ? "Prioritaire"
                      : recommendation.impact === "medium"
                        ? "Important"
                        : "Modéré"}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{recommendation.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{recommendation.description}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Effort:{" "}
                        {recommendation.effort === "low"
                          ? "Faible"
                          : recommendation.effort === "medium"
                            ? "Moyen"
                            : "Élevé"}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-800 dark:hover:bg-blue-950/50"
                      >
                        Appliquer
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </UICard>
  )
}
