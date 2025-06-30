// src/app/admin/layout.tsx
"use client";
import styles from "@/styles/admin.module.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import {
  FaTachometerAlt,
  FaUserCheck,
  FaUsers,
  FaPlusSquare,
  FaTools,
  FaSignOutAlt,
} from "react-icons/fa";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/login");
  };

  return (
    <div className={styles.adminlayout}>
      <aside className={styles.sidebar}>
        <Image
          src="/img/logo1.png"
          alt="Logo"
          width={100}
          height={100}
          className={styles.logoimg}
        />

        <nav className={styles.sidebarnav}>
          <Link href="/admin/dashboard">
            <FaTachometerAlt />
            Dashboard
          </Link>
          <Link href="/admin/dashboard/pendientes">
            <FaUserCheck />
            Validar Pendientes
          </Link>
          <Link href="/admin/usuarios">
            <FaUsers />
            Usuarios
          </Link>
          <Link href="/admin/crear">
            <FaPlusSquare />
            Crear Rifa
          </Link>
          <Link href="/admin/pagina">
            <FaTools />
            Gestión de Página
          </Link>
        </nav>
        <button className={styles.button} onClick={handleLogout}>
          <FaSignOutAlt style={{ marginRight: "0.5rem" }} />
          Logout
        </button>
      </aside>
      <main className={styles.admincontent}>{children}</main>;
    </div>
  );
}
