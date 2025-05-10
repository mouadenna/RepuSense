import { SelectItem } from "@/components/ui/select"
import { SelectContent } from "@/components/ui/select"
import { SelectValue } from "@/components/ui/select"
import { SelectTrigger } from "@/components/ui/select"
import { Select } from "@/components/ui/select"
import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertCircle,
  CheckCircle,
  Download,
  ExternalLink,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Trash2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export const metadata: Metadata = {
  title: "RepuSense | Sources",
  description: "Gestion des sources de données pour la surveillance de votre e-réputation",
}

// Mock data for sources
const sources = [
  {
    id: "s1",
    name: "Twitter",
    type: "social",
    icon: "/placeholder.svg?height=40&width=40",
    status: "active",
    lastSync: "2023-05-04T09:15:00",
    mentions: 532,
    coverage: 85,
    keywords: ["@VotreEntreprise", "#VotreMarque", "Votre Entreprise"],
  },
  {
    id: "s2",
    name: "Facebook",
    type: "social",
    icon: "/placeholder.svg?height=40&width=40",
    status: "active",
    lastSync: "2023-05-04T08:30:00",
    mentions: 324,
    coverage: 78,
    keywords: ["@VotreEntreprise", "Votre Entreprise", "VotreEntreprise.com"],
  },
  {
    id: "s3",
    name: "Instagram",
    type: "social",
    icon: "/placeholder.svg?height=40&width=40",
    status: "active",
    lastSync: "2023-05-04T08:45:00",
    mentions: 215,
    coverage: 72,
    keywords: ["@VotreEntreprise", "#VotreMarque", "Votre Entreprise"],
  },
  {
    id: "s4",
    name: "Google News",
    type: "news",
    icon: "/placeholder.svg?height=40&width=40",
    status: "active",
    lastSync: "2023-05-04T07:30:00",
    mentions: 87,
    coverage: 92,
    keywords: ["Votre Entreprise", "VotreEntreprise.com", "CEO Votre Entreprise"],
  },
  {
    id: "s5",
    name: "Forums Tech",
    type: "forum",
    icon: "/placeholder.svg?height=40&width=40",
    status: "warning",
    lastSync: "2023-05-03T14:20:00",
    mentions: 156,
    coverage: 65,
    keywords: ["Votre Entreprise", "produits VotreEntreprise", "support VotreEntreprise"],
  },
  {
    id: "s6",
    name: "Blogs Spécialisés",
    type: "blog",
    icon: "/placeholder.svg?height=40&width=40",
    status: "active",
    lastSync: "2023-05-04T06:15:00",
    mentions: 43,
    coverage: 80,
    keywords: ["Votre Entreprise", "avis VotreEntreprise", "test VotreEntreprise"],
  },
  {
    id: "s7",
    name: "YouTube",
    type: "social",
    icon: "/placeholder.svg?height=40&width=40",
    status: "error",
    lastSync: "2023-05-02T10:45:00",
    mentions: 28,
    coverage: 45,
    keywords: ["Votre Entreprise", "VotreEntreprise review", "VotreEntreprise tutorial"],
  },
  {
    id: "s8",
    name: "Sites d'avis",
    type: "review",
    icon: "/placeholder.svg?height=40&width=40",
    status: "active",
    lastSync: "2023-05-04T05:30:00",
    mentions: 97,
    coverage: 88,
    keywords: ["Votre Entreprise", "avis VotreEntreprise", "note VotreEntreprise"],
  },
]

// Mock data for influencers
const influencers = [
  {
    id: "i1",
    name: "Tech Expert",
    handle: "@TechExpert",
    avatar: "/placeholder.svg?height=40&width=40",
    platform: "Twitter",
    followers: 450000,
    engagement: 3.2,
    sentiment: 0.35,
    lastMention: "2023-05-04T09:15:00",
    status: "active",
  },
  {
    id: "i2",
    name: "Product Review",
    handle: "@ProductReview",
    avatar: "/placeholder.svg?height=40&width=40",
    platform: "Twitter",
    followers: 320000,
    engagement: 2.8,
    sentiment: 0.65,
    lastMention: "2023-05-03T14:30:00",
    status: "active",
  },
  {
    id: "i3",
    name: "Digital Trends",
    handle: "@DigitalTrends",
    avatar: "/placeholder.svg?height=40&width=40",
    platform: "Instagram",
    followers: 280000,
    engagement: 4.1,
    sentiment: 0.72,
    lastMention: "2023-05-02T11:20:00",
    status: "active",
  },
  {
    id: "i4",
    name: "Consumer Guide",
    handle: "@ConsumerGuide",
    avatar: "/placeholder.svg?height=40&width=40",
    platform: "Facebook",
    followers: 210000,
    engagement: 1.9,
    sentiment: 0.48,
    lastMention: "2023-05-01T16:45:00",
    status: "inactive",
  },
  {
    id: "i5",
    name: "Tech News",
    handle: "@TechNews",
    avatar: "/placeholder.svg?height=40&width=40",
    platform: "Twitter",
    followers: 180000,
    engagement: 2.5,
    sentiment: 0.62,
    lastMention: "2023-04-30T15:20:00",
    status: "active",
  },
]

