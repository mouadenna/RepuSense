"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simuler une inscription
    try {
      // Dans une implémentation réelle, vous feriez un appel API ici
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Rediriger vers la page de création de profil après inscription réussie
      router.push("/auth/create-profile")

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé. Veuillez compléter votre profil entreprise.",
      })
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input id="firstName" placeholder="Jean" required disabled={isLoading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input id="lastName" placeholder="Dupont" required disabled={isLoading} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyName">Nom de l'entreprise</Label>
        <Input id="companyName" placeholder="Entreprise SAS" required disabled={isLoading} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email professionnel</Label>
        <Input id="email" type="email" placeholder="jean.dupont@entreprise.com" required disabled={isLoading} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="sr-only">{showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="terms" required />
        <Label htmlFor="terms" className="text-sm font-normal">
          J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Création du compte...
          </>
        ) : (
          "Créer un compte"
        )}
      </Button>
    </form>
  )
}
