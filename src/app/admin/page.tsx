// src/app/admin/page.tsx
/*"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("admin_token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Aquí podrías validar fecha de expiración también
        router.replace("/admin/dashboard");
      } catch (err) {
        // Si el token es inválido, redirigir al login
        router.replace("/login");
      }
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
}*/

// src/app/admin/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return null;
}
