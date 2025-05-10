"use client"
import { Treemap, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  {
    name: "Customer Service",
    size: 1200,
    sentiment: -0.6,
    children: [
      { name: "Response Time", size: 500, sentiment: -0.8 },
      { name: "Resolution Quality", size: 400, sentiment: -0.5 },
      { name: "Staff Knowledge", size: 300, sentiment: -0.4 },
    ],
  },
  {
    name: "Product Quality",
    size: 1000,
    sentiment: 0.2,
    children: [
      { name: "Durability", size: 400, sentiment: 0.5 },
      { name: "Performance", size: 350, sentiment: 0.3 },
      { name: "Design", size: 250, sentiment: -0.2 },
    ],
  },
  {
    name: "Pricing",
    size: 800,
    sentiment: -0.3,
    children: [
      { name: "Value for Money", size: 400, sentiment: -0.4 },
      { name: "Subscription Model", size: 250, sentiment: -0.6 },
      { name: "Discounts", size: 150, sentiment: 0.5 },
    ],
  },
  {
    name: "Website Experience",
    size: 600,
    sentiment: -0.1,
    children: [
      { name: "Navigation", size: 250, sentiment: -0.3 },
      { name: "Checkout Process", size: 200, sentiment: -0.4 },
      { name: "Mobile Compatibility", size: 150, sentiment: 0.6 },
    ],
  },
  {
    name: "Delivery",
    size: 500,
    sentiment: -0.7,
    children: [
      { name: "Shipping Speed", size: 250, sentiment: -0.8 },
      { name: "Packaging", size: 150, sentiment: -0.2 },
      { name: "Tracking", size: 100, sentiment: -0.6 },
    ],
  },
]

const COLORS = ["#ef4444", "#f97316", "#a3a3a3", "#22c55e", "#10b981"]

const getSentimentColor = (sentiment) => {
  if (sentiment <= -0.6) return "#ef4444" // Very negative
  if (sentiment <= -0.2) return "#f97316" // Negative
  if (sentiment <= 0.2) return "#a3a3a3" // Neutral
  if (sentiment <= 0.6) return "#22c55e" // Positive
  return "#10b981" // Very positive
}

const CustomizedContent = (props) => {
  const { root, depth, x, y, width, height, index, name, sentiment, size } = props

  const color = getSentimentColor(sentiment)

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: color,
          stroke: "#fff",
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {width > 50 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={12}
          fontWeight={depth === 1 ? "bold" : "normal"}
        >
          {name}
        </text>
      )}
    </g>
  )
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-background p-3 border rounded-md shadow-md">
        <p className="font-bold">{data.name}</p>
        <p>Mentions: {data.size}</p>
        <p>Sentiment: {data.sentiment.toFixed(2)}</p>
      </div>
    )
  }
  return null
}

export function TopicClusterMap() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="size"
          aspectRatio={4 / 3}
          stroke="#fff"
          fill="#8884d8"
          content={<CustomizedContent />}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  )
}
