"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { InfoIcon } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Données simulées pour les tendances de sentiment
const generateSentimentData = () => {
  const data = []
  const today = new Date()

  for (let i = 30; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Créer une tendance avec des fluctuations
    const positive = Math.max(40, Math.min(70, 55 + Math.sin(i / 5) * 10 + (Math.random() * 5 - 2.5)))
    const negative = Math.max(5, Math.min(30, 15 - Math.sin(i / 5) * 5 + (Math.random() * 4 - 2)))
    const neutral = 100 - positive - negative

    data.push({
      date: date.toISOString().split("T")[0],
      positive: Math.round(positive),
      neutral: Math.round(neutral),
      negative: Math.round(negative),
      total: Math.floor(Math.random() * 50) + 30, // Nombre de mentions par jour
    })
  }

  return data
}

// Données pour les sources
const sourceData = [
  { name: "Twitter", value: 35, sentiment: 0.65 },
  { name: "Facebook", value: 25, sentiment: 0.58 },
  { name: "Instagram", value: 15, sentiment: 0.72 },
  { name: "YouTube", value: 10, sentiment: 0.61 },
  { name: "Blogs", value: 8, sentiment: 0.48 },
  { name: "Forums", value: 7, sentiment: 0.42 },
]

// Données pour les sujets
const topicData = [
  { name: "Service client", positive: 68, neutral: 22, negative: 10 },
  { name: "Qualité produit", positive: 72, neutral: 18, negative: 10 },
  { name: "Prix", positive: 45, neutral: 30, negative: 25 },
  { name: "Livraison", positive: 38, neutral: 32, negative: 30 },
  { name: "Site web", positive: 61, neutral: 29, negative: 10 },
]

export default function SentimentTrends() {
  const [period, setPeriod] = useState("30j")
  const [sentimentData] = useState(generateSentimentData)

  // Formater la date pour l'affichage
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
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <p className="mb-1 font-medium">{formatDate(label)}</p>
          <div className="space-y-1">
            <p className="flex items-center text-xs">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-500"></span>
              Positif: {payload[0].value}%
            </p>
            <p className="flex items-center text-xs">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-gray-400"></span>
              Neutre: {payload[1].value}%
            </p>
            <p className="flex items-center text-xs">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-red-500"></span>
              Négatif: {payload[2].value}%
            </p>
            <p className="mt-1 border-t pt-1 text-xs">Total: {payload[3].payload.total} mentions</p>
          </div>
        </div>
      )
    }
    return null
  }

  // Obtenir la couleur en fonction du sentiment
  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 0.65) return "#3b82f6" // Bleu pour très positif
    if (sentiment >= 0.5) return "#60a5fa" // Bleu clair pour positif
    if (sentiment >= 0.4) return "#94a3b8" // Gris pour neutre
    if (sentiment >= 0.25) return "#f87171" // Rouge clair pour négatif
    return "#ef4444" // Rouge pour très négatif
  }

  return (
    <Card className="border-blue-100 dark:border-blue-900/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle>Tendances du sentiment</CardTitle>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    Cette visualisation montre l'évolution du sentiment des mentions de votre marque au fil du temps,
                    réparti entre positif, neutre et négatif.
                  </p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <CardDescription>Évolution du sentiment des mentions au fil du temps</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={period === "7j" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setPeriod("7j")}
            className="h-8 text-xs"
          >
            7 jours
          </Button>
          <Button
            variant={period === "30j" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setPeriod("30j")}
            className="h-8 text-xs"
          >
            30 jours
          </Button>
          <Button
            variant={period === "90j" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setPeriod("90j")}
            className="h-8 text-xs"
          >
            90 jours
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="evolution">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="evolution">Évolution</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="topics">Sujets</TabsTrigger>
          </TabsList>

          <TabsContent value="evolution" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sentimentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorNeutral" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="positive"
                  stackId="1"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorPositive)"
                />
                <Area
                  type="monotone"
                  dataKey="neutral"
                  stackId="1"
                  stroke="#94a3b8"
                  fillOpacity={1}
                  fill="url(#colorNeutral)"
                />
                <Area
                  type="monotone"
                  dataKey="negative"
                  stackId="1"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorNegative)"
                />
                <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} dot={false} yAxisId={1} />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="sources" className="h-[350px]">
            <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getSentimentColor(entry.sentiment)} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${value}% des mentions`,
                        `${name} (Sentiment: ${(props.payload.sentiment * 100).toFixed(0)}%)`,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col justify-center">
                <h3 className="mb-4 text-sm font-medium">Répartition par source</h3>
                <div className="space-y-3">
                  {sourceData.map((source, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{source.name}</span>
                        <span className="text-sm font-medium">{source.value}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${source.value}%`, backgroundColor: getSentimentColor(source.sentiment) }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-md bg-blue-50 p-3 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                  <p>
                    <span className="font-medium">Insight:</span> Instagram présente le sentiment le plus positif (72%),
                    tandis que les forums ont le sentiment le plus négatif (42%).
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="topics" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} layout="vertical" margin={{ top: 10, right: 10, left: 100, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  width={100}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${value}%`,
                    name === "positive" ? "Positif" : name === "neutral" ? "Neutre" : "Négatif",
                  ]}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => (value === "positive" ? "Positif" : value === "neutral" ? "Neutre" : "Négatif")}
                />
                <Bar dataKey="positive" stackId="a" fill="#3b82f6" name="positive" />
                <Bar dataKey="neutral" stackId="a" fill="#94a3b8" name="neutral" />
                <Bar dataKey="negative" stackId="a" fill="#ef4444" name="negative" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
