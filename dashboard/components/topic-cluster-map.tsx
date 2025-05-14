"use client"
import { Treemap, ResponsiveContainer, Tooltip, TooltipProps } from "recharts"

interface TreemapData {
  name: string
  size: number
  sentiment: number
  children?: TreemapData[]
}

interface CustomizedContentProps {
  root?: any
  depth?: number
  x?: number
  y?: number
  width?: number
  height?: number
  index?: number
  name?: string
  sentiment?: number
  size?: number
}

const data: TreemapData[] = [
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

const getSentimentColor = (sentiment: number) => {
  if (sentiment <= -0.6) return "#ef4444" // Very negative
  if (sentiment <= -0.2) return "#f97316" // Negative
  if (sentiment <= 0.2) return "#a3a3a3" // Neutral
  if (sentiment <= 0.6) return "#22c55e" // Positive
  return "#10b981" // Very positive
}

const CustomizedContent = (props: CustomizedContentProps) => {
  const { root, depth, x, y, width, height, index, name, sentiment, size } = props

  const color = getSentimentColor(sentiment || 0)

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
          strokeWidth: 2 / ((depth || 0) + 1e-10),
          strokeOpacity: 1 / ((depth || 0) + 1e-10),
        }}
      />
      {width && height && width > 50 && height > 30 && (
        <text
          x={x && width ? x + width / 2 : 0}
          y={y && height ? y + height / 2 : 0}
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

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{payload: TreemapData}>
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
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
    <div className="h-full w-full min-h-[700px]">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="size"
          aspectRatio={16 / 9}
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
