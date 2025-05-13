"use client"

import { useState, useEffect } from "react"
import { Calendar, Database, Layers, MessageSquare } from "lucide-react"
import { apiService } from "@/lib/api"
import { useCompany } from "@/contexts/CompanyContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface DataSource {
  name: string
  post_count: number
  comment_count: number
  sentiment_distribution: {
    positive: number
    neutral: number
    negative: number
  }
  last_updated: string
}

export function DataSources() {
  const { selectedCompany } = useCompany()
  const [dataSources, setDataSources] = useState<DataSource[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDataSources() {
      if (!selectedCompany) return

      setIsLoading(true)

      try {
        const data = await apiService.getCompanyDataSources(selectedCompany)
        if (data) {
          setDataSources(data)
        } else {
          setDataSources([])
        }
      } catch (error) {
        console.error("Error fetching data sources:", error)
        setDataSources([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchDataSources()
  }, [selectedCompany])

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Data Sources Analysis</h3>
      
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading data sources...</div>
        </div>
      ) : dataSources.length === 0 ? (
        <div className="flex h-40 items-center justify-center">
          <div className="text-sm text-muted-foreground">No data sources available</div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dataSources.map((source, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-md font-medium">{source.name}</CardTitle>
                  <CardDescription>
                    Updated {formatDate(source.last_updated)}
                  </CardDescription>
                </div>
                <Database className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Posts:</span>
                    </div>
                    <span className="font-medium">{source.post_count.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Comments:</span>
                    </div>
                    <span className="font-medium">{source.comment_count.toLocaleString()}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-sm">Sentiment Distribution:</span>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                        Positive: {source.sentiment_distribution.positive}%
                      </Badge>
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-100">
                        Neutral: {source.sentiment_distribution.neutral}%
                      </Badge>
                      <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100">
                        Negative: {source.sentiment_distribution.negative}%
                      </Badge>
                    </div>
                    <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div 
                        className="bg-green-500 h-full" 
                        style={{ width: `${source.sentiment_distribution.positive}%` }}
                      />
                      <div 
                        className="bg-slate-400 h-full" 
                        style={{ width: `${source.sentiment_distribution.neutral}%` }}
                      />
                      <div 
                        className="bg-red-500 h-full" 
                        style={{ width: `${source.sentiment_distribution.negative}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 