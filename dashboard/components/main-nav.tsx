"use client"

import Link from "next/link"
import Image from "next/image"
import { useCompany } from "@/contexts/CompanyContext"

export function MainNav() {
  const { isCompanySelected } = useCompany()
  
  return (
    <>
      <Link 
        href="/" 
        className={`flex items-center gap-2 ${isCompanySelected ? 'font-semibold' : 'font-bold text-xl'}`}
      >
        <Image 
          src="/repusense-logo.png" 
          alt="RepuSense Logo" 
          width={isCompanySelected ? 96 : 28} 
          height={isCompanySelected ? 96 : 28}
          className="object-contain"
        />
      </Link>
    </>
  )
}
