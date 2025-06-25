"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdmin } from "../../../../utils/auth";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("validar");

  useEffect(() => {
    if (!isAdmin()) {
      router.push("/admin/login");
    }
  }, [router]);

  return (
    <div className="dashboard">
      <h1>Panel de Administración</h1>
      <div className="tabs">
        <button onClick={() => setActiveTab("validar")}>Validar Compras</button>
        <button onClick={() => setActiveTab("crear")}>Crear Rifa</button>
        {/* futuras: Estadísticas, Usuarios */}
      </div>

      {activeTab === "validar" && <ValidarCompras />}
      {activeTab === "crear" && <CrearRifa />}
    </div>
  );
}

function ValidarCompras() {
  return (
    <div>
      <h2>Validar y Confirmar Compras</h2>
      {/* Aquí va la tabla con usuarios y botón para confirmar */}
    </div>
  );
}

function CrearRifa() {
  const [titulo, setTitulo] = useState("");

  const crearRifa = async () => {
    const res = await fetch("/api/crear-rifa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo }),
    });

    //const data = await res.json();
    if (res.ok) {
      alert("Rifa creada con éxito");
      setTitulo("");
    } else {
      alert("Error al crear rifa");
    }
  };

  return (
    <div>
      <h2>Crear Nueva Rifa</h2>
      <input
        type="text"
        placeholder="Título de la rifa"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <button onClick={crearRifa}>Crear</button>
    </div>
  );
}
