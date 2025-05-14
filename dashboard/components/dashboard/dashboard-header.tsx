"use client";

import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { useCompany } from "@/contexts/CompanyContext"

export function DashboardHeader() {
  const { selectedCompany } = useCompany();
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {selectedCompany ? `${selectedCompany} Analysis Dashboard` : "Analysis Dashboard"}
        </h1>
        <p className="text-muted-foreground">Comprehensive e-reputation analysis and actionable insights</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden md:flex">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button size="sm">Generate Report</Button>
      </div>
    </div>
  )
}
