import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Cette fonction peut être marquée comme `async` si vous utilisez `await` à l'intérieur
export function middleware(request: NextRequest) {
  // Pour une implémentation réelle, vous vérifieriez ici si l'utilisateur est authentifié
  // Pour cette démo, nous allons simplement simuler une authentification

  // Simuler un utilisateur connecté pour la démo
  const isAuthenticated = true

  // Si l'utilisateur n'est pas authentifié et essaie d'accéder à une page protégée
  if (
    !isAuthenticated &&
    (request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/mentions") ||
      request.nextUrl.pathname.startsWith("/analyses") ||
      request.nextUrl.pathname.startsWith("/sources") ||
      request.nextUrl.pathname.startsWith("/rapports") ||
      request.nextUrl.pathname.startsWith("/settings") ||
      request.nextUrl.pathname.startsWith("/profile"))
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Si l'utilisateur est déjà authentifié et essaie d'accéder aux pages d'authentification
  if (isAuthenticated && request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configurer le middleware pour s'exécuter sur les routes spécifiées
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/mentions/:path*",
    "/analyses/:path*",
    "/sources/:path*",
    "/rapports/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/auth/:path*",
    "/",
  ],
}
