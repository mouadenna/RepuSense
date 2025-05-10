import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Check, Clock, Download } from "lucide-react"

export function ImplementationPlan() {
  const phases = [
    {
      id: 1,
      title: "Phase 1: Immediate Improvements",
      description: "Quick wins that can be implemented within 1-2 weeks",
      status: "in-progress",
      progress: 65,
      startDate: "Aug 1, 2023",
      endDate: "Aug 15, 2023",
      tasks: [
        {
          id: 101,
          title: "Hire 5 temporary customer service representatives",
          status: "completed",
          assignee: "HR Team",
        },
        {
          id: 102,
          title: "Create standardized response templates for common issues",
          status: "completed",
          assignee: "Content Team",
        },
        {
          id: 103,
          title: "Implement basic ticket prioritization rules",
          status: "in-progress",
          assignee: "IT Team",
        },
        {
          id: 104,
          title: "Conduct emergency training session for all CS staff",
          status: "pending",
          assignee: "Training Team",
        },
      ],
    },
    {
      id: 2,
      title: "Phase 2: Process Optimization",
      description: "Streamline workflows and improve efficiency within 1 month",
      status: "pending",
      progress: 0,
      startDate: "Aug 16, 2023",
      endDate: "Sep 15, 2023",
      tasks: [
        {
          id: 201,
          title: "Redesign customer service workflow",
          status: "pending",
          assignee: "Operations Team",
        },
        {
          id: 202,
          title: "Implement automated ticket routing system",
          status: "pending",
          assignee: "IT Team",
        },
        {
          id: 203,
          title: "Create comprehensive knowledge base for CS team",
          status: "pending",
          assignee: "Knowledge Management",
        },
        {
          id: 204,
          title: "Establish new SLAs for different ticket priorities",
          status: "pending",
          assignee: "Management Team",
        },
      ],
    },
    {
      id: 3,
      title: "Phase 3: Technology Implementation",
      description: "Deploy advanced solutions within 2-3 months",
      status: "pending",
      progress: 0,
      startDate: "Sep 16, 2023",
      endDate: "Nov 30, 2023",
      tasks: [
        {
          id: 301,
          title: "Select and implement new CRM system",
          status: "pending",
          assignee: "IT Team",
        },
        {
          id: 302,
          title: "Develop and deploy AI chatbot for common inquiries",
          status: "pending",
          assignee: "Development Team",
        },
        {
          id: 303,
          title: "Integrate customer service platform with other systems",
          status: "pending",
          assignee: "Integration Team",
        },
        {
          id: 304,
          title: "Implement real-time analytics dashboard",
          status: "pending",
          assignee: "Analytics Team",
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <p>
          A phased implementation plan to improve customer service response time. This plan breaks down the
          recommendation into manageable phases with specific tasks, timelines, and responsible parties.
        </p>
      </div>

      <div className="space-y-6">
        {phases.map((phase) => (
          <Card key={phase.id}>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{phase.title}</h3>
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                  </div>
                  <Badge
                    variant={
                      phase.status === "completed"
                        ? "default"
                        : phase.status === "in-progress"
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {phase.status}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span>{phase.progress}%</span>
                  </div>
                  <Progress value={phase.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {phase.startDate} - {phase.endDate}
                    </span>
                  </div>
                  <div>{phase.tasks.length} tasks</div>
                </div>

                <Separator />

                <div className="space-y-2">
                  {phase.tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        {task.status === "completed" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : task.status === "in-progress" ? (
                          <Clock className="h-4 w-4 text-amber-500" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-muted" />
                        )}
                        <span
                          className={`text-sm ${
                            task.status === "completed" ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {task.assignee}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" size="sm" className="gap-1">
          <Download className="h-4 w-4 mr-1" />
          Export Plan
        </Button>
        <Button size="sm">Update Progress</Button>
      </div>
    </div>
  )
}
