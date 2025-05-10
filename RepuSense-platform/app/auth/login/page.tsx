import Link from "next/link"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "E-Réputation Monitor | Connexion",
  description: "Connectez-vous à votre compte entreprise",
}

export default function LoginPage() {
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
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription>Entrez vos identifiants pour accéder à votre tableau de bord</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            Vous n&apos;avez pas encore de compte ?{" "}
            <Link href="/auth/register" className="text-primary underline-offset-4 hover:underline">
              Créer un compte entreprise
            </Link>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            En vous connectant, vous acceptez nos{" "}
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

      {/* Instructions de connexion pour la démo */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg max-w-md">
        <h3 className="font-medium mb-2">Instructions pour la démo</h3>
        <p className="text-sm mb-2">
          Pour cette démo, vous pouvez vous connecter avec n'importe quelles informations d'identification.
        </p>
        <div className="text-sm bg-background p-2 rounded border">
          <p>
            <strong>Email:</strong> demo@exemple.com
          </p>
          <p>
            <strong>Mot de passe:</strong> password123
          </p>
        </div>
        <p className="text-xs mt-2 text-muted-foreground">
          Cliquez simplement sur "Se connecter" pour accéder au tableau de bord.
        </p>
      </div>
    </div>
  )
}
