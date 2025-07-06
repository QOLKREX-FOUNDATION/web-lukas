"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/admin.module.css";
import Image from "next/image";
import { FaCheck, FaTimes, FaEdit } from "react-icons/fa";

interface Ticket {
  _id: string;
  number: number;
  dni: string;
  status: string;
  voucherUrl: string;
  createdAt: string;
}

interface Usuario {
  name: string;
  lastname: string;
  email: string;
  address: string;
  phone: string;
}

export default function ValidarPendientesPage() {
  const [pendientes, setPendientes] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    fetchPendientes();
  }, []);

  const fetchPendientes = async () => {
    try {
      const res = await fetch("/api/admin/pendientes");
      const data = await res.json();

      setPendientes(data.pendientes);
    } catch (err) {
      console.error("Error cargando pendientes:", err);
    }
  };

  const abrirModal = async (ticket: Ticket) => {
    setSelected(ticket);
    try {
      const res = await fetch(`/api/usuarios?dni=${ticket.dni}`);
      const data = await res.json();
      setUsuario(data);
    } catch {
      console.error("No se pudo obtener datos del usuario");
    }
  };
  const [loading, setLoading] = useState(false);
  const validarTicket = async (aceptado: boolean) => {
    if (!selected) return;
    setLoading(true);
    const res = await fetch("/api/admin/validar-ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number: selected.number,
        dni: selected.dni,
        action: aceptado ? "confirm" : "reject",
      }),
    });

    const result = await res.json();
    if (res.ok) {
      alert(aceptado ? "Ticket validado." : "Ticket rechazado.");
      setSelected(null);
      setUsuario(null);
      fetchPendientes();
    } else {
      alert("Error: " + result.message);
    }
    setLoading(false);
  };

  return (
    <div className={styles.dashboardcontent}>
      <h2>Validar Pendientes</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Número</th>
            <th>DNI</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pendientes.map((t) => (
            <tr key={t._id}>
              <td>{t.number}</td>
              <td>{t.dni}</td>
              <td>{t.status}</td>
              <td>{new Date(t.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => abrirModal(t)}>
                  <FaEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && usuario && (
        <div className={styles.modal}>
          <div className={styles.modalcontent}>
            <h3>Validar Ticket #{selected.number}</h3>
            <p>
              <strong>DNI:</strong> {selected.dni}
            </p>
            <p>
              <strong>Nombre:</strong> {usuario.name} {usuario.lastname}
            </p>
            <p>
              <strong>Correo:</strong> {usuario.email}
            </p>
            <p>
              <strong>Teléfono:</strong> {usuario.phone}
            </p>

            {selected.voucherUrl && (
              <Image
                src={selected.voucherUrl}
                alt="Voucher"
                width={300}
                height={300}
              />
            )}

            <div className={styles.modalactions}>
              <button
                className={styles.success}
                onClick={() => validarTicket(true)}
                disabled={loading}
              >
                <FaCheck /> Validar
              </button>
              <button
                className={styles.danger}
                onClick={() => validarTicket(false)}
                disabled={loading}
              >
                <FaTimes /> Rechazar
              </button>
              <button
                className={styles.closemodal}
                onClick={() => setSelected(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
