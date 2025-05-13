import { Metadata } from "next"
import { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Recommendations | RepuSense",
  description: "Strategic recommendations to improve your e-reputation",
}

export default function RecommendationsLayout({ children }: { children: ReactNode }) {
  return children
} 