import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, Calendar, Clock, Download, FileText, Filter, MoreHorizontal, Plus, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export const metadata: Metadata = {
  title: "RepuSense | Rapports",
  description: "Rapports détaillés sur votre e-réputation",
}

// Mock data for reports
const reports = [
  {
    id: "r1",
    name: "Rapport mensuel - Mai 2023",
    type: "monthly",
    format: "pdf",
    date: "2023-05-31T15:30:00",
    size: "2.4 MB",
    status: "ready",
  },
  {
    id: "r2",
    name: "Rapport hebdomadaire - Semaine 22",
    type: "weekly",
    format: "excel",
    date: "2023-05-28T10:15:00",
    size: "1.8 MB",
    status: "ready",
  },
  {
    id: "r3",
    name: "Analyse des influenceurs - Mai 2023",
    type: "custom",
    format: "pdf",
    date: "2023-05-25T14:45:00",
    size: "3.2 MB",
    status: "ready",
  },
  {
    id: "r4",
    name: "Comparaison concurrentielle - Q2 2023",
    type: "quarterly",
    format: "pdf",
    date: "2023-05-20T09:30:00",
    size: "4.5 MB",
    status: "ready",
  },
  {
    id: "r5",
    name: "Rapport mensuel - Avril 2023",
    type: "monthly",
    format: "pdf",
    date: "2023-04-30T16:20:00",
    size: "2.2 MB",
    status: "ready",
  },
  {
    id: "r6",
    name: "Rapport hebdomadaire - Semaine 21",
    type: "weekly",
    format: "excel",
    date: "2023-05-21T11:10:00",
    size: "1.7 MB",
    status: "ready",
  },
  {
    id: "r7",
    name: "Rapport mensuel - Juin 2023",
    type: "monthly",
    format: "pdf",
    date: "2023-06-30T00:00:00",
    size: "0",
    status: "scheduled",
  },
]

