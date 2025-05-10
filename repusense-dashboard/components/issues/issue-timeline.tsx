import { Badge } from "@/components/ui/badge"
import { Calendar, MessageSquare, TrendingDown, TrendingUp } from "lucide-react"

export function IssueTimeline() {
  const timelineEvents = [
    {
      date: "May 10, 2023",
      title: "Issue identified",
      description: "First detected through sentiment analysis of social media mentions",
      type: "detection",
      mentions: 45,
    },
    {
      date: "May 15, 2023",
      title: "Issue escalated to high priority",
      description: "Significant increase in negative mentions across multiple platforms",
      type: "escalation",
      mentions: 87,
    },
    {
      date: "May 20, 2023",
      title: "Root cause analysis completed",
      description: "Identified understaffing and inefficient processes as primary causes",
      type: "analysis",
      mentions: 124,
    },
    {
      date: "May 25, 2023",
      title: "Initial response plan implemented",
      description: "Added temporary staff and simplified ticket routing process",
      type: "action",
      mentions: 156,
    },
    {
      date: "June 10, 2023",
      title: "Mid-term evaluation",
      description: "Response time improved by 15%, but still below target",
      type: "evaluation",
      mentions: 203,
    },
    {
      date: "June 25, 2023",
      title: "Comprehensive solution deployed",
      description: "Implemented new CRM system with automation capabilities",
      type: "action",
      mentions: 267,
    },
    {
      date: "July 15, 2023",
      title: "Current status",
      description: "Response time improved by 40%, but issue remains active",
      type: "current",
      mentions: 342,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <p>
          Timeline showing the evolution of the issue from first detection to current status, including key milestones,
          actions taken, and changes in mention volume over time.
        </p>
      </div>

      <div className="relative border-l-2 border-muted pl-6 space-y-6">
        {timelineEvents.map((event, index) => (
          <div key={index} className="relative">
            <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-background border-2 border-primary"></div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{event.date}</span>
                <Badge
                  variant={
                    event.type === "detection"
                      ? "outline"
                      : event.type === "escalation"
                        ? "destructive"
                        : event.type === "action"
                          ? "secondary"
                          : "default"
                  }
                  className="text-xs"
                >
                  {event.type}
                </Badge>
              </div>
              <h3 className="text-sm font-medium">{event.title}</h3>
              <p className="text-sm text-muted-foreground">{event.description}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MessageSquare className="h-3 w-3" />
                <span>{event.mentions} mentions</span>
                {index > 0 &&
                  (event.mentions > timelineEvents[index - 1].mentions ? (
                    <TrendingUp className="h-3 w-3 text-red-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-green-500" />
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
