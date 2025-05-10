"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InfoIcon as InfoCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { keywordExtractionData } from "@/lib/data"

type WordCloudWord = {
  text: string
  value: number
  sentiment: number
  relevance: number
}

export default function WordCloud() {
  const [timeRange, setTimeRange] = useState("30")
  const [minRelevance, setMinRelevance] = useState("0.4")
  const [sortBy, setSortBy] = useState("frequency")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const filteredKeywords = keywordExtractionData
    .filter((kw) => kw.relevance >= Number.parseFloat(minRelevance))
    .sort((a, b) => {
      if (sortBy === "frequency") return b.count - a.count
      if (sortBy === "sentiment") return b.sentiment - a.sentiment
      if (sortBy === "relevance") return b.relevance - a.relevance
      return 0
    })
    .slice(0, 50)

  // Convert keywords to word cloud format
  const words: WordCloudWord[] = filteredKeywords.map((kw) => ({
    text: kw.keyword,
    value: kw.count,
    sentiment: kw.sentiment,
    relevance: kw.relevance,
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = "#f8fafc"
    ctx.fillRect(0, 0, width, height)

    // Parameters for the word cloud
    const centerX = width / 2
    const centerY = height / 2
    const maxFontSize = 48
    const minFontSize = 14
    const angleVariance = 0.5 // How much to vary the angles

    // Sort words by value for layout (largest first)
    const sortedWords = [...words].sort((a, b) => b.value - a.value)

    // Keep track of used areas to avoid overlapping
    const usedAreas: Array<{ x: number; y: number; width: number; height: number }> = []

    // Function to check if a new word overlaps with existing words
    const checkOverlap = (x: number, y: number, width: number, height: number) => {
      for (const area of usedAreas) {
        if (x < area.x + area.width && x + width > area.x && y < area.y + area.height && y + height > area.y) {
          return true // Overlap detected
        }
      }
      return false // No overlap
    }

    // Draw each word
    sortedWords.forEach((word, index) => {
      // Calculate font size based on word value
      const fontSize = Math.max(
        minFontSize,
        Math.min(maxFontSize, minFontSize + (word.value / sortedWords[0].value) * (maxFontSize - minFontSize)),
      )

      // Set font
      ctx.font = `${fontSize}px Arial`

      // Calculate word dimensions
      const metrics = ctx.measureText(word.text)
      const wordWidth = metrics.width
      const wordHeight = fontSize

      // Get color based on sentiment
      const r = Math.floor(255 * (1 - word.sentiment))
      const b = Math.floor(255 * word.sentiment)
      const g = 100
      const color = `rgb(${r}, ${g}, ${b})`

      // Attempt to place the word
      let placed = false
      let attempts = 0
      let x = 0
      let y = 0
      let radius = 10
      const maxAttempts = 2000

      while (!placed && attempts < maxAttempts) {
        // Spiral outward from center
        const angle = attempts * 0.1 + (Math.random() * angleVariance - angleVariance / 2)
        radius += 0.5

        x = centerX + Math.cos(angle) * radius - wordWidth / 2
        y = centerY + Math.sin(angle) * radius + wordHeight / 4

        // Check boundaries
        if (
          x >= 0 &&
          y >= 0 &&
          x + wordWidth <= width &&
          y + wordHeight <= height &&
          !checkOverlap(x - 2, y - wordHeight, wordWidth + 4, wordHeight + 4)
        ) {
          placed = true
        }

        attempts++
      }

      if (placed) {
        // Draw the word
        ctx.fillStyle = color
        ctx.fillText(word.text, x, y)

        // Add to used areas
        usedAreas.push({
          x: x - 2,
          y: y - wordHeight,
          width: wordWidth + 4,
          height: wordHeight + 4,
        })
      }
    })
  }, [words, sortBy, minRelevance])

  return (
    <Card className="border-blue-100 dark:border-blue-900/30">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <CardTitle>Nuage de mots-clés</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="max-w-xs">
                    Visualisation des mots-clés les plus fréquents dans les mentions. Taille = fréquence, couleur =
                    sentiment (rouge = négatif, bleu = positif).
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>Les termes les plus fréquents dans les mentions</CardDescription>
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
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Tri" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="frequency">Fréquence</SelectItem>
              <SelectItem value="sentiment">Sentiment</SelectItem>
              <SelectItem value="relevance">Pertinence</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cloud">
          <TabsList className="mb-4">
            <TabsTrigger value="cloud">Nuage</TabsTrigger>
            <TabsTrigger value="list">Liste</TabsTrigger>
          </TabsList>
          <TabsContent value="cloud" className="h-[400px] relative">
            <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
            <div className="absolute bottom-2 right-2 flex items-center bg-white/80 dark:bg-gray-800/80 p-1 rounded text-xs">
              <div className="h-2 w-6 bg-gradient-to-r from-red-500 to-blue-500 rounded mr-2"></div>
              <span>Sentiment (rouge = négatif, bleu = positif)</span>
            </div>
          </TabsContent>
          <TabsContent value="list">
            <div className="max-h-[400px] overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Mot-clé</th>
                    <th className="pb-2 font-medium text-right">Fréquence</th>
                    <th className="pb-2 font-medium text-right">Sentiment</th>
                    <th className="pb-2 font-medium text-right">Pertinence</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredKeywords.map((keyword, index) => (
                    <tr key={index} className="border-b border-blue-50 dark:border-blue-900/20">
                      <td className="py-2">{keyword.keyword}</td>
                      <td className="py-2 text-right">{keyword.count}</td>
                      <td className="py-2 text-right">
                        <div className="flex items-center justify-end">
                          <div className="h-2 w-16 rounded-full bg-gradient-to-r from-red-400 to-blue-500">
                            <div
                              className="h-3 w-3 translate-y-[-2px] rounded-full bg-white border border-gray-300"
                              style={{
                                marginLeft: `calc(${keyword.sentiment * 100}% - 6px)`,
                              }}
                            />
                          </div>
                          <span className="ml-2 text-xs">{(keyword.sentiment * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="py-2 text-right">{(keyword.relevance * 100).toFixed(0)}%</td>
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
