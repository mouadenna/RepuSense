"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types pour les mentions
interface Mention {
  id: string
  author: string
  authorHandle?: string
  authorAvatar?: string
  content: string
  date: string
  source: "twitter" | "facebook" | "instagram" | "youtube" | "blog" | "forum" | "review"
  sentiment: "positive" | "neutral" | "negative"
  reach: number
  topic: string
  isInfluencer?: boolean
}

// Données simulées
const mentionsData: Mention[] = [
  {
    id: "m1",
    author: "Tech Expert",
    authorHandle: "@TechExpert",
    authorAvatar: "",
    content:
      "Déçu par le service client de @VotreEntreprise. 3 jours pour répondre à un email et toujours pas de solution à mon problème. #ServiceClient #Déception",
    date: "2023-05-04T09:15:00",
    source: "twitter",
    sentiment: "negative",
    reach: 450000,
    topic: "Service client",
    isInfluencer: true,
  },
  {
    id: "m2",
    author: "Marie Dupont",
    authorHandle: "@MarieDupont",
    authorAvatar: "",
    content:
      "Je viens de recevoir mon colis de @VotreEntreprise et je suis impressionnée par la qualité du produit! Exactement ce que j'attendais. #Satisfaite",
    date: "2023-05-03T14:30:00",
    source: "twitter",
    sentiment: "positive",
    reach: 2500,
    topic: "Qualité produit",
  },
  {
    id: "m3",
    author: "Jean Martin",
    authorHandle: "",
    authorAvatar: "",
    content:
      "Le nouveau modèle X500 présente un défaut au niveau de la batterie. Elle se décharge complètement en moins de 2 heures d'utilisation. Quelqu'un d'autre a ce problème?",
    date: "2023-05-03T11:20:00",
    source: "forum",
    sentiment: "negative",
    reach: 15000,
    topic: "Problème produit",
  },
  {
    id: "m4",
    author: "Tech Review",
    authorHandle: "",
    authorAvatar: "",
    content:
      "Notre test du dernier produit de VotreEntreprise: des fonctionnalités innovantes mais un prix un peu élevé par rapport à la concurrence. Globalement une bonne option pour les professionnels.",
    date: "2023-05-02T16:45:00",
    source: "blog",
    sentiment: "neutral",
    reach: 75000,
    topic: "Prix",
  },
  {
    id: "m5",
    author: "Sophie Bernard",
    authorHandle: "@SophieB",
    authorAvatar: "",
    content:
      "Le service de livraison express de @VotreEntreprise est vraiment au top! Commandé hier, reçu aujourd'hui. Bravo! 👏",
    date: "2023-05-01T10:05:00",
    source: "twitter",
    sentiment: "positive",
    reach: 1800,
    topic: "Livraison",
  },
]

export default function KeyMentions() {
  const [filter, setFilter] = useState<"all" | "positive" | "negative" | "influencers">("all")

  // Filtrer les mentions
  const filteredMentions = mentionsData.filter((mention) => {
    if (filter === "positive") return mention.sentiment === "positive"
    if (filter === "negative") return mention.sentiment === "negative"
    if (filter === "influencers") return mention.isInfluencer
    return true
  })

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))

    if (diffHours < 1) {
      return "Il y a moins d'une heure"
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`
    } else if (diffDays === 1) {
      return "Hier"
    } else {
      return `Il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`
    }
  }

  // Obtenir l'icône de la source
  const getSourceIcon = (source: Mention["source"]) => {
    switch (source) {
      case "twitter":
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
            className="text-blue-500"
          >
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
          </svg>
        )
      case "facebook":
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
            className="text-blue-600"
          >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        )
      case "instagram":
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
            className="text-pink-600"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        )
      default:
        return <MessageSquare className="h-4 w-4 text-blue-500" />
    }
  }

  // Formater le nombre pour l'affichage
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  return (
    <Card className="border-blue-100 dark:border-blue-900/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <CardTitle>Mentions clés</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
            Toutes les mentions
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Les mentions les plus importantes et influentes de votre marque</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)}>
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="positive">Positives</TabsTrigger>
            <TabsTrigger value="negative">Négatives</TabsTrigger>
            <TabsTrigger value="influencers">Influenceurs</TabsTrigger>
          </TabsList>

          <div className="space-y-4 max-h-[400px] overflow-auto pr-1">
            {filteredMentions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <MessageSquare className="mb-2 h-8 w-8 text-blue-500 opacity-50" />
                <p>Aucune mention trouvée</p>
                <p className="text-xs">Essayez un autre filtre</p>
              </div>
            ) : (
              filteredMentions.map((mention) => (
                <div
                  key={mention.id}
                  className="rounded-lg border p-4 transition-all hover:border-blue-200 hover:bg-blue-50/30 dark:hover:border-blue-800 dark:hover:bg-blue-900/10"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      {mention.authorAvatar ? (
                        <AvatarImage src={mention.authorAvatar || "/placeholder.svg"} alt={mention.author} />
                      ) : (
                        <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          {mention.author.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="font-medium">{mention.author}</h4>
                            {mention.isInfluencer && (
                              <Badge className="ml-1 bg-blue-500" variant="default">
                                Influenceur
                              </Badge>
                            )}
                          </div>
                          {mention.authorHandle && (
                            <p className="text-xs text-muted-foreground">{mention.authorHandle}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{formatDate(mention.date)}</span>
                          <div className="flex h-6 w-6 items-center justify-center rounded-full">
                            {getSourceIcon(mention.source)}
                          </div>
                        </div>
                      </div>

                      <p className="mt-2 text-sm">{mention.content}</p>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
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
                            {mention.sentiment === "positive"
                              ? "Positif"
                              : mention.sentiment === "negative"
                                ? "Négatif"
                                : "Neutre"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {mention.topic}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Portée: {formatNumber(mention.reach)}</span>
                        </div>

                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Répondre
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
