import { redirect } from "next/navigation"

export default function HomePage() {
  // Rediriger vers la page de connexion
  redirect("/auth/login")
}
