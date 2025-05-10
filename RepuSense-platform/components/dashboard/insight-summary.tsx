"use client"

import { ArrowRight, ArrowUpRight, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function InsightSummary() {
  return (
    <Card className="border-blue-100 dark:border-blue-900/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <CardTitle>Aperçu des insights</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
            Tous les insights
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Résumé des principaux insights de votre e-réputation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                <ArrowUpRight className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Votre réputation s'améliore</h3>
                <p className="text-sm text-muted-foreground">
                  Votre score de réputation a augmenté de 4.3% ce mois-ci, principalement grâce à l'amélioration du
                  sentiment sur Twitter et aux mentions positives concernant votre nouveau produit.
                </p>
                <div className="pt-1">
                  <Button variant="link" className="h-auto p-0 text-blue-600 dark:text-blue-400">
                    Voir l'analyse détaillée
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Points forts</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                <span>
                  <span className="font-medium">Service client</span> est votre sujet le plus positif (72% de sentiment
                  positif)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                <span>
                  <span className="font-medium">Instagram</span> est votre plateforme la plus favorable (70% de mentions
                  positives)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                <span>
                  Le lancement de votre <span className="font-medium">nouveau produit</span> a généré 220 mentions avec
                  un sentiment très positif
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Points d'attention</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-red-600"></span>
                <span>
                  <span className="font-medium">Livraison</span> reste votre point faible (38% de sentiment positif)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-red-600"></span>
                <span>
                  <span className="font-medium">Forums</span> contiennent le plus de critiques (30% de mentions
                  négatives)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
