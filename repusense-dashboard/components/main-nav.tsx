import Link from "next/link"
import { BarChart3 } from "lucide-react"

export function MainNav() {
  return (
    <>
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <BarChart3 className="h-6 w-6 text-primary" />
        <span>RepuSense</span>
      </Link>
      <nav className="hidden flex-1 md:flex">
        <ul className="flex gap-4 px-4">
          <li>
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/issues" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Issue Analyzer
            </Link>
          </li>
          <li>
            <Link href="/recommendations" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Recommendations
            </Link>
          </li>
          <li>
            <Link href="/data-management" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Data Management
            </Link>
          </li>
          <li>
            <Link href="/reports" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Reports
            </Link>
          </li>
        </ul>
      </nav>
    </>
  )
}
