"use client"

import { ArrowDown, ArrowUp, BarChart3, MessageSquare, TrendingUp, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const kpis = [
  {
    title: "Score de réputation",
    value: "72",
    change: "+4.3%",
    trend: "up",
    description: "Score global basé sur le volume et le sentiment des mentions",
    icon: <BarChart3 className="h-5 w-5 text-blue-600" />,
    color: "bg-blue-50 dark:bg-blue-950/50",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  {
    title: "Mentions",
    value: "1,482",
    change: "+12.2%",
    trend: "up",
    description: "Nombre total de mentions sur les 30 derniers jours",
    icon: <MessageSquare className="h-5 w-5 text-indigo-600" />,
    color: "bg-indigo-50 dark:bg-indigo-950/50",
    textColor: "text-indigo-700 dark:text-indigo-300",
  },
  {
    title: "Sentiment positif",
    value: "64.8%",
    change: "+2.4%",
    trend: "up",
    description: "Pourcentage de mentions avec un sentiment positif",
    icon: <TrendingUp className="h-5 w-5 text-emerald-600" />,
    color: "bg-emerald-50 dark:bg-emerald-950/50",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
  {
    title: "Portée",
    value: "245K",
    change: "-3.1%",
    trend: "down",
    description: "Audience potentielle touchée par les mentions",
    icon: <Users className="h-5 w-5 text-violet-600" />,
    color: "bg-violet-50 dark:bg-violet-950/50",
    textColor: "text-violet-700 dark:text-violet-300",
  },
]

export default function KpiCards() {
  return (
    <TooltipProvider>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Card
                className={`overflow-hidden border-t-4 ${
                  kpi.trend === "up" ? "border-t-emerald-500" : "border-t-red-500"
                } transition-all hover:shadow-md`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`rounded-full p-2 ${kpi.color}`}>{kpi.icon}</div>
                    <div
                      className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                        kpi.trend === "up"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                      }`}
                    >
                      {kpi.trend === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {kpi.change}
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className="text-sm font-medium text-muted-foreground">{kpi.title}</h3>
                    <p className={`text-2xl font-bold ${kpi.textColor}`}>{kpi.value}</p>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p>{kpi.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
