import { Metadata } from "next"
import { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Issue Analyzer | RepuSense",
  description: "Comprehensive problem analysis and diagnostics",
}

export default function IssuesLayout({ children }: { children: ReactNode }) {
  return children
} 