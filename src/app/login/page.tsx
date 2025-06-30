"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/login.module.css";
import Image from "next/image";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });

    const data = await res.json();
    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError(data?.error || "Credenciales incorrectas");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.loginBox}>
        <Image
          src="/img/logo1.png"
          alt="Decoración"
          width={120}
          height={120}
          className={styles.logo}
        />
        <h2 className={styles.titulo}>Ingreso de Administrador</h2>
        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>
            Entrar
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
