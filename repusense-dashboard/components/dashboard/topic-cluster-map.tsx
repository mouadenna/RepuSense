"use client"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

const getSentimentColor = (sentiment) => {
  if (sentiment <= -0.6) return "#ef4444" // Very negative
  if (sentiment <= -0.2) return "#f97316" // Negative
  if (sentiment <= 0.2) return "#a3a3a3" // Neutral
  if (sentiment <= 0.6) return "#22c55e" // Positive
  return "#10b981" // Very positive
}

// Custom implementation of a treemap visualization
export function TopicClusterMap() {
  // Flatten the data to include all items (parents and children)
  const flattenedData = data.flatMap((category) => [
    { ...category, isParent: true },
    ...category.children.map((child) => ({ ...child, parent: category.name, isParent: false })),
  ])

  // Calculate total size for scaling
  const totalSize = flattenedData.reduce((sum, item) => sum + item.size, 0)

  // Calculate positions and sizes
  const processedData = []
  let currentX = 0
  let currentY = 0
  const containerWidth = 100 // percentage

  // First pass: parent categories
  data.forEach((category) => {
    const width = (category.size / totalSize) * containerWidth
    const height = 30 // fixed height for parent categories

    processedData.push({
      ...category,
      x: currentX,
      y: currentY,
      width,
      height,
      isParent: true,
    })

    currentX += width
  })

  currentY += 30 // Move to next row after parent categories
  currentX = 0

  // Second pass: child items, grouped by parent
  data.forEach((category) => {
    const categoryWidth = (category.size / totalSize) * containerWidth
    const childrenStartX = currentX
    let localCurrentX = childrenStartX
    let localCurrentY = currentY
    let maxRowHeight = 0

    // Calculate sizes for children
    category.children.forEach((child) => {
      const childWidth = (child.size / category.size) * categoryWidth

      // If this child would exceed the category width, move to next row
      if (localCurrentX + childWidth > childrenStartX + categoryWidth) {
        localCurrentX = childrenStartX
        localCurrentY += maxRowHeight
        maxRowHeight = 0
      }

      // Calculate height based on size
      const childHeight = Math.max(30, (child.size / 500) * 60)
      maxRowHeight = Math.max(maxRowHeight, childHeight)

      processedData.push({
        ...child,
        parent: category.name,
        x: localCurrentX,
        y: localCurrentY,
        width: childWidth,
        height: childHeight,
        isParent: false,
      })

      localCurrentX += childWidth
    })

    currentX += categoryWidth
  })

  return (
    <div className="h-[300px] w-full relative">
      <TooltipProvider>
        <div className="w-full h-full relative">
          {processedData.map((item, index) => {
            const color = getSentimentColor(item.sentiment)

            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div
                    className="absolute border border-white transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}px`,
                      width: `${item.width}%`,
                      height: `${item.height}px`,
                      backgroundColor: color,
                    }}
                  >
                    {(item.width > 10 || item.isParent) && (
                      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium truncate p-1">
                        {item.name}
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="p-2">
                    <p className="font-bold">{item.name}</p>
                    <p>Mentions: {item.size}</p>
                    <p>Sentiment: {item.sentiment.toFixed(2)}</p>
                    {item.parent && <p>Category: {item.parent}</p>}
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </TooltipProvider>
    </div>
  )
}
