import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export const metadata: Metadata = {
  title: "E-Réputation Monitor | Paramètres",
  description: "Configuration de votre plateforme de surveillance d'e-réputation",
}

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground">
            Configurez votre plateforme de surveillance d'e-réputation selon vos besoins.
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="alerts">Alertes</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres généraux</CardTitle>
                <CardDescription>Configurez les paramètres généraux de votre plateforme.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nom de l'entreprise</Label>
                    <Input id="company-name" defaultValue="Votre Entreprise" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Site web</Label>
                    <Input id="website" defaultValue="https://www.votreentreprise.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Secteur d'activité</Label>
                    <Input id="industry" defaultValue="Commerce électronique" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Préférences de notification</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Notifications par email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevoir des notifications par email pour les alertes importantes.
                      </p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="slack-notifications">Notifications Slack</Label>
                      <p className="text-sm text-muted-foreground">Envoyer les alertes et rapports à un canal Slack.</p>
                    </div>
                    <Switch id="slack-notifications" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="daily-digest">Rapport quotidien</Label>
                      <p className="text-sm text-muted-foreground">Recevoir un résumé quotidien de l'activité.</p>
                    </div>
                    <Switch id="daily-digest" defaultChecked />
                  </div>
                </div>

                <Button>Enregistrer les modifications</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources">
            <Card>
              <CardHeader>
                <CardTitle>Configuration des sources</CardTitle>
                <CardDescription>
                  Gérez les sources de données pour la surveillance de votre e-réputation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border p-8 text-center">
                  <h2 className="text-xl font-semibold">Page en développement</h2>
                  <p className="mt-2 text-muted-foreground">
                    Cette section est en cours de développement et sera bientôt disponible.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Configuration des alertes</CardTitle>
                <CardDescription>Définissez les conditions qui déclenchent des alertes.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border p-8 text-center">
                  <h2 className="text-xl font-semibold">Page en développement</h2>
                  <p className="mt-2 text-muted-foreground">
                    Cette section est en cours de développement et sera bientôt disponible.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>Intégration API</CardTitle>
                <CardDescription>Gérez vos clés API et intégrations tierces.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border p-8 text-center">
                  <h2 className="text-xl font-semibold">Page en développement</h2>
                  <p className="mt-2 text-muted-foreground">
                    Cette section est en cours de développement et sera bientôt disponible.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
