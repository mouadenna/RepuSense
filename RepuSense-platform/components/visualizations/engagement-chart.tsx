"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InfoIcon as InfoCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { mockMentions } from "@/lib/data"
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ZAxis,
  BarChart,
  Bar,
  Legend,
  Cell,
} from "recharts"

// Function to get color based on sentiment
const getSentimentColor = (sentiment: number) => {
  // Rouge pour négatif, bleu pour positif
  const r = Math.floor(255 * (1 - sentiment))
  const b = Math.floor(255 * sentiment)
  const g = 100 + Math.floor(50 * sentiment)
  return `rgb(${r}, ${g}, ${b})`
}

// Generate engagement data
const engagementData = mockMentions.map((mention) => ({
  author: mention.author,
  sentiment: mention.sentimentScore || 0.5,
  engagement: mention.engagementIndex || 0,
  content: mention.content,
  upvotes: mention.upvotes || 0,
  comments: mention.comments || 0,
  platform: mention.platform || "unknown",
  topic: mention.topic,
}))

// Group by engagement level
const groupedEngagementData = [
  { name: "Très élevé (80-100)", value: engagementData.filter((d) => d.engagement >= 80).length },
  { name: "Élevé (60-79)", value: engagementData.filter((d) => d.engagement >= 60 && d.engagement < 80).length },
  { name: "Moyen (40-59)", value: engagementData.filter((d) => d.engagement >= 40 && d.engagement < 60).length },
  { name: "Faible (20-39)", value: engagementData.filter((d) => d.engagement >= 20 && d.engagement < 40).length },
  { name: "Très faible (0-19)", value: engagementData.filter((d) => d.engagement < 20).length },
]

export default function EngagementChart() {
  const [timeRange, setTimeRange] = useState("30")
  const [chartType, setChartType] = useState("scatter")

  // Custom tooltip for the scatter chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-md max-w-xs">
          <p className="font-medium">{data.author}</p>
          <p className="text-xs">Engagement: {data.engagement}</p>
          <p className="text-xs">Sentiment: {Math.round(data.sentiment * 100)}%</p>
          <p className="text-xs">Upvotes: {data.upvotes}</p>
          <p className="text-xs">Comments: {data.comments}</p>
          <p className="text-xs">Topic: {data.topic}</p>
          <p className="text-xs mt-1 line-clamp-2">{data.content}</p>
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
            <CardTitle>Indice d'engagement des commentaires</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="max-w-xs">
                    Visualisation de l'engagement des mentions en fonction du sentiment. L'indice d'engagement est
                    calculé à partir des upvotes, commentaires et partages.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>Analyse de l'engagement en fonction du sentiment des mentions</CardDescription>
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
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scatter">Nuage</SelectItem>
              <SelectItem value="bar">Barres</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="visualization">
          <TabsList className="mb-4">
            <TabsTrigger value="visualization">Visualisation</TabsTrigger>
            <TabsTrigger value="table">Tableau</TabsTrigger>
          </TabsList>
          <TabsContent value="visualization" className="h-[400px]">
            {chartType === "scatter" && (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    type="number"
                    dataKey="sentiment"
                    domain={[0, 1]}
                    name="Sentiment"
                    unit=""
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    label={{ value: "Sentiment", position: "insideBottom", offset: -10 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="engagement"
                    name="Engagement"
                    label={{ value: "Engagement", angle: -90, position: "insideLeft" }}
                  />
                  <ZAxis type="number" dataKey="upvotes" range={[60, 400]} name="Upvotes" />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Scatter
                    name="Mentions"
                    data={engagementData}
                    fill="#8884d8"
                    shape={(props) => {
                      const { cx, cy, r, fill } = props
                      const sentiment = props.payload.sentiment

                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={r}
                          fill={getSentimentColor(sentiment)}
                          stroke="#fff"
                          strokeWidth={1}
                        />
                      )
                    }}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            )}

            {chartType === "bar" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={groupedEngagementData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="value" name="Nombre de mentions">
                    {groupedEngagementData.map((entry, index) => {
                      // Colors from red to blue
                      const colors = ["#ef4444", "#f87171", "#94a3b8", "#60a5fa", "#3b82f6"]
                      return <Cell key={`cell-${index}`} fill={colors[index]} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </TabsContent>

          <TabsContent value="table">
            <div className="max-h-[400px] overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Auteur</th>
                    <th className="pb-2 font-medium text-right">Engagement</th>
                    <th className="pb-2 font-medium text-right">Sentiment</th>
                    <th className="pb-2 font-medium">Plateforme</th>
                    <th className="pb-2 font-medium">Sujet</th>
                  </tr>
                </thead>
                <tbody>
                  {engagementData.map((item, index) => (
                    <tr key={index} className="border-b border-blue-50 dark:border-blue-900/20">
                      <td className="py-2">{item.author}</td>
                      <td className="py-2 text-right">{item.engagement}</td>
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
                      <td className="py-2">{item.platform}</td>
                      <td className="py-2">{item.topic}</td>
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
