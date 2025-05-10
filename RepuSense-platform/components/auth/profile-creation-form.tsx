"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Trash2, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ProfileCreationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("company")
  const router = useRouter()
  const { toast } = useToast()

  // État pour les marques/produits
  const [brands, setBrands] = useState<string[]>([])
  const [newBrand, setNewBrand] = useState("")

  // État pour les employés clés
  const [employees, setEmployees] = useState<{ name: string; role: string }[]>([])
  const [newEmployeeName, setNewEmployeeName] = useState("")
  const [newEmployeeRole, setNewEmployeeRole] = useState("")

  // État pour les réseaux sociaux
  const [socialMedia, setSocialMedia] = useState<{ platform: string; handle: string }[]>([])
  const [newSocialPlatform, setNewSocialPlatform] = useState("")
  const [newSocialHandle, setNewSocialHandle] = useState("")

  // État pour les hashtags
  const [hashtags, setHashtags] = useState<string[]>([])
  const [newHashtag, setNewHashtag] = useState("")

  // Ajouter une marque/produit
  const addBrand = () => {
    if (newBrand.trim()) {
      setBrands([...brands, newBrand.trim()])
      setNewBrand("")
    }
  }

  // Supprimer une marque/produit
  const removeBrand = (index: number) => {
    setBrands(brands.filter((_, i) => i !== index))
  }

  // Ajouter un employé clé
  const addEmployee = () => {
    if (newEmployeeName.trim() && newEmployeeRole.trim()) {
      setEmployees([
        ...employees,
        {
          name: newEmployeeName.trim(),
          role: newEmployeeRole.trim(),
        },
      ])
      setNewEmployeeName("")
      setNewEmployeeRole("")
    }
  }

  // Supprimer un employé clé
  const removeEmployee = (index: number) => {
    setEmployees(employees.filter((_, i) => i !== index))
  }

  // Ajouter un réseau social
  const addSocialMedia = () => {
    if (newSocialPlatform.trim() && newSocialHandle.trim()) {
      setSocialMedia([
        ...socialMedia,
        {
          platform: newSocialPlatform.trim(),
          handle: newSocialHandle.trim(),
        },
      ])
      setNewSocialPlatform("")
      setNewSocialHandle("")
    }
  }

  // Supprimer un réseau social
  const removeSocialMedia = (index: number) => {
    setSocialMedia(socialMedia.filter((_, i) => i !== index))
  }

  // Ajouter un hashtag
  const addHashtag = () => {
    if (newHashtag.trim()) {
      setHashtags([...hashtags, newHashtag.trim().startsWith("#") ? newHashtag.trim() : `#${newHashtag.trim()}`])
      setNewHashtag("")
    }
  }

  // Supprimer un hashtag
  const removeHashtag = (index: number) => {
    setHashtags(hashtags.filter((_, i) => i !== index))
  }

  // Gérer la navigation entre les onglets
  const handleNextTab = () => {
    if (activeTab === "company") setActiveTab("brands")
    else if (activeTab === "brands") setActiveTab("employees")
    else if (activeTab === "employees") setActiveTab("social")
  }

  const handlePrevTab = () => {
    if (activeTab === "social") setActiveTab("employees")
    else if (activeTab === "employees") setActiveTab("brands")
    else if (activeTab === "brands") setActiveTab("company")
  }

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simuler la création de profil
    try {
      // Dans une implémentation réelle, vous feriez un appel API ici
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Rediriger vers le tableau de bord après création du profil
      router.push("/")

      toast({
        title: "Profil créé avec succès",
        description: "Votre profil entreprise a été configuré. Bienvenue sur E-Réputation Monitor.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du profil. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company">Entreprise</TabsTrigger>
          <TabsTrigger value="brands">Marques & Produits</TabsTrigger>
          <TabsTrigger value="employees">Employés clés</TabsTrigger>
          <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
        </TabsList>

        {/* Onglet Entreprise */}
        <TabsContent value="company" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nom de l'entreprise</Label>
            <Input id="companyName" placeholder="Entreprise SAS" required disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Secteur d'activité</Label>
            <Input
              id="industry"
              placeholder="Ex: Commerce électronique, Santé, Finance..."
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Site web</Label>
            <Input id="website" type="url" placeholder="https://www.entreprise.com" required disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description de l'entreprise</Label>
            <Textarea
              id="description"
              placeholder="Décrivez brièvement votre entreprise, ses activités et sa mission..."
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end">
            <Button type="button" onClick={handleNextTab}>
              Suivant
            </Button>
          </div>
        </TabsContent>

        {/* Onglet Marques & Produits */}
        <TabsContent value="brands" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Marques et produits associés</Label>
            <p className="text-sm text-muted-foreground">
              Ajoutez les marques et produits de votre entreprise pour une surveillance plus précise
            </p>

            <div className="flex space-x-2">
              <Input
                placeholder="Nom de la marque ou du produit"
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                disabled={isLoading}
              />
              <Button type="button" onClick={addBrand} disabled={!newBrand.trim() || isLoading}>
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </div>

            {brands.length > 0 && (
              <div className="mt-4 space-y-2">
                {brands.map((brand, index) => (
                  <div key={index} className="flex items-center justify-between rounded-md border p-2">
                    <span>{brand}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBrand(index)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={handlePrevTab}>
              Précédent
            </Button>
            <Button type="button" onClick={handleNextTab}>
              Suivant
            </Button>
          </div>
        </TabsContent>

        {/* Onglet Employés clés */}
        <TabsContent value="employees" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Employés clés</Label>
            <p className="text-sm text-muted-foreground">
              Ajoutez les noms des employés clés de votre entreprise (CEO, Community Manager, etc.)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input
                placeholder="Nom de l'employé"
                value={newEmployeeName}
                onChange={(e) => setNewEmployeeName(e.target.value)}
                disabled={isLoading}
              />
              <Input
                placeholder="Fonction (ex: CEO, Community Manager)"
                value={newEmployeeRole}
                onChange={(e) => setNewEmployeeRole(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button
              type="button"
              onClick={addEmployee}
              disabled={!newEmployeeName.trim() || !newEmployeeRole.trim() || isLoading}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter un employé clé
            </Button>

            {employees.length > 0 && (
              <div className="mt-4 space-y-2">
                {employees.map((employee, index) => (
                  <div key={index} className="flex items-center justify-between rounded-md border p-2">
                    <div>
                      <span className="font-medium">{employee.name}</span>
                      <span className="ml-2 text-sm text-muted-foreground">({employee.role})</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEmployee(index)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={handlePrevTab}>
              Précédent
            </Button>
            <Button type="button" onClick={handleNextTab}>
              Suivant
            </Button>
          </div>
        </TabsContent>

        {/* Onglet Réseaux sociaux */}
        <TabsContent value="social" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Réseaux sociaux */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label>Réseaux sociaux officiels</Label>
                  <p className="text-sm text-muted-foreground">
                    Ajoutez les comptes officiels de votre entreprise sur les réseaux sociaux
                  </p>

                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      placeholder="Plateforme (ex: Twitter, Facebook)"
                      value={newSocialPlatform}
                      onChange={(e) => setNewSocialPlatform(e.target.value)}
                      disabled={isLoading}
                    />
                    <Input
                      placeholder="Identifiant (@exemple)"
                      value={newSocialHandle}
                      onChange={(e) => setNewSocialHandle(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={addSocialMedia}
                    disabled={!newSocialPlatform.trim() || !newSocialHandle.trim() || isLoading}
                    className="w-full mt-2"
                  >
                    <LinkIcon className="h-4 w-4 mr-1" />
                    Ajouter un réseau social
                  </Button>
                </div>

                {socialMedia.length > 0 && (
                  <div className="space-y-2">
                    {socialMedia.map((social, index) => (
                      <div key={index} className="flex items-center justify-between rounded-md border p-2">
                        <div>
                          <span className="font-medium">{social.platform}</span>
                          <span className="ml-2 text-sm text-muted-foreground">{social.handle}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSocialMedia(index)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hashtags */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label>Hashtags liés</Label>
                  <p className="text-sm text-muted-foreground">
                    Ajoutez les hashtags associés à votre entreprise pour une meilleure surveillance
                  </p>

                  <div className="mt-2 flex space-x-2">
                    <Input
                      placeholder="#hashtag"
                      value={newHashtag}
                      onChange={(e) => setNewHashtag(e.target.value)}
                      disabled={isLoading}
                    />
                    <Button type="button" onClick={addHashtag} disabled={!newHashtag.trim() || isLoading}>
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                </div>

                {hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {hashtags.map((hashtag, index) => (
                      <div key={index} className="flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm">
                        <span>{hashtag}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 ml-1 p-0"
                          onClick={() => removeHashtag(index)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={handlePrevTab}>
              Précédent
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finalisation...
                </>
              ) : (
                "Terminer la configuration"
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  )
}
