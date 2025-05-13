"use client"

import Link from "next/link"
import { BarChart3 } from "lucide-react"
import { useCompany } from "@/contexts/CompanyContext"

export function MainNav() {
  const { isCompanySelected } = useCompany()
  
  return (
    <>
      <Link 
        href="/" 
        className={`flex items-center gap-2 ${isCompanySelected ? 'font-semibold' : 'font-bold text-xl'}`}
      >
        <BarChart3 className={`${isCompanySelected ? 'h-6 w-6' : 'h-7 w-7'} text-primary`} />
        <span>RepuSense</span>
      </Link>
    </>
  )
}
