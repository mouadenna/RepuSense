"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simuler l'envoi d'un email de réinitialisation
    try {
      // Dans une implémentation réelle, vous feriez un appel API ici
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSubmitted(true)

      toast({
        title: "Email envoyé",
        description: "Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-full bg-primary/10 p-6 mx-auto w-fit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium">Vérifiez votre boîte de réception</h3>
        <p className="text-sm text-muted-foreground">
          Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>. Vérifiez votre boîte de réception et
          suivez les instructions pour réinitialiser votre mot de passe.
        </p>
        <p className="text-xs text-muted-foreground">
          Si vous ne recevez pas d&apos;email dans les prochaines minutes, vérifiez votre dossier de spam.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="entreprise@exemple.com"
          required
          disabled={isLoading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          "Envoyer le lien de réinitialisation"
        )}
      </Button>
    </form>
  )
}
