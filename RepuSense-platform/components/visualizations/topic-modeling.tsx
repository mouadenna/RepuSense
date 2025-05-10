"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InfoIcon as InfoCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { topicModelingData } from "@/lib/data"
import { ResponsiveContainer, Treemap, Tooltip as RechartsTooltip, Cell, PieChart, Pie, Legend } from "recharts"

// Function to get color based on sentiment
const getSentimentColor = (sentiment: number) => {
  // Rouge pour négatif, bleu pour positif
  const r = Math.floor(255 * (1 - sentiment))
  const b = Math.floor(255 * sentiment)
  const g = 100 + Math.floor(50 * sentiment)
  return `rgb(${r}, ${g}, ${b})`
}

// Prepare data for treemap
const prepareTreemapData = (data = topicModelingData) => {
  return {
    name: "Topics",
    children: data.map((item) => ({
      name: item.topic,
      size: item.count,
      sentiment: item.sentiment,
      keywords: item.keywords?.join(", "),
      children: item.subtopics?.map((subtopic) => ({
        name: subtopic.name,
        size: subtopic.count,
        sentiment: item.sentiment, // Using parent sentiment for now
      })),
    })),
  }
}

export default function TopicModeling() {
  const [timeRange, setTimeRange] = useState("30")
  const [topicsView, setTopicsView] = useState("treemap") // treemap, piechart, hierarchy
  const [treemapData, setTreemapData] = useState(prepareTreemapData())

  // Custom treemap content renderer
  const CustomTreemapContent = ({ x, y, width, height, name, depth, index }: any) => {
    if (width < 50 || height < 30) return null

    // Root node has depth 0, main topics are depth 1, subtopics are depth 2
    const fontSize = depth === 1 ? 14 : 12
    const fontWeight = depth === 1 ? "bold" : "normal"

    return (
      <g>
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize={fontSize}
          fontWeight={fontWeight}
          strokeWidth={0.5}
          stroke="#000"
          paintOrder="stroke"
          dominantBaseline="middle"
        >
          {name}
        </text>
      </g>
    )
  }

  // Custom tooltip for the treemap
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-md max-w-xs">
          <p className="font-medium mb-1">{data.name}</p>
          <p className="text-xs">Mentions: {data.size}</p>
          {data.sentiment !== undefined && <p className="text-xs">Sentiment: {Math.round(data.sentiment * 100)}%</p>}
          {data.keywords && <p className="text-xs mt-1">Mots-clés: {data.keywords}</p>}
        </div>
      )
    }
    return null
  }

  // Prepare data for pie chart
  const pieChartData = topicModelingData.map((topic) => ({
    name: topic.topic,
    value: topic.count,
    sentiment: topic.sentiment,
    keywords: topic.keywords?.join(", "),
  }))

  // Render hierarchical view
  const renderHierarchyView = () => {
    return (
      <div className="max-h-[400px] overflow-auto">
        {topicModelingData.map((topic, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center mb-2">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: getSentimentColor(topic.sentiment) }}
              ></div>
              <h4 className="font-medium text-base">{topic.topic}</h4>
              <span className="text-sm ml-2 text-muted-foreground">({topic.count} mentions)</span>
            </div>

            <div className="ml-5 border-l border-gray-200 dark:border-gray-700 pl-4">
              <div className="text-sm mb-2">
                <strong>Mots-clés:</strong> {topic.keywords?.join(", ")}
              </div>

              <div className="text-sm mb-2">
                <strong>Sous-sujets:</strong>
              </div>

              <ul className="space-y-1 text-sm">
                {topic.subtopics?.map((subtopic, idx) => (
                  <li key={idx} className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2 bg-gray-300"></div>
                    {subtopic.name} ({subtopic.count} mentions)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="border-blue-100 dark:border-blue-900/30">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <CardTitle>Modélisation des sujets</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="max-w-xs">
                    Visualisation hiérarchique des sujets principaux et de leurs sous-sujets identifiés dans les
                    mentions. Les couleurs représentent le sentiment associé à chaque sujet.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>Organisation des sujets et sous-sujets des mentions</CardDescription>
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
          <Select value={topicsView} onValueChange={setTopicsView}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Tri" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="treemap">Treemap</SelectItem>
              <SelectItem value="piechart">Camembert</SelectItem>
              <SelectItem value="hierarchy">Hiérarchie</SelectItem>
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
            {topicsView === "treemap" && (
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={treemapData.children}
                  dataKey="size"
                  ratio={4 / 3}
                  stroke="#fff"
                  content={<CustomTreemapContent />}
                >
                  <RechartsTooltip content={<CustomTooltip />} />
                  {treemapData.children.map((entry, index) => {
                    if (!entry.children) return null
                    return entry.children.map((child, childIndex) => (
                      <Cell key={`cell-${index}-${childIndex}`} fill={getSentimentColor(child.sentiment)} />
                    ))
                  })}
                </Treemap>
              </ResponsiveContainer>
            )}

            {topicsView === "piechart" && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getSentimentColor(entry.sentiment)} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}

            {topicsView === "hierarchy" && renderHierarchyView()}
          </TabsContent>
          <TabsContent value="table">
            <div className="max-h-[400px] overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Sujet</th>
                    <th className="pb-2 font-medium text-right">Mentions</th>
                    <th className="pb-2 font-medium text-right">Sentiment</th>
                    <th className="pb-2 font-medium">Mots-clés</th>
                  </tr>
                </thead>
                <tbody>
                  {topicModelingData.map((topic, index) => (
                    <tr key={index} className="border-b border-blue-50 dark:border-blue-900/20">
                      <td className="py-2 font-medium">{topic.topic}</td>
                      <td className="py-2 text-right">{topic.count}</td>
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
                      <td className="py-2 text-sm">{topic.keywords?.join(", ")}</td>
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
