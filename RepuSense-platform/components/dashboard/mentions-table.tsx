"use client"

import { useState } from "react"
import { Facebook, MessageSquare, ThumbsDown, ThumbsUp, Twitter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Données simulées pour les mentions
const mentionsData = [
  {
    id: 1,
    source: "twitter",
    author: "Jean Dupont",
    content: "J'adore votre nouveau service client, très réactif et professionnel !",
    date: "2023-05-01T14:23:00",
    sentiment: "positive",
    topic: "Service client",
  },
  {
    id: 2,
    source: "facebook",
    author: "Marie Martin",
    content: "La qualité de vos produits s'est vraiment améliorée ces derniers mois. Bravo !",
    date: "2023-05-02T09:15:00",
    sentiment: "positive",
    topic: "Qualité produit",
  },
  {
    id: 3,
    source: "google",
    author: "Pierre Leroy",
    content: "Livraison en retard et produit endommagé. Très déçu de mon achat.",
    date: "2023-05-02T16:45:00",
    sentiment: "negative",
    topic: "Livraison",
  },
  {
    id: 4,
    source: "twitter",
    author: "Sophie Bernard",
    content: "Votre application mobile est pratique mais pourrait être plus intuitive.",
    date: "2023-05-03T11:30:00",
    sentiment: "neutral",
    topic: "Application mobile",
  },
  {
    id: 5,
    source: "facebook",
    author: "Thomas Petit",
    content: "Les prix sont un peu élevés par rapport à la concurrence, mais la qualité est au rendez-vous.",
    date: "2023-05-03T13:20:00",
    sentiment: "neutral",
    topic: "Prix",
  },
  {
    id: 6,
    source: "google",
    author: "Claire Dubois",
    content: "Service après-vente catastrophique, impossible d'obtenir un remboursement !",
    date: "2023-05-04T10:05:00",
    sentiment: "negative",
    topic: "Service client",
  },
  {
    id: 7,
    source: "twitter",
    author: "Luc Moreau",
    content: "Je recommande vivement cette entreprise pour son professionnalisme et sa réactivité.",
    date: "2023-05-04T15:40:00",
    sentiment: "positive",
    topic: "Service client",
  },
]

export default function MentionsTable() {
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  // Filtrer les mentions en fonction des critères
  const filteredMentions = mentionsData.filter(
    (mention) =>
      (filter === "all" || mention.sentiment === filter) &&
      (search === "" ||
        mention.content.toLowerCase().includes(search.toLowerCase()) ||
        mention.author.toLowerCase().includes(search.toLowerCase()) ||
        mention.topic.toLowerCase().includes(search.toLowerCase())),
  )

  // Formater la date pour l'affichage
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

  // Icône de la source
  const getSourceIcon = (source: string) => {
    switch (source) {
      case "twitter":
        return <Twitter className="h-4 w-4 text-blue-500" />
      case "facebook":
        return <Facebook className="h-4 w-4 text-blue-600" />
      default:
        return <MessageSquare className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <Card className="border-blue-100 dark:border-blue-900/30">
      <CardHeader>
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <CardTitle>Dernières Mentions</CardTitle>
            <CardDescription>Mentions récentes sur les différentes plateformes</CardDescription>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="positive">Positif</SelectItem>
                <SelectItem value="neutral">Neutre</SelectItem>
                <SelectItem value="negative">Négatif</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-[200px]"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredMentions.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              Aucune mention ne correspond à vos critères de recherche.
            </div>
          ) : (
            filteredMentions.map((mention) => (
              <div key={mention.id} className="rounded-lg border border-blue-100 dark:border-blue-900/30 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                      {getSourceIcon(mention.source)}
                    </div>
                    <div>
                      <div className="font-medium">{mention.author}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(mention.date)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        mention.sentiment === "positive"
                          ? "default"
                          : mention.sentiment === "negative"
                            ? "destructive"
                            : "secondary"
                      }
                      className={mention.sentiment === "positive" ? "bg-blue-500 hover:bg-blue-600" : ""}
                    >
                      {mention.sentiment === "positive" ? (
                        <ThumbsUp className="mr-1 h-3 w-3" />
                      ) : mention.sentiment === "negative" ? (
                        <ThumbsDown className="mr-1 h-3 w-3" />
                      ) : null}
                      {mention.sentiment.charAt(0).toUpperCase() + mention.sentiment.slice(1)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                    >
                      {mention.topic}
                    </Badge>
                  </div>
                </div>
                <div className="mt-2">{mention.content}</div>
                <div className="mt-3 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-800 dark:hover:bg-blue-950/50"
                  >
                    Répondre
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50"
                  >
                    Détails
                  </Button>
                </div>
              </div>
            ))
          )}
          {filteredMentions.length > 0 && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-800 dark:hover:bg-blue-950/50"
              >
                Voir plus de mentions
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
