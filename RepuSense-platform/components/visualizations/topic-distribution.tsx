"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InfoIcon as InfoCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { topicModelingData } from "@/lib/data"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Cell,
  LabelList,
  PieChart,
  Pie,
  Legend,
} from "recharts"

// Function to get color based on sentiment
const getSentimentColor = (sentiment: number) => {
  // Rouge pour négatif, bleu pour positif
  const r = Math.floor(255 * (1 - sentiment))
  const b = Math.floor(255 * sentiment)
  const g = 100 + Math.floor(50 * sentiment)
  return `rgb(${r}, ${g}, ${b})`
}

export default function TopicDistribution() {
  const [timeRange, setTimeRange] = useState("30")
  const [displayType, setDisplayType] = useState("horizontal")

  // Sort topics by count for better visualization
  const sortedTopics = [...topicModelingData].sort((a, b) => b.count - a.count)

  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
          <p className="font-medium mb-1">{data.topic}</p>
          <p className="text-xs">Mentions: {data.count}</p>
          <p className="text-xs">Sentiment: {Math.round(data.sentiment * 100)}%</p>
          {data.keywords && <p className="text-xs mt-1">Mots-clés: {data.keywords.join(", ")}</p>}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="border-blue-100 dark:border-blue-900/30">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <CardTitle>Distribution des sujets</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="max-w-xs">
                    Visualisation de la distribution des sujets principaux dans les mentions. Les couleurs représentent
                    le sentiment associé à chaque sujet.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>Répartition des mentions par sujet principal</CardDescription>
        </div>
        <div className="flex space-x-2">
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
          <Select value={displayType} onValueChange={setDisplayType}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Affichage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="horizontal">Horizontal</SelectItem>
              <SelectItem value="vertical">Vertical</SelectItem>
              <SelectItem value="pie">Camembert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart">
          <TabsList className="mb-4">
            <TabsTrigger value="chart">Graphique</TabsTrigger>
            <TabsTrigger value="table">Tableau</TabsTrigger>
          </TabsList>
          <TabsContent value="chart" className="h-[400px]">
            {(displayType === "horizontal" || displayType === "vertical") && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sortedTopics}
                  layout={displayType === "horizontal" ? "vertical" : "horizontal"}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  {displayType === "horizontal" ? (
                    <>
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="topic" width={120} />
                    </>
                  ) : (
                    <>
                      <XAxis type="category" dataKey="topic" />
                      <YAxis type="number" />
                    </>
                  )}
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Mentions">
                    {sortedTopics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getSentimentColor(entry.sentiment)} />
                    ))}
                    <LabelList
                      dataKey="count"
                      position={displayType === "horizontal" ? "right" : "top"}
                      style={{ fill: "#666", fontSize: 12 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            {displayType === "pie" && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sortedTopics}
                    dataKey="count"
                    nameKey="topic"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {sortedTopics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getSentimentColor(entry.sentiment)} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </TabsContent>

          <TabsContent value="table">
            <div className="max-h-[400px] overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Sujet</th>
                    <th className="pb-2 font-medium text-right">Mentions</th>
                    <th className="pb-2 font-medium text-right">%</th>
                    <th className="pb-2 font-medium text-right">Sentiment</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTopics.map((topic, index) => {
                    const totalMentions = sortedTopics.reduce((sum, t) => sum + t.count, 0)
                    const percentage = ((topic.count / totalMentions) * 100).toFixed(1)

                    return (
                      <tr key={index} className="border-b border-blue-50 dark:border-blue-900/20">
                        <td className="py-2">{topic.topic}</td>
                        <td className="py-2 text-right">{topic.count}</td>
                        <td className="py-2 text-right">{percentage}%</td>
                        <td className="py-2 text-right">
                          <div className="flex items-center justify-end">
                            <div className="h-2 w-16 rounded-full bg-gradient-to-r from-red-400 to-blue-500">
                              <div
                                className="h-3 w-3 translate-y-[-2px] rounded-full bg-white border border-gray-300"
                                style={{
                                  marginLeft: `calc(${topic.sentiment * 100}% - 6px)`,
                                }}
                              />
                            </div>
                            <span className="ml-2 text-xs">{(topic.sentiment * 100).toFixed(0)}%</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
