"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Données simulées pour l'analyse des sujets
const topicsData = [
  { topic: "Service client", count: 342, sentiment: 0.68 },
  { topic: "Qualité produit", count: 287, sentiment: 0.72 },
  { topic: "Prix", count: 231, sentiment: 0.45 },
  { topic: "Livraison", count: 198, sentiment: 0.38 },
  { topic: "Site web", count: 156, sentiment: 0.61 },
  { topic: "Application mobile", count: 143, sentiment: 0.58 },
  { topic: "Garantie", count: 98, sentiment: 0.52 },
  { topic: "Retours", count: 87, sentiment: 0.41 },
  { topic: "Support technique", count: 76, sentiment: 0.63 },
  { topic: "Emballage", count: 64, sentiment: 0.76 },
]

export default function TopicsAnalysis() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const width = canvasRef.current.width
    const height = canvasRef.current.height

    // Effacer le canvas
    ctx.clearRect(0, 0, width, height)

    // Dessiner l'arrière-plan
    ctx.fillStyle = "rgba(0, 0, 0, 0.03)"
    ctx.fillRect(0, 0, width, height)

    // Calculer la taille maximale pour les cercles
    const maxCount = Math.max(...topicsData.map((item) => item.count))
    const maxRadius = Math.min(width, height) * 0.15

    // Dessiner les cercles pour chaque sujet
    topicsData.slice(0, 8).forEach((item, index) => {
      // Calculer la position
      const angle = (index / 8) * Math.PI * 2
      const distance = width * 0.3
      const x = width / 2 + Math.cos(angle) * distance
      const y = height / 2 + Math.sin(angle) * distance

      // Calculer la taille en fonction du nombre de mentions
      const radius = (item.count / maxCount) * maxRadius

      // Calculer la couleur en fonction du sentiment (bleu pour positif)
      const b = Math.floor(255 * item.sentiment)
      const r = Math.floor(255 * (1 - item.sentiment))
      const g = 100 + Math.floor(50 * item.sentiment)

      // Dessiner le cercle
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.7)`
      ctx.fill()

      // Ajouter le texte
      ctx.fillStyle = "#000"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(item.topic, x, y + radius + 15)
      ctx.font = "10px sans-serif"
      ctx.fillText(`${item.count} mentions`, x, y + radius + 30)
    })
  }, [])

  return (
    <Card className="border-blue-100 dark:border-blue-900/30">
      <CardHeader>
        <CardTitle>Analyse des Sujets</CardTitle>
        <CardDescription>Principaux sujets mentionnés et leur sentiment</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="visualization">
          <TabsList className="mb-4">
            <TabsTrigger value="visualization">Visualisation</TabsTrigger>
            <TabsTrigger value="table">Tableau</TabsTrigger>
          </TabsList>
          <TabsContent value="visualization">
            <div className="h-[300px] w-full chart-area">
              <canvas ref={canvasRef} width={600} height={300} className="h-full w-full" />
            </div>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              La taille représente le volume de mentions et la couleur le sentiment (bleu = positif, rouge = négatif)
            </div>
          </TabsContent>
          <TabsContent value="table">
            <div className="max-h-[300px] overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-100 dark:border-blue-900/30">
                    <th className="pb-2 text-left text-sm font-medium">Sujet</th>
                    <th className="pb-2 text-right text-sm font-medium">Mentions</th>
                    <th className="pb-2 text-right text-sm font-medium">Sentiment</th>
                  </tr>
                </thead>
                <tbody>
                  {topicsData.map((item, index) => (
                    <tr key={index} className="border-b border-blue-50 dark:border-blue-900/20">
                      <td className="py-2 text-sm">{item.topic}</td>
                      <td className="py-2 text-right text-sm">{item.count}</td>
                      <td className="py-2 text-right">
                        <div className="flex items-center justify-end">
                          <div
                            className="h-2 w-16 rounded-full bg-gray-200"
                            style={{
                              background: `linear-gradient(to right, #ef4444, #3b82f6)`,
                            }}
                          >
                            <div
                              className="h-3 w-3 translate-y-[-2px] rounded-full bg-white border border-gray-300"
                              style={{
                                marginLeft: `calc(${item.sentiment * 100}% - 6px)`,
                              }}
                            />
                          </div>
                          <span className="ml-2 text-xs">{(item.sentiment * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
