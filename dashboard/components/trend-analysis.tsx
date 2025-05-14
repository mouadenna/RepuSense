"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", sentiment: 7.2, mentions: 950, problems: 4 },
  { month: "Feb", sentiment: 7.5, mentions: 1050, problems: 3 },
  { month: "Mar", sentiment: 7.3, mentions: 1200, problems: 5 },
  { month: "Apr", sentiment: 7.0, mentions: 1350, problems: 6 },
  { month: "May", sentiment: 6.8, mentions: 1500, problems: 7 },
  { month: "Jun", sentiment: 6.5, mentions: 1650, problems: 8 },
  { month: "Jul", sentiment: 6.3, mentions: 1800, problems: 9 },
  { month: "Aug", sentiment: 6.8, mentions: 1950, problems: 7 },
  { month: "Sep", sentiment: 7.0, mentions: 2100, problems: 6 },
  { month: "Oct", sentiment: 7.2, mentions: 2250, problems: 5 },
  { month: "Nov", sentiment: 7.4, mentions: 2400, problems: 4 },
  { month: "Dec", sentiment: 7.6, mentions: 2550, problems: 3 },
]

export function TrendAnalysis() {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
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
          <Tooltip contentStyle={{ borderRadius: "8px" }} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="sentiment"
            stroke="#10b981"
            activeDot={{ r: 8 }}
            name="Sentiment Score"
          />
          <Line yAxisId="right" type="monotone" dataKey="mentions" stroke="#3b82f6" name="Total Mentions" />
          <Line yAxisId="left" type="monotone" dataKey="problems" stroke="#ef4444" name="Active Problems" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
