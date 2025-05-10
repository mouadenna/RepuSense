import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "E-Réputation Monitor | Réinitialisation du mot de passe",
  description: "Réinitialisez votre mot de passe",
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
          <span className="text-lg font-bold text-primary-foreground">ER</span>
        </span>
        <span className="text-xl font-semibold">E-Réputation Monitor</span>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Réinitialisation du mot de passe</CardTitle>
          <CardDescription>Entrez votre adresse email pour recevoir un lien de réinitialisation</CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" asChild>
            <Link href="/auth/login">Retour à la connexion</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
