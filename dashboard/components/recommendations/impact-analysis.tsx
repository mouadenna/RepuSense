"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

export function ImpactAnalysis() {
  const beforeAfterData = [
    {
      name: "Response Time",
      before: 24,
      after: 6,
      unit: "hours",
    },
    {
      name: "Customer Satisfaction",
      before: 65,
      after: 85,
      unit: "%",
    },
    {
      name: "Negative Mentions",
      before: 342,
      after: 120,
      unit: "count",
    },
    {
      name: "Churn Rate",
      before: 5.2,
      after: 3.1,
      unit: "%",
    },
    {
      name: "Repeat Purchases",
      before: 45,
      after: 62,
      unit: "%",
    },
  ]

  const timelineData = [
    { month: "Month 1", sentiment: 6.5, responseTime: 24 },
    { month: "Month 2", sentiment: 6.8, responseTime: 18 },
    { month: "Month 3", sentiment: 7.2, responseTime: 12 },
    { month: "Month 4", sentiment: 7.6, responseTime: 8 },
    { month: "Month 5", sentiment: 7.9, responseTime: 6 },
    { month: "Month 6", sentiment: 8.2, responseTime: 6 },
  ]

  const costBenefitData = [
    {
      name: "Implementation Cost",
      value: 75000,
      description: "One-time costs for technology, training, and process changes",
    },
    {
      name: "Ongoing Monthly Cost",
      value: 15000,
      description: "Additional staff, software licenses, and maintenance",
    },
    {
      name: "Monthly Revenue Increase",
      value: 45000,
      description: "Estimated from reduced churn and increased repeat purchases",
    },
    {
      name: "ROI Timeline",
      value: "4 months",
      description: "Expected time to recoup initial investment",
    },
    {
      name: "1-Year Net Benefit",
      value: 285000,
      description: "Total financial benefit after costs over 12 months",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <p>
          Impact analysis showing the expected benefits of implementing the recommendation to improve customer service
          response time. This analysis includes before/after comparisons, projected timeline, and cost-benefit analysis.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">Before vs. After Implementation</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={beforeAfterData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name, props) => {
                      return [`${value} ${props.payload.unit}`, name === "before" ? "Before" : "After"]
                    }}
                  />
                  <Legend />
                  <Bar name="Before" dataKey="before" fill="#ef4444" />
                  <Bar name="After" dataKey="after" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">Implementation Timeline Impact</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={timelineData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="sentiment"
                    name="Sentiment Score"
                    stroke="#10b981"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="responseTime"
                    name="Response Time (hours)"
                    stroke="#ef4444"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">Cost-Benefit Analysis</h3>
            <div className="space-y-4">
              {costBenefitData.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.name}</span>
                    <span className={`font-bold ${index === 4 ? "text-green-500" : ""}`}>
                      {typeof item.value === "number" ? `$${item.value.toLocaleString()}` : item.value}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  {index < costBenefitData.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
