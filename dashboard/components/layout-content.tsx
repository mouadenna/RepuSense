"use client"

import React from "react"
import { MainNav } from "@/components/main-nav"
import { SideNav } from "@/components/side-nav"
import { UserNav } from "@/components/user-nav"
import { useCompany } from "@/contexts/CompanyContext"

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isCompanySelected } = useCompany()
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className={`sticky top-0 z-30 flex h-20 items-center gap-4 ${isCompanySelected ? 'border-b bg-background px-6' : 'px-6'}`}>
        <MainNav />
        <div className="ml-auto flex items-center gap-4">
          <UserNav />
        </div>
      </header>
      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 overflow-auto md:pl-[250px]">{children}</main>
      </div>
    </div>
  )
}

// Also provide a default export
export default LayoutContent; 