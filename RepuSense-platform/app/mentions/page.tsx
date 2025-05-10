import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar, Download, Filter, MessageSquare, Search, SlidersHorizontal } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockMentions } from "@/lib/data"
import MentionCard from "@/components/mentions/mention-card"
import EngagementChart from "@/components/visualizations/engagement-chart"

export const metadata: Metadata = {
  title: "RepuSense | Mentions",
  description: "Toutes les mentions de votre marque sur le web",
}

export default function MentionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* En-tête de la page */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold">Mentions</h1>
              <p className="text-muted-foreground">Toutes les mentions de votre marque sur le web</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <Calendar className="mr-2 h-4 w-4" />
                Période
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Filtres
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>

          {/* Engagement Chart */}
          <EngagementChart />

          {/* Filtres et recherche */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Rechercher dans les mentions..." className="pl-8" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sentiment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les sentiments</SelectItem>
                      <SelectItem value="positive">Positif</SelectItem>
                      <SelectItem value="neutral">Neutre</SelectItem>
                      <SelectItem value="negative">Négatif</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les sources</SelectItem>
                      <SelectItem value="reddit">Reddit</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="blog">Blogs</SelectItem>
                      <SelectItem value="forum">Forums</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Engagement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tout engagement</SelectItem>
                      <SelectItem value="high">Élevé (70+)</SelectItem>
                      <SelectItem value="medium">Moyen (40-69)</SelectItem>
                      <SelectItem value="low">Faible (0-39)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Onglets de contenu */}
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Toutes les mentions</TabsTrigger>
              <TabsTrigger value="unread">Non lues</TabsTrigger>
              <TabsTrigger value="flagged">Signalées</TabsTrigger>
              <TabsTrigger value="responded">Répondues</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Mentions récentes</CardTitle>
                    <div className="text-sm text-muted-foreground">{mockMentions.length} mentions trouvées</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockMentions.map((mention) => (
                      <MentionCard key={mention.id} mention={mention} />
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Affichage de 1-10 sur 128 mentions</div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" disabled>
                        Précédent
                      </Button>
                      <Button variant="outline" size="sm">
                        Suivant
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="unread" className="mt-4">
              <Card className="p-8">
                <div className="flex flex-col items-center justify-center text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">Aucune mention non lue</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Toutes vos mentions ont été consultées. Revenez plus tard pour voir les nouvelles mentions.
                  </p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="flagged" className="mt-4">
              <Card className="p-8">
                <div className="flex flex-col items-center justify-center text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">Aucune mention signalée</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Vous n'avez pas encore signalé de mentions pour suivi. Utilisez le bouton "Signaler" pour marquer
                    les mentions importantes.
                  </p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="responded" className="mt-4">
              <Card className="p-8">
                <div className="flex flex-col items-center justify-center text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">Aucune mention répondue</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Vous n'avez pas encore répondu à des mentions. Utilisez le bouton "Répondre" pour interagir avec vos
                    mentions.
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