// Mock data for templates
const templates = [
  {
    id: "t1",
    name: "Rapport mensuel",
    description: "Aperçu complet de votre e-réputation sur un mois",
    sections: ["Tendances", "Sentiment", "Sources", "Influenceurs", "Recommandations"],
    format: "pdf",
  },
  {
    id: "t2",
    name: "Rapport hebdomadaire",
    description: "Résumé de l'activité de la semaine",
    sections: ["Mentions", "Sentiment", "Sujets", "Actions"],
    format: "excel",
  },
  {
    id: "t3",
    name: "Analyse des influenceurs",
    description: "Analyse détaillée de l'impact des influenceurs",
    sections: ["Influenceurs", "Mentions", "Engagement", "Sentiment", "Recommandations"],
    format: "pdf",
  },
  {
    id: "t4",
    name: "Comparaison concurrentielle",
    description: "Analyse comparative avec vos concurrents",
    sections: ["Mentions", "Sentiment", "Part de voix", "Forces/Faiblesses", "Opportunités"],
    format: "pdf",
  },
  {
    id: "t5",
    name: "Rapport de crise",
    description: "Analyse d'une situation de crise",
    sections: ["Chronologie", "Mentions", "Sentiment", "Impact", "Actions"],
    format: "pdf",
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

export default function RapportsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* En-tête de la page */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold">Rapports</h1>
              <p className="text-muted-foreground">Rapports détaillés sur votre e-réputation</p>
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
              <Button className="h-9">
                <Plus className="mr-2 h-4 w-4" />
                Créer un rapport
              </Button>
            </div>
          </div>

          {/* Onglets de contenu */}
          <Tabs defaultValue="reports">
            <TabsList>
              <TabsTrigger value="reports">Mes rapports</TabsTrigger>
              <TabsTrigger value="templates">Modèles</TabsTrigger>
              <TabsTrigger value="scheduled">Programmés</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            {/* Onglet Mes rapports */}
            <TabsContent value="reports" className="mt-6 space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Rapports générés</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Input type="search" placeholder="Rechercher un rapport..." className="w-[250px]" />
                      </div>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les types</SelectItem>
                          <SelectItem value="monthly">Mensuel</SelectItem>
                          <SelectItem value="weekly">Hebdomadaire</SelectItem>
                          <SelectItem value="quarterly">Trimestriel</SelectItem>
                          <SelectItem value="custom">Personnalisé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <CardDescription>Liste des rapports générés et disponibles au téléchargement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reports
                      .filter((report) => report.status === "ready")
                      .map((report) => (
                        <div
                          key={report.id}
                          className="flex flex-col rounded-lg border p-4 transition-all hover:border-blue-200 hover:bg-blue-50/30 dark:hover:border-blue-800 dark:hover:bg-blue-900/10 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                              <FileText className="h-5 w-5" />
                            </div>

                            <div>
                              <h4 className="font-medium">{report.name}</h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge variant="outline" className="text-xs font-normal">
                                  {report.type === "monthly"
                                    ? "Mensuel"
                                    : report.type === "weekly"
                                      ? "Hebdomadaire"
                                      : report.type === "quarterly"
                                        ? "Trimestriel"
                                        : "Personnalisé"}
                                </Badge>
                                <span>{formatDate(report.date)}</span>
                                <span>{report.size}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-2 sm:mt-0">
                            <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                              <Download className="h-3 w-3" />
                              {report.format === "pdf" ? "PDF" : "Excel"}
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                              <Send className="h-3 w-3" />
                              Partager
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Aperçu</DropdownMenuItem>
                                <DropdownMenuItem>Dupliquer</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Rapports populaires</CardTitle>
                    <CardDescription>Les rapports les plus consultés par votre équipe</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          name: "Rapport mensuel - Mai 2023",
                          views: 24,
                          downloads: 18,
                        },
                        {
                          name: "Analyse des influenceurs - Mai 2023",
                          views: 16,
                          downloads: 12,
                        },
                        {
                          name: "Comparaison concurrentielle - Q2 2023",
                          views: 14,
                          downloads: 10,
                        },
                      ].map((report, index) => (
                        <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                              <FileText className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{report.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span>{report.views} vues</span>
                            <span>{report.downloads} téléchargements</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Statistiques des rapports</CardTitle>
                    <CardDescription>Aperçu de l'utilisation des rapports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground">Rapports générés</div>
                        <div className="mt-1 flex items-end gap-2">
                          <div className="text-2xl font-bold">24</div>
                          <div className="flex items-center text-xs text-emerald-600">
                            <ArrowUpRight className="h-3 w-3" />
                            <span>+12% ce mois</span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground">Téléchargements</div>
                        <div className="mt-1 flex items-end gap-2">
                          <div className="text-2xl font-bold">86</div>
                          <div className="flex items-center text-xs text-emerald-600">
                            <ArrowUpRight className="h-3 w-3" />
                            <span>+8% ce mois</span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground">Format le plus populaire</div>
                        <div className="mt-1 flex items-end gap-2">
                          <div className="text-2xl font-bold">PDF</div>
                          <div className="text-xs text-muted-foreground">78% des rapports</div>
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground">Rapports programmés</div>
                        <div className="mt-1 flex items-end gap-2">
                          <div className="text-2xl font-bold">5</div>
                          <div className="text-xs text-muted-foreground">Actifs</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Modèles */}
            <TabsContent value="templates" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Modèles de rapport</CardTitle>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nouveau modèle
                    </Button>
                  </div>
                  <CardDescription>Modèles disponibles pour générer des rapports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className="rounded-lg border p-4 transition-all hover:border-blue-200 hover:bg-blue-50/30 dark:hover:border-blue-800 dark:hover:bg-blue-900/10"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            <FileText className="h-4 w-4" />
                          </div>
                          <Badge variant="outline" className="text-xs font-normal">
                            {template.format.toUpperCase()}
                          </Badge>
                        </div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
                        <div className="mt-3">
                          <h4 className="text-xs font-medium text-muted-foreground">Sections incluses:</h4>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {template.sections.map((section, index) => (
                              <Badge key={index} variant="secondary" className="text-xs font-normal">
                                {section}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            Modifier
                          </Button>
                          <Button size="sm" className="h-8 text-xs">
                            Générer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Programmés */}
            <TabsContent value="scheduled" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Rapports programmés</CardTitle>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Programmer un rapport
                    </Button>
                  </div>
                  <CardDescription>Rapports configurés pour une génération automatique</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Rapport mensuel",
                        template: "Rapport mensuel",
                        frequency: "Mensuel",
                        nextRun: "2023-06-30T00:00:00",
                        recipients: ["equipe@entreprise.com", "direction@entreprise.com"],
                        format: "pdf",
                      },
                      {
                        name: "Rapport hebdomadaire",
                        template: "Rapport hebdomadaire",
                        frequency: "Hebdomadaire",
                        nextRun: "2023-06-04T08:00:00",
                        recipients: ["equipe@entreprise.com"],
                        format: "excel",
                      },
                      {
                        name: "Analyse des influenceurs",
                        template: "Analyse des influenceurs",
                        frequency: "Mensuel",
                        nextRun: "2023-06-15T10:00:00",
                        recipients: ["marketing@entreprise.com"],
                        format: "pdf",
                      },
                      {
                        name: "Comparaison concurrentielle",
                        template: "Comparaison concurrentielle",
                        frequency: "Trimestriel",
                        nextRun: "2023-06-30T14:00:00",
                        recipients: ["direction@entreprise.com", "strategie@entreprise.com"],
                        format: "pdf",
                      },
                      {
                        name: "Rapport de veille sectorielle",
                        template: "Rapport personnalisé",
                        frequency: "Bimensuel",
                        nextRun: "2023-06-10T09:00:00",
                        recipients: ["veille@entreprise.com"],
                        format: "pdf",
                      },
                    ].map((schedule, index) => (
                      <div
                        key={index}
                        className="flex flex-col rounded-lg border p-4 transition-all hover:border-blue-200 hover:bg-blue-50/30 dark:hover:border-blue-800 dark:hover:bg-blue-900/10 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            <Clock className="h-5 w-5" />
                          </div>

                          <div>
                            <h4 className="font-medium">{schedule.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Badge variant="outline" className="text-xs font-normal">
                                {schedule.frequency}
                              </Badge>
                              <span>Modèle: {schedule.template}</span>
                              <span>Format: {schedule.format.toUpperCase()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-col gap-2 sm:mt-0 sm:text-right">
                          <div className="text-sm">
                            Prochaine exécution: <span className="font-medium">{formatDate(schedule.nextRun)}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {schedule.recipients.length} destinataire
                            {schedule.recipients.length > 1 ? "s" : ""}
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                              Modifier
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 text-xs text-red-600">
                              Désactiver
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Paramètres */}
            <TabsContent value="settings" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres des rapports</CardTitle>
                  <CardDescription>Configuration des options de génération et d'envoi des rapports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Options de format</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-lg border p-4">
                          <h4 className="mb-2 font-medium">PDF</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Qualité d'image</span>
                              <Select defaultValue="high">
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue placeholder="Qualité" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Basse</SelectItem>
                                  <SelectItem value="medium">Moyenne</SelectItem>
                                  <SelectItem value="high">Haute</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Orientation</span>
                              <Select defaultValue="portrait">
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue placeholder="Orientation" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="portrait">Portrait</SelectItem>
                                  <SelectItem value="landscape">Paysage</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg border p-4">
                          <h4 className="mb-2 font-medium">Excel</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Format</span>
                              <Select defaultValue="xlsx">
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue placeholder="Format" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="xlsx">XLSX</SelectItem>
                                  <SelectItem value="csv">CSV</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Inclure les graphiques</span>
                              <Select defaultValue="yes">
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue placeholder="Graphiques" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="yes">Oui</SelectItem>
                                  <SelectItem value="no">Non</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Options d'envoi</h3>
                      <div className="rounded-lg border p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Méthode d'envoi par défaut</span>
                            <Select defaultValue="email">
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Méthode d'envoi" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="slack">Slack</SelectItem>
                                <SelectItem value="teams">Microsoft Teams</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Format par défaut</span>
                            <Select defaultValue="pdf">
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Format" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pdf">PDF</SelectItem>
                                <SelectItem value="excel">Excel</SelectItem>
                                <SelectItem value="both">Les deux</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Destinataires par défaut</span>
                            <Button variant="outline" size="sm">
                              Gérer les destinataires
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Personnalisation</h3>
                      <div className="rounded-lg border p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Logo de l'entreprise</span>
                            <Button variant="outline" size="sm">
                              Télécharger
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Couleurs personnalisées</span>
                            <Button variant="outline" size="sm">
                              Personnaliser
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Pied de page personnalisé</span>
                            <Input
                              placeholder="Texte du pied de page"
                              className="w-[300px]"
                              defaultValue="© 2023 Votre Entreprise - Confidentiel"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button>Enregistrer les paramètres</Button>
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
