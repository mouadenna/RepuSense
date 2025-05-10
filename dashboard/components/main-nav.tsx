import Link from "next/link"
import { BarChart3 } from "lucide-react"

export function MainNav() {
  return (
    <>
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <BarChart3 className="h-6 w-6 text-primary" />
        <span>RepuSense</span>
      </Link>

    </>
  )
}
