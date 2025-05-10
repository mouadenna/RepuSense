"use client"

import type { Mention } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThumbsDown, ThumbsUp, MessageSquare, Share, Facebook, Twitter, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MentionCardProps {
  mention: Mention
}

export default function MentionCard({ mention }: MentionCardProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Get source icon
  const getSourceIcon = (source: string) => {
    switch (source) {
      case "twitter":
        return <Twitter className="h-4 w-4 text-blue-500" />
      case "facebook":
        return <Facebook className="h-4 w-4 text-blue-600" />
      case "reddit":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-orange-600"
          >
            <circle cx="12" cy="8" r="5" />
            <path d="M20 20a8 8 0 1 0-16 0" />
            <path d="M12 14v7" />
          </svg>
        )
      default:
        return <MessageSquare className="h-4 w-4 text-blue-500" />
    }
  }

  // Format numbers with K, M suffix
  const formatNumber = (num: number | undefined) => {
    if (!num) return "0"
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  // Get engagement level text and color
  const getEngagementLevel = (score: number | undefined) => {
    if (!score) return { text: "Faible", color: "text-gray-500" }
    if (score >= 80) return { text: "Très élevé", color: "text-blue-600 dark:text-blue-400" }
    if (score >= 60) return { text: "Élevé", color: "text-blue-500" }
    if (score >= 40) return { text: "Moyen", color: "text-blue-400" }
    if (score >= 20) return { text: "Faible", color: "text-gray-500" }
    return { text: "Très faible", color: "text-gray-400" }
  }

  const engagementLevel = getEngagementLevel(mention.engagementIndex)

  return (
    <div className="rounded-lg border p-4 transition-all hover:border-blue-200 hover:bg-blue-50/30 dark:hover:border-blue-800 dark:hover:bg-blue-900/10">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            {mention.author.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <h4 className="font-medium">{mention.author}</h4>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{formatDate(mention.date)}</span>
                <span className="mx-1">•</span>
                <span className="flex items-center gap-1">
                  <span className="flex h-4 w-4 items-center justify-center">{getSourceIcon(mention.source)}</span>
                  {mention.platform || mention.source}
                </span>
              </div>
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Marquer comme traité</DropdownMenuItem>
                  <DropdownMenuItem>Assigner</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Voir l'original</DropdownMenuItem>
                  <DropdownMenuItem>Exporter</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Masquer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <p className="mt-2 text-sm">{mention.content}</p>

          <div className="mt-3">
            <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-muted-foreground">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {formatNumber(mention.upvotes)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upvotes</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center gap-1">
                      <ThumbsDown className="h-3 w-3" />
                      {formatNumber(mention.downvotes)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Downvotes</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {formatNumber(mention.comments)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Commentaires</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center gap-1">
                      <Share className="h-3 w-3" />
                      {formatNumber(mention.shares)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Partages</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {mention.url && (
                <a
                  href={mention.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 ml-auto"
                >
                  Voir l'original
                </a>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    mention.sentiment === "positive"
                      ? "default"
                      : mention.sentiment === "negative"
                        ? "destructive"
                        : "secondary"
                  }
                  className={mention.sentiment === "positive" ? "bg-emerald-500" : ""}
                >
                  {mention.sentiment === "positive" ? (
                    <ThumbsUp className="mr-1 h-3 w-3" />
                  ) : mention.sentiment === "negative" ? (
                    <ThumbsDown className="mr-1 h-3 w-3" />
                  ) : null}
                  {mention.sentimentScore
                    ? `${(mention.sentimentScore * 100).toFixed(0)}%`
                    : mention.sentiment.charAt(0).toUpperCase() + mention.sentiment.slice(1)}
                </Badge>

                <Badge variant="outline" className="text-xs">
                  {mention.topic}
                </Badge>

                <Badge variant="outline" className={`${engagementLevel.color} border-current bg-transparent`}>
                  <div className="mr-1 relative w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-current"
                      style={{ width: `${mention.engagementIndex || 0}%` }}
                    ></div>
                  </div>
                  Engagement: {mention.engagementIndex || 0}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Répondre
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  Assigner
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
