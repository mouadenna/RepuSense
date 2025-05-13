import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { MainNav } from "@/components/main-nav"
import { SideNav } from "@/components/side-nav"
import { UserNav } from "@/components/user-nav"
import { CompanyProvider } from "@/contexts/CompanyContext"
import LayoutContent from "@/components/layout-content"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RepuSense: Data-Driven E-Reputation Analysis",
  description: "Comprehensive e-reputation analysis and recommendation platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light">
          <CompanyProvider>
            <LayoutContent>{children}</LayoutContent>
          <Toaster />
          </CompanyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
