import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Clock, Globe, MessageSquare } from "lucide-react"

export function DataSourcesList() {
  const dataSources = [
    {
      id: 1,
      name: "Reddit",
      type: "social",
      status: "active",
      lastCollection: "2 hours ago",
      mentions: 5423,
      icon: MessageSquare,
      active: true,
    },
    {
      id: 2,
      name: "News Sites",
      type: "news",
      status: "active",
      lastCollection: "6 hours ago",
      mentions: 2876,
      icon: Globe,
      active: false,
    }
  ]

  return (
    <div className="space-y-3">
      {dataSources.map((source) => (
        <Card
          key={source.id}
          className={`p-3 cursor-pointer hover:border-primary transition-colors ${
            source.active ? "border-primary bg-primary/5" : ""
          }`}
        >
          <div className="flex items-start gap-2">
            <source.icon
              className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                source.status === "active" ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <div className="space-y-1 w-full">
              <h3 className="font-medium text-sm">{source.name}</h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  {source.status === "active" ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : source.status === "pending" ? (
                    <Clock className="h-3 w-3 text-amber-500" />
                  ) : (
                    <Clock className="h-3 w-3 text-red-500" />
                  )}
                  <span>{source.status}</span>
                </div>
                <Badge variant="outline" className="text-[10px] px-1 h-4">
                  {source.type}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
