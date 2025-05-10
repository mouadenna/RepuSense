import Link from "next/link"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "E-Réputation Monitor | Inscription",
  description: "Créez un compte entreprise pour surveiller votre e-réputation",
}

export default function RegisterPage() {
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
          <CardTitle className="text-2xl font-bold">Créer un compte entreprise</CardTitle>
          <CardDescription>Commencez à surveiller et analyser votre e-réputation</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            Vous avez déjà un compte ?{" "}
            <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
              Se connecter
            </Link>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            En créant un compte, vous acceptez nos{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Conditions d&apos;utilisation
            </Link>{" "}
            et notre{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Politique de confidentialité
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
