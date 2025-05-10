"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Treemap } from "recharts"
import { Slider } from "@/components/ui/slider"

// Données simulées pour l'analyse des sujets
const topicsData = [
  { topic: "Service client", count: 342, sentiment: 0.68, keywords: ["réactivité", "support", "assistance"] },
  { topic: "Qualité produit", count: 287, sentiment: 0.72, keywords: ["durabilité", "fiabilité", "performance"] },
  { topic: "Prix", count: 231, sentiment: 0.45, keywords: ["tarif", "coût", "abordable"] },
  { topic: "Livraison", count: 198, sentiment: 0.38, keywords: ["délai", "retard", "expédition"] },
  { topic: "Site web", count: 156, sentiment: 0.61, keywords: ["navigation", "ergonomie", "design"] },
  { topic: "Application mobile", count: 143, sentiment: 0.58, keywords: ["bug", "fonctionnalité", "interface"] },
  { topic: "Garantie", count: 98, sentiment: 0.52, keywords: ["conditions", "durée", "couverture"] },
  { topic: "Retours", count: 87, sentiment: 0.41, keywords: ["remboursement", "procédure", "délai"] },
  { topic: "Support technique", count: 76, sentiment: 0.63, keywords: ["dépannage", "réparation", "conseil"] },
  { topic: "Emballage", count: 64, sentiment: 0.76, keywords: ["protection", "écologique", "présentation"] },
]

// Données pour le treemap
const prepareTreemapData = (data: typeof topicsData) => {
  return {
    name: "Topics",
    children: data.map((item) => ({
      name: item.topic,
      size: item.count,
      sentiment: item.sentiment,
      keywords: item.keywords.join(", "),
    })),
  }
}

// Fonction pour obtenir une couleur basée sur le sentiment
const getSentimentColor = (sentiment: number) => {
  // Rouge pour négatif, bleu pour positif
  const r = Math.floor(255 * (1 - sentiment))
  const b = Math.floor(255 * sentiment)
  const g = 100 + Math.floor(50 * sentiment)
  return `rgb(${r}, ${g}, ${b})`
}

export default function EnhancedTopicsAnalysis() {
  const [timeRange, setTimeRange] = useState("30")
  const [minSentiment, setMinSentiment] = useState([0])

  // Filtrer les données en fonction du sentiment minimum
  const filteredTopics = topicsData.filter((topic) => topic.sentiment >= minSentiment[0])

  // Préparer les données pour le treemap
  const treemapData = prepareTreemapData(filteredTopics)

  // Personnaliser le tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-xs">Mentions: {data.size}</p>
          <p className="text-xs">Sentiment: {Math.round(data.sentiment * 100)}%</p>
          <p className="text-xs mt-1">Mots-clés: {data.keywords}</p>
        </div>
      )
    }
    return null
  }

  // Personnaliser le contenu des cellules du treemap
  const CustomTreemapContent = (props: any) => {
    const { x, y, width, height, name, size } = props

    // Ne pas afficher le texte si la cellule est trop petite
    if (width < 50 || height < 30) return null

    return (
      <g>
        <text
          x={x + width / 2}
          y={y + height / 2 - 5}
          textAnchor="middle"
          fill="#fff"
          fontSize={12}
          fontWeight="bold"
          strokeWidth={0.5}
          stroke="#000"
          paintOrder="stroke"
        >
          {name}
        </text>
        <text
          x={x + width / 2}
          y={y + height / 2 + 10}
          textAnchor="middle"
          fill="#fff"
          fontSize={10}
          strokeWidth={0.3}
          stroke="#000"
          paintOrder="stroke"
        >
          {size}
        </text>
      </g>
    )
  }

  return (
    <Card className="border-blue-100 dark:border-blue-900/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Analyse des Sujets</CardTitle>
          <CardDescription>Principaux sujets mentionnés et leur sentiment</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
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
        <Tabs defaultValue="treemap">
          <TabsList className="mb-4">
            <TabsTrigger value="treemap">Treemap</TabsTrigger>
            <TabsTrigger value="pie">Camembert</TabsTrigger>
            <TabsTrigger value="table">Tableau</TabsTrigger>
          </TabsList>

          <TabsContent value="treemap">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">Filtre de sentiment:</span>
                <Slider
                  value={minSentiment}
                  onValueChange={setMinSentiment}
                  max={1}
                  step={0.05}
                  className="w-[200px]"
                />
                <span className="text-xs font-medium">{Math.round(minSentiment[0] * 100)}%</span>
              </div>

              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                    data={treemapData.children}
                    dataKey="size"
                    ratio={4 / 3}
                    stroke="#fff"
                    content={<CustomTreemapContent />}
                  >
                    <Tooltip content={<CustomTooltip />} />
                    {treemapData.children.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getSentimentColor(entry.sentiment)} />
                    ))}
                  </Treemap>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center space-x-6">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-8 rounded-sm bg-gradient-to-r from-red-500 to-blue-500"></div>
                  <span className="text-xs">Sentiment (rouge = négatif, bleu = positif)</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-sm bg-gray-300"></div>
                  <span className="text-xs">Taille = nombre de mentions</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pie">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredTopics}
                    dataKey="count"
                    nameKey="topic"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {filteredTopics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getSentimentColor(entry.sentiment)} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} mentions`, props.payload.topic]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="table">
            <div className="max-h-[350px] overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-100 dark:border-blue-900/30">
                    <th className="pb-2 text-left text-sm font-medium">Sujet</th>
                    <th className="pb-2 text-right text-sm font-medium">Mentions</th>
                    <th className="pb-2 text-right text-sm font-medium">Sentiment</th>
                    <th className="pb-2 text-left text-sm font-medium">Mots-clés</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTopics.map((item, index) => (
                    <tr key={index} className="border-b border-blue-50 dark:border-blue-900/20">
                      <td className="py-2 text-sm">{item.topic}</td>
                      <td className="py-2 text-right text-sm">{item.count}</td>
                      <td className="py-2 text-right">
                        <div className="flex items-center justify-end">
                          <div className="h-2 w-16 rounded-full bg-gradient-to-r from-red-400 to-blue-500">
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
                      <td className="py-2 text-sm text-muted-foreground">{item.keywords.join(", ")}</td>
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
