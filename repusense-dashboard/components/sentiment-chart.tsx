"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const data = [
  { sentiment: "Very Negative", count: 245, percentage: 8, color: "#ef4444" },
  { sentiment: "Negative", count: 678, percentage: 22, color: "#f97316" },
  { sentiment: "Neutral", count: 1245, percentage: 40, color: "#a3a3a3" },
  { sentiment: "Positive", count: 567, percentage: 18, color: "#22c55e" },
  { sentiment: "Very Positive", count: 367, percentage: 12, color: "#10b981" },
]

export function SentimentChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="sentiment" />
          <YAxis />
          <Tooltip
            formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, "Count"]}
            contentStyle={{ borderRadius: "8px" }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
