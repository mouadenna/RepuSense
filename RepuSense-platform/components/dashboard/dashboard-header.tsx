"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, HelpCircle, Menu, Settings, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navigation = [
  { name: "Vue d'ensemble", href: "/dashboard" },
  { name: "Mentions", href: "/mentions" },
  { name: "Tendances", href: "/analyses" },
  { name: "Sources", href: "/sources" },
  { name: "Rapports", href: "/rapports" },
]

export default function DashboardHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    router.push("/auth/login")
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <TooltipProvider delayDuration={300}>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/95 backdrop-blur-sm border-b shadow-sm" : "bg-background border-b"
        }`}
      >
        <div className="max-w-[1920px] mx-auto">
          <div className="grid h-16 grid-cols-3 items-center px-4 md:px-6">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-105">
                  <span className="text-lg font-bold text-white">RS</span>
                </div>
                <span className="hidden font-semibold text-foreground/90 transition-colors duration-200 group-hover:text-foreground md:inline-block">
                  RepuSense
                </span>
              </Link>

              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="hover:bg-muted/80 transition-colors">
                    <Menu className="h-5 w-5 transition-transform duration-200" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <SheetHeader className="border-b p-4">
                    <SheetTitle className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-blue-600">
                        <span className="text-lg font-bold text-white">RS</span>
                      </div>
                      <span className="font-semibold">RepuSense</span>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-1 p-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                          isActive(item.href)
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                        {isActive(item.href) && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600 animate-in fade-in zoom-in" />
                        )}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex justify-center">
              <nav className="hidden md:flex md:gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group relative flex h-10 items-center gap-2 rounded-md px-4 text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span>{item.name}</span>
                    {isActive(item.href) && (
                      <span className="absolute bottom-0 left-0 right-0 mx-auto h-0.5 w-2/3 rounded-full bg-blue-600 animate-in fade-in slide-in-from-bottom-1 duration-300" />
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-1 justify-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-muted/80 transition-all duration-200"
                  >
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs animate-pulse">3</Badge>
                    <span className="sr-only">Notifications</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" asChild className="hover:bg-muted/80 transition-all duration-200">
                    <Link href="/settings">
                      <Settings className="h-5 w-5" />
                      <span className="sr-only">Paramètres</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Paramètres</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" asChild className="hover:bg-muted/80 transition-all duration-200">
                    <Link href="/help">
                      <HelpCircle className="h-5 w-5" />
                      <span className="sr-only">Aide</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Aide</p>
                </TooltipContent>
              </Tooltip>

              <ModeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-muted/80 transition-all duration-200 ml-1"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-background transition-all duration-300 hover:ring-offset-2 hover:ring-offset-background">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        ME
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 animate-in fade-in-80 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:zoom-out-95"
                >
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                    <Link href="/profile">
                      <User className="h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                    <Link href="/settings">
                      <Settings className="h-4 w-4" />
                      <span>Paramètres</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 dark:text-red-400 gap-2 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}
