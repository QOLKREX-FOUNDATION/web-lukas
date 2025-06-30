// ✅ app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";

import styles from "@/styles/admin.module.css";

interface Ticket {
  number: number;
  status: string;
  dni: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalVentas: 0,
    totalNumeros: 0,
    pendientes: 0,
  });

  const [ultimos, setUltimos] = useState<Ticket[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/estadisticas");
        const data = await res.json();
        setStats(data.stats);
        setUltimos(data.ultimos);
      } catch (err) {
        console.error("Error al obtener estadísticas:", err);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className={styles["dashboard-container"]}>
      <h1 className={styles.heading}>Dashboard</h1>
      <div className={styles["dashboard-stats"]}>
        <div className="stat-box">
          <h3>Total Ventas</h3>
          <p>S/ {stats.totalVentas}</p>
        </div>
        <div className={styles["stat-box"]}>
          <h3>Números Vendidos</h3>
          <p>{stats.totalNumeros}</p>
        </div>
        <div className={styles["stat-box"]}>
          <h3>Pendientes</h3>
          <p>{stats.pendientes}</p>
        </div>
      </div>

      <h2>Últimos Tickets Reservados</h2>
      <table className={styles["dashboard-table"]}>
        <thead>
          <tr>
            <th>#</th>
            <th>DNI</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {ultimos.map((t, i) => (
            <tr key={i}>
              <td>{t.number}</td>
              <td>{t.dni}</td>
              <td>{t.status}</td>
              <td>{new Date(t.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
