import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileCreationForm } from "@/components/auth/profile-creation-form"

export const metadata: Metadata = {
  title: "E-Réputation Monitor | Création de profil",
  description: "Configurez le profil de votre entreprise",
}

export default function CreateProfilePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
          <span className="text-lg font-bold text-primary-foreground">ER</span>
        </span>
        <span className="text-xl font-semibold">E-Réputation Monitor</span>
      </div>

      <Card className="w-full max-w-3xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Créez votre profil entreprise</CardTitle>
          <CardDescription>Ces informations nous aideront à mieux surveiller votre e-réputation</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileCreationForm />
        </CardContent>
      </Card>
    </div>
  )
}
