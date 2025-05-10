import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileForm } from "@/components/profile/profile-form"

export const metadata: Metadata = {
  title: "E-Réputation Monitor | Profil",
  description: "Gérez votre profil entreprise",
}

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Profil Entreprise</h1>
          <p className="text-muted-foreground">
            Gérez les informations de votre entreprise pour optimiser la surveillance de votre e-réputation.
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'entreprise</CardTitle>
              <CardDescription>
                Ces informations sont utilisées pour personnaliser votre expérience et améliorer la surveillance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
