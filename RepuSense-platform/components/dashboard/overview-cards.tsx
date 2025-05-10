"use client"

import { ArrowDown, ArrowUp, BarChart3, MessageSquare, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  {
    title: "Score de réputation",
    value: "72/100",
    description: "Augmentation de 3 points",
    trend: "up",
    trendValue: "+4.3%",
    icon: <BarChart3 className="h-4 w-4 text-blue-500" />,
  },
  {
    title: "Mentions totales",
    value: "1,482",
    description: "Derniers 30 jours",
    trend: "up",
    trendValue: "+12.2%",
    icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
  },
  {
    title: "Sentiment positif",
    value: "64.8%",
    description: "Augmentation de 2.4%",
    trend: "up",
    trendValue: "+2.4%",
    icon: <TrendingUp className="h-4 w-4 text-blue-500" />,
  },
  {
    title: "Portée estimée",
    value: "245K",
    description: "Baisse de 3.1%",
    trend: "down",
    trendValue: "-3.1%",
    icon: <Users className="h-4 w-4 text-blue-500" />,
  },
]

export default function OverviewCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="stat-card border-blue-100 dark:border-blue-900/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-2">
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <div className={`flex items-center text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {stat.trend === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                <span>{stat.trendValue}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