// Format date for display
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

// Format number for display
function formatNumber(num: number) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

export default function SourcesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* En-tête de la page */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold">Sources</h1>
              <p className="text-muted-foreground">
                Gestion des sources de données pour la surveillance de votre e-réputation
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <RefreshCw className="mr-2 h-4 w-4" />
                Synchroniser
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Filtres
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
              <Button className="h-9">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une source
              </Button>
            </div>
          </div>

          {/* Onglets de contenu */}
          <Tabs defaultValue="sources">
            <TabsList>
              <TabsTrigger value="sources">Sources</TabsTrigger>
              <TabsTrigger value="influencers">Influenceurs</TabsTrigger>
              <TabsTrigger value="keywords">Mots-clés</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            {/* Onglet Sources */}
            <TabsContent value="sources" className="mt-6 space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Sources surveillées</CardTitle>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input type="search" placeholder="Rechercher une source..." className="w-[250px] pl-8" />
                    </div>
                  </div>
                  <CardDescription>Liste des sources surveillées pour votre marque</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sources.map((source) => (
                      <div
                        key={source.id}
                        className="flex flex-col rounded-lg border p-4 transition-all hover:border-blue-200 hover:bg-blue-50/30 dark:hover:border-blue-800 dark:hover:bg-blue-900/10 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={source.icon || "/placeholder.svg"} alt={source.name} />
                            <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                              {source.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{source.name}</h4>
                              <Badge
                                variant={
                                  source.status === "active"
                                    ? "default"
                                    : source.status === "warning"
                                      ? "outline"
                                      : "destructive"
                                }
                                className={
                                  source.status === "active"
                                    ? "bg-emerald-500"
                                    : source.status === "warning"
                                      ? "border-amber-500 text-amber-500"
                                      : ""
                                }
                              >
                                {source.status === "active"
                                  ? "Actif"
                                  : source.status === "warning"
                                    ? "Avertissement"
                                    : "Erreur"}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Dernière synchronisation: {formatDate(source.lastSync)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-4 sm:mt-0">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">Mentions</span>
                            <span className="font-medium">{source.mentions}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">Couverture</span>
                            <div className="flex items-center gap-2">
                              <Progress value={source.coverage} className="h-2 w-16" />
                              <span className="text-xs font-medium">{source.coverage}%</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Statut des sources</CardTitle>
                    <CardDescription>Vue d'ensemble de l'état de vos sources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">Sources actives</h4>
                            <p className="text-sm text-muted-foreground">Sources fonctionnant correctement</p>
                          </div>
                        </div>
                        <div className="text-2xl font-bold">6</div>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                            <AlertCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">Sources avec avertissements</h4>
                            <p className="text-sm text-muted-foreground">Sources nécessitant votre attention</p>
                          </div>
                        </div>
                        <div className="text-2xl font-bold">1</div>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                            <AlertCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">Sources en erreur</h4>
                            <p className="text-sm text-muted-foreground">Sources nécessitant une intervention</p>
                          </div>
                        </div>
                        <div className="text-2xl font-bold">1</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Répartition des mentions</CardTitle>
                    <CardDescription>Nombre de mentions par type de source</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { type: "Réseaux sociaux", count: 1099, percentage: 74 },
                        { type: "Actualités", count: 87, percentage: 6 },
                        { type: "Forums", count: 156, percentage: 10 },
                        { type: "Blogs", count: 43, percentage: 3 },
                        { type: "Sites d'avis", count: 97, percentage: 7 },
                      ].map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{item.type}</span>
                            <span className="text-sm font-medium">{item.count} mentions</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                            <div
                              className="h-full rounded-full bg-blue-600"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-right text-xs text-muted-foreground">{item.percentage}% du total</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Influenceurs */}
            <TabsContent value="influencers" className="mt-6 space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Influenceurs surveillés</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Rechercher un influenceur..." className="w-[250px] pl-8" />
                      </div>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter
                      </Button>
                    </div>
                  </div>
                  <CardDescription>Liste des influenceurs importants pour votre marque</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {influencers.map((influencer) => (
                      <div
                        key={influencer.id}
                        className="flex flex-col rounded-lg border p-4 transition-all hover:border-blue-200 hover:bg-blue-50/30 dark:hover:border-blue-800 dark:hover:bg-blue-900/10 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={influencer.avatar || "/placeholder.svg"} alt={influencer.name} />
                            <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                              {influencer.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{influencer.name}</h4>
                              <Badge
                                variant={influencer.status === "active" ? "default" : "secondary"}
                                className={influencer.status === "active" ? "bg-blue-500" : ""}
                              >
                                {influencer.status === "active" ? "Actif" : "Inactif"}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {influencer.handle} • {influencer.platform}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-4 sm:mt-0">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">Abonnés</span>
                            <span className="font-medium">{formatNumber(influencer.followers)}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">Engagement</span>
                            <span className="font-medium">{influencer.engagement}%</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">Sentiment</span>
                            <div
                              className="h-2 w-16 rounded-full"
                              style={{
                                background: `linear-gradient(to right, #ef4444, #3b82f6)`,
                              }}
                            >
                              <div
                                className="h-3 w-3 translate-y-[-2px] rounded-full bg-white border border-gray-300"
                                style={{
                                  marginLeft: `calc(${influencer.sentiment * 100}% - 6px)`,
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Suggestions d'influenceurs</CardTitle>
                  <CardDescription>Influenceurs potentiellement pertinents pour votre marque</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Tech Reviewer",
                        handle: "@TechReviewer",
                        platform: "Twitter",
                        followers: 125000,
                        relevance: 85,
                      },
                      {
                        name: "Gadget Pro",
                        handle: "@GadgetPro",
                        platform: "Instagram",
                        followers: 98000,
                        relevance: 78,
                      },
                      {
                        name: "Digital Lifestyle",
                        handle: "@DigitalLifestyle",
                        platform: "YouTube",
                        followers: 210000,
                        relevance: 72,
                      },
                    ].map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex flex-col rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                              {suggestion.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <h4 className="font-medium">{suggestion.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {suggestion.handle} • {suggestion.platform}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-4 sm:mt-0">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">Abonnés</span>
                            <span className="font-medium">{formatNumber(suggestion.followers)}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">Pertinence</span>
                            <div className="flex items-center gap-2">
                              <Progress value={suggestion.relevance} className="h-2 w-16" />
                              <span className="text-xs font-medium">{suggestion.relevance}%</span>
                            </div>
                          </div>
                          <Button size="sm" className="h-8">
                            <Plus className="mr-2 h-3 w-3" />
                            Ajouter
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Mots-clés */}
            <TabsContent value="keywords" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mots-clés surveillés</CardTitle>
                  <CardDescription>Gestion des mots-clés utilisés pour la surveillance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="flex-1">
                        <Input placeholder="Ajouter un nouveau mot-clé..." />
                      </div>
                      <Button>Ajouter</Button>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Marque</h3>
                      <div className="flex flex-wrap gap-2">
                        {["Votre Entreprise", "@VotreEntreprise", "#VotreMarque", "VotreEntreprise.com"].map(
                          (keyword, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 rounded-full border bg-background px-3 py-1"
                            >
                              <span className="text-sm">{keyword}</span>
                              <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Produits</h3>
                      <div className="flex flex-wrap gap-2">
                        {["Produit X500", "Produit Y300", "Série Z", "Application Mobile"].map((keyword, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 rounded-full border bg-background px-3 py-1"
                          >
                            <span className="text-sm">{keyword}</span>
                            <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Personnes</h3>
                      <div className="flex flex-wrap gap-2">
                        {["CEO Nom Prénom", "Directeur Marketing", "@CMO_Handle"].map((keyword, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 rounded-full border bg-background px-3 py-1"
                          >
                            <span className="text-sm">{keyword}</span>
                            <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Concurrents</h3>
                      <div className="flex flex-wrap gap-2">
                        {["Concurrent A", "Concurrent B", "Concurrent C", "@ConcurrentA"].map((keyword, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 rounded-full border bg-background px-3 py-1"
                          >
                            <span className="text-sm">{keyword}</span>
                            <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Suggestions de mots-clés</CardTitle>
                  <CardDescription>Mots-clés potentiellement pertinents pour votre surveillance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="mb-3 font-medium">Basé sur vos mentions récentes</h3>
                      <div className="flex flex-wrap gap-2">
                        {["Nouveau Produit X600", "#TechInnovation", "Support Client", "Prix Produit"].map(
                          (keyword, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 rounded-full border bg-background px-3 py-1"
                            >
                              <span className="text-sm">{keyword}</span>
                              <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-blue-600">
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="mb-3 font-medium">Basé sur votre secteur</h3>
                      <div className="flex flex-wrap gap-2">
                        {["Tendance Sectorielle", "Innovation Tech", "Développement Durable", "Expérience Client"].map(
                          (keyword, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 rounded-full border bg-background px-3 py-1"
                            >
                              <span className="text-sm">{keyword}</span>
                              <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-blue-600">
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Paramètres */}
            <TabsContent value="settings" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres de surveillance</CardTitle>
                  <CardDescription>Configuration des paramètres de surveillance des sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Fréquence de synchronisation</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="sync-social">Réseaux sociaux</Label>
                            <p className="text-xs text-muted-foreground">
                              Fréquence de synchronisation des réseaux sociaux
                            </p>
                          </div>
                          <Select defaultValue="15">
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Fréquence" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5 minutes</SelectItem>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="60">1 heure</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="sync-news">Actualités</Label>
                            <p className="text-xs text-muted-foreground">
                              Fréquence de synchronisation des sources d'actualités
                            </p>
                          </div>
                          <Select defaultValue="30">
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Fréquence" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="60">1 heure</SelectItem>
                              <SelectItem value="120">2 heures</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="sync-blogs">Blogs et forums</Label>
                            <p className="text-xs text-muted-foreground">
                              Fréquence de synchronisation des blogs et forums
                            </p>
                          </div>
                          <Select defaultValue="60">
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Fréquence" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="60">1 heure</SelectItem>
                              <SelectItem value="120">2 heures</SelectItem>
                              <SelectItem value="240">4 heures</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Notifications</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="notify-mentions">Nouvelles mentions</Label>
                            <p className="text-xs text-muted-foreground">
                              Recevoir des notifications pour les nouvelles mentions
                            </p>
                          </div>
                          <Switch id="notify-mentions" defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="notify-influencers">Mentions d'influenceurs</Label>
                            <p className="text-xs text-muted-foreground">
                              Recevoir des notifications pour les mentions d'influenceurs
                            </p>
                          </div>
                          <Switch id="notify-influencers" defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="notify-negative">Mentions négatives</Label>
                            <p className="text-xs text-muted-foreground">
                              Recevoir des notifications pour les mentions négatives
                            </p>
                          </div>
                          <Switch id="notify-negative" defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="notify-errors">Erreurs de source</Label>
                            <p className="text-xs text-muted-foreground">
                              Recevoir des notifications pour les erreurs de source
                            </p>
                          </div>
                          <Switch id="notify-errors" defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Limites et quotas</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Quota de mentions</Label>
                            <p className="text-xs text-muted-foreground">Limite mensuelle de mentions surveillées</p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">1,482 / 10,000</div>
                            <Progress value={14.82} className="h-2 w-32" />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Quota d'API</Label>
                            <p className="text-xs text-muted-foreground">Limite quotidienne d'appels API</p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">3,245 / 5,000</div>
                            <Progress value={64.9} className="h-2 w-32" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Intégrations</CardTitle>
                  <CardDescription>Gestion des intégrations avec d'autres services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            TW
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">Twitter API</h4>
                          <p className="text-xs text-muted-foreground">
                            Connecté • Dernière synchronisation: il y a 15 minutes
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Configurer
                      </Button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            FB
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">Facebook API</h4>
                          <p className="text-xs text-muted-foreground">
                            Connecté • Dernière synchronisation: il y a 12 minutes
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Configurer
                      </Button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            GN
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">Google News API</h4>
                          <p className="text-xs text-muted-foreground">
                            Connecté • Dernière synchronisation: il y a 30 minutes
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Configurer
                      </Button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                            YT
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">YouTube API</h4>
                          <p className="text-xs text-muted-foreground">Non connecté</p>
                        </div>
                      </div>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Connecter
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
