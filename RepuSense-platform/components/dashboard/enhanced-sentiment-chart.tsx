"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts"

// Simuler des données de sentiment sur une période
const generateSentimentData = (days: number) => {
  const data = []
  const today = new Date()

  // Générer une tendance de base avec quelques fluctuations
  let positiveTrend = 55 // Commencer à 55%
  let negativeTrend = 15 // Commencer à 15%

  for (let i = days; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Ajouter une variation aléatoire mais maintenir une tendance
    const positiveVariation = Math.random() * 6 - 2 // -2 à +4
    const negativeVariation = Math.random() * 4 - 2 // -2 à +2

    // Ajuster les tendances
    positiveTrend = Math.max(40, Math.min(70, positiveTrend + positiveVariation * 0.5))
    negativeTrend = Math.max(5, Math.min(30, negativeTrend + negativeVariation * 0.5))

    // Calculer le neutre comme le reste
    const neutralTrend = 100 - positiveTrend - negativeTrend

    // Ajouter des événements spéciaux pour certains jours
    let event = null
    let volume = Math.floor(Math.random() * 50) + 100 // Volume de base entre 100-150

    // Simuler un pic de volume et une baisse de sentiment pour un événement négatif
    if (i === Math.floor(days * 0.7)) {
      positiveTrend -= 15
      negativeTrend += 20
      volume = 250
      event = "Crise produit"
    }

    // Simuler un pic positif pour un lancement de produit
    if (i === Math.floor(days * 0.3)) {
      positiveTrend += 15
      negativeTrend -= 5
      volume = 220
      event = "Lancement produit"
    }

    // S'assurer que les pourcentages sont valides
    const positive = Math.round(positiveTrend)
    const negative = Math.round(negativeTrend)
    const neutral = 100 - positive - negative

    data.push({
      date: date.toISOString().split("T")[0],
      positive,
      neutral,
      negative,
      volume,
      event,
    })
  }

  return data
}

// Générer des données pour les sources
const generateSourceData = () => {
  return [
    { name: "Twitter", positive: 62, neutral: 28, negative: 10 },
    { name: "Facebook", positive: 48, neutral: 32, negative: 20 },
    { name: "Instagram", positive: 70, neutral: 20, negative: 10 },
    { name: "YouTube", positive: 55, neutral: 30, negative: 15 },
    { name: "Blogs", positive: 40, neutral: 35, negative: 25 },
    { name: "Forums", positive: 30, neutral: 40, negative: 30 },
    { name: "Avis", positive: 50, neutral: 25, negative: 25 },
  ]
}

export default function EnhancedSentimentChart() {
  const [period, setPeriod] = useState("30")
  const [data, setData] = useState(() => generateSentimentData(30))
  const [sourceData] = useState(() => generateSourceData())

  useEffect(() => {
    setData(generateSentimentData(Number.parseInt(period)))
  }, [period])

  // Formater la date pour l'affichage dans le tooltip
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    }).format(date)
  }

  // Personnaliser le tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
          <p className="font-medium">{formatDate(label)}</p>
          {dataPoint.event && (
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">Événement: {dataPoint.event}</p>
          )}
          <div className="flex flex-col space-y-1">
            <p className="text-xs">
              <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Positif: {dataPoint.positive}%
            </p>
            <p className="text-xs">
              <span className="inline-block w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
              Neutre: {dataPoint.neutral}%
            </p>
            <p className="text-xs">
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              Négatif: {dataPoint.negative}%
            </p>
            <p className="text-xs mt-1 pt-1 border-t border-gray-200 dark:border-gray-700">
              Volume: {dataPoint.volume} mentions
            </p>
          </div>
        </div>
      )
    }
    return null
  }

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
        <Tabs defaultValue="timeline">
          <TabsList className="mb-4">
            <TabsTrigger value="timeline">Chronologie</TabsTrigger>
            <TabsTrigger value="stacked">Empilé</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="summary">Résumé</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tickFormatter={formatDate} stroke="#888888" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#888888" fontSize={12} tickFormatter={(value) => `${value}%`} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#888888"
                    fontSize={12}
                    domain={[0, "dataMax + 50"]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="positive"
                    name="Positif"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="neutral"
                    name="Neutre"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="negative"
                    name="Négatif"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                  <Bar yAxisId="right" dataKey="volume" name="Volume" fill="#cbd5e1" opacity={0.3} barSize={20} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="stacked">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }} stackOffset="expand">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tickFormatter={formatDate} stroke="#888888" fontSize={12} />
                  <YAxis tickFormatter={(value) => `${Math.round(value * 100)}%`} stroke="#888888" fontSize={12} />
                  <Tooltip formatter={(value) => [`${value}%`, ""]} />
                  <Legend />
                  <Bar dataKey="positive" name="Positif" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="neutral" name="Neutre" stackId="a" fill="#94a3b8" />
                  <Bar dataKey="negative" name="Négatif" stackId="a" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="sources">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#888888" fontSize={12} tickFormatter={(value) => `${value}%`} />
                  <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} width={80} />
                  <Tooltip formatter={(value) => [`${value}%`, ""]} />
                  <Legend />
                  <Bar dataKey="positive" name="Positif" fill="#3b82f6" stackId="a" />
                  <Bar dataKey="neutral" name="Neutre" fill="#94a3b8" stackId="a" />
                  <Bar dataKey="negative" name="Négatif" fill="#ef4444" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
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
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
                  <h5 className="text-sm font-medium text-blue-700 dark:text-blue-300">Événements clés</h5>
                  <ul className="mt-1 text-xs space-y-1">
                    <li className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      <span className="font-medium">15 avril</span>: Lancement produit (impact positif +15%)
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      <span className="font-medium">2 avril</span>: Crise produit (impact négatif -12%)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
