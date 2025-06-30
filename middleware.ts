// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const isLoginPage = req.nextUrl.pathname === "/login";

  if (token) {
    // Solo decodifica el JWT (no verifica la firma)
    const payload = token.split(".")[1];
    try {
      const decoded = JSON.parse(Buffer.from(payload, "base64").toString());
      // Si está en /login y ya tiene token, redirige al dashboard
      if (isLoginPage) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.next();
    } catch (error) {
      // Token inválido o mal formado
      console.error("Token inválido o mal formado:", error);
    }
  }

  // No autenticado, intenta entrar a /admin
  if (!isLoginPage && req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
