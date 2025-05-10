"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  AlertCircle,
  BarChart3,
  FileText,
  LayoutDashboard,
  Lightbulb,
  MessageSquare,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react"

export function SideNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Issue Analyzer",
      href: "/issues",
      icon: AlertCircle,
    },
    {
      name: "Recommendations",
      href: "/recommendations",
      icon: Lightbulb,
    },
    {
      name: "Data Sources",
      href: "/data-management",
      icon: MessageSquare,
    },
    {
      name: "Reports",
      href: "/reports",
      icon: FileText,
    },
    {
      name: "Competitors",
      href: "/competitors",
      icon: Users,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      name: "Trends",
      href: "/trends",
      icon: TrendingUp,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  return (
    <aside className="hidden w-[250px] flex-col border-r bg-muted/40 md:flex">
      <nav className="grid gap-2 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              isActive(item.href) ? "bg-primary/10 text-primary" : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
