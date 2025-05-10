"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Simuler des données de sentiment sur une période
const generateSentimentData = (days: number) => {
  const data = []
  const today = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split("T")[0],
      positive: Math.floor(Math.random() * 30) + 40, // 40-70%
      neutral: Math.floor(Math.random() * 20) + 10, // 10-30%
      negative: Math.floor(Math.random() * 20) + 10, // 10-30%
    })
  }

  return data
}

export default function SentimentChart() {
  const [period, setPeriod] = useState("30")
  const [data, setData] = useState(() => generateSentimentData(30))
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setData(generateSentimentData(Number.parseInt(period)))
  }, [period])

  useEffect(() => {
    if (!canvasRef.current) return

    // Simuler un graphique avec un canvas
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const width = canvasRef.current.width
    const height = canvasRef.current.height

    // Effacer le canvas
    ctx.clearRect(0, 0, width, height)

    // Dessiner l'arrière-plan
    ctx.fillStyle = "rgba(0, 0, 0, 0.03)"
    ctx.fillRect(0, 0, width, height)

    // Dessiner les lignes de grille
    ctx.strokeStyle = "rgba(59, 130, 246, 0.1)" // Bleu clair pour les grilles
    ctx.lineWidth = 1

    // Lignes horizontales
    for (let i = 0; i <= 5; i++) {
      const y = height - (i * height) / 5
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Dessiner les données
    const barWidth = (width / data.length) * 0.8
    const gap = (width / data.length) * 0.2

    data.forEach((item, index) => {
      const x = index * (barWidth + gap) + gap / 2
      const totalHeight = height * 0.9

      // Positif (bleu)
      const positiveHeight = (item.positive / 100) * totalHeight
      ctx.fillStyle = "rgba(59, 130, 246, 0.7)" // Bleu pour positif
      ctx.fillRect(x, height - positiveHeight, barWidth, positiveHeight)

      // Neutre (gris)
      const neutralHeight = (item.neutral / 100) * totalHeight
      ctx.fillStyle = "rgba(100, 116, 139, 0.7)"
      ctx.fillRect(x, height - positiveHeight - neutralHeight, barWidth, neutralHeight)

      // Négatif (rouge)
      const negativeHeight = (item.negative / 100) * totalHeight
      ctx.fillStyle = "rgba(239, 68, 68, 0.7)"
      ctx.fillRect(x, height - positiveHeight - neutralHeight - negativeHeight, barWidth, negativeHeight)
    })
  }, [data])

  return (
    <Card className="border-blue-100 dark:border-blue-900/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Analyse de Sentiment</CardTitle>
          <CardDescription>Évolution du sentiment au fil du temps</CardDescription>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 jours</SelectItem>
            <SelectItem value="30">30 jours</SelectItem>
            <SelectItem value="90">90 jours</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart">
          <TabsList className="mb-4">
            <TabsTrigger value="chart">Graphique</TabsTrigger>
            <TabsTrigger value="summary">Résumé</TabsTrigger>
          </TabsList>
          <TabsContent value="chart" className="space-y-4">
            <div className="h-[300px] w-full chart-area">
              <canvas ref={canvasRef} width={800} height={300} className="h-full w-full" />
            </div>
            <div className="flex justify-center space-x-4">
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-xs">Positif</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-slate-500"></div>
                <span className="text-xs">Neutre</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-xs">Négatif</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="summary">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/50">
                  <div className="text-xs text-muted-foreground">Sentiment positif</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">64.8%</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">+2.4% vs période précédente</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                  <div className="text-xs text-muted-foreground">Sentiment neutre</div>
                  <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">21.3%</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">-1.1% vs période précédente</div>
                </div>
                <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950/50">
                  <div className="text-xs text-muted-foreground">Sentiment négatif</div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">13.9%</div>
                  <div className="text-xs text-red-600 dark:text-red-400">-1.3% vs période précédente</div>
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium">Analyse</h4>
                <p className="text-sm text-muted-foreground">
                  Le sentiment global est en amélioration avec une augmentation de 2.4% des mentions positives. Les
                  mentions négatives ont diminué de 1.3%, principalement grâce aux améliorations apportées au service
                  client et à la résolution rapide des problèmes signalés sur les réseaux sociaux.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
