// ✅ components/ModalForm.tsx
"use client";
import "@/styles/modal.css";
import React, { useState } from "react";
import axios from "axios";

interface Props {
  number: number;
  onClose: (wasSubmitted: boolean) => void;
}

export default function ModalForm({ number, onClose }: Props) {
  const [form, setForm] = useState({
    dni: "",
    name: "",
    lastname: "",
    address: "",
    phone: "",
    email: "",
    voucher: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "voucher") {
      setForm((prev) => ({ ...prev, voucher: files?.[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value as string | Blob);
    });
    formData.append("number", number.toString());

    try {
      await axios.post("/api/reserva", formData);
      alert("¡Gracias por participar! En breve confirmaremos tu pago.");
      onClose(true);
    } catch (err) {
      console.error(err);
      alert("Error al enviar el formulario.");
      onClose(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Formulario lado izquierdo */}
        <div className="modal-left">
          <h2 className="text-xl font-bold text-[#a56d26] mb-2">
            Reservar número #{number}
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              name="dni"
              placeholder="DNI"
              required
              onChange={handleChange}
            />
            <input
              name="name"
              placeholder="Nombres"
              required
              onChange={handleChange}
            />
            <input
              name="lastname"
              placeholder="Apellidos"
              required
              onChange={handleChange}
            />
            <input
              name="address"
              placeholder="Dirección"
              required
              onChange={handleChange}
            />
            <input
              name="phone"
              placeholder="Teléfono"
              required
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              required
              onChange={handleChange}
            />
            <div className="text-sm text-gray-700 mb-1">
              Yapear o Plinear al número:{" "}
              <span className="font-bold">933294369</span>
            </div>
            <input
              type="file"
              name="voucher"
              accept="image/*"
              required
              onChange={handleChange}
            />
            <button type="submit">Enviar</button>
          </form>
        </div>

        {/* Imagen caricatura lado derecho */}
        <div className="modal-right">
          <img
            src="https://res.cloudinary.com/dktfsty7b/image/upload/v1748911635/icono1_cvcaa2.png"
            alt="Lukas caricatura"
          />
        </div>

        {/* Botón cerrar */}
        <span className="modal-close" onClick={() => onClose(false)}>
          Cerrar
        </span>
      </div>
    </div>
  );
}
