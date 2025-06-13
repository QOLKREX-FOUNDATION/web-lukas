// ✅ components/ModalForm.tsx
"use client";
import "@/styles/modal.css";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

interface Props {
  number: number;
  onClose: (wasSubmitted: boolean) => void;
}

export default function ModalForm({ number, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState(() => {
    // ✅ Recuperar del localStorage si existe
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("form-lukas");
      return saved
        ? JSON.parse(saved)
        : {
            dni: "",
            name: "",
            lastname: "",
            address: "",
            phone: "",
            email: "",
            voucher: null,
          };
    }
    return {
      dni: "",
      name: "",
      lastname: "",
      address: "",
      phone: "",
      email: "",
      voucher: null,
    };
  });

  // ✅ Guardar datos automáticamente en localStorage
  useEffect(() => {
    localStorage.setItem("form-lukas", JSON.stringify(form));
  }, [form]);

  // ✅ Detectar clic fuera del modal
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

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
      localStorage.removeItem("form-lukas");
      onClose(true);
    } catch (err) {
      console.error(err);
      alert("Error al enviar el formulario.");
      onClose(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <div className="modal-left">
          <h2 className="text-xl font-bold text-[#a56d26] mb-2">
            Ticket #{number}
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              name="dni"
              placeholder="DNI"
              required
              value={form.dni}
              onChange={handleChange}
            />
            <input
              name="name"
              placeholder="Nombres"
              required
              value={form.name}
              onChange={handleChange}
            />
            <input
              name="lastname"
              placeholder="Apellidos"
              required
              value={form.lastname}
              onChange={handleChange}
            />
            <input
              name="address"
              placeholder="Dirección"
              required
              value={form.address}
              onChange={handleChange}
            />
            <input
              name="phone"
              placeholder="Teléfono"
              required
              value={form.phone}
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              required
              value={form.email}
              onChange={handleChange}
            />
            <div className="text-sm text-gray-700 mb-1">
              Yapear o Plinear al número: <strong>933294369</strong>
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
          <div className="modal-close" onClick={() => onClose(false)}>
            Cerrar
          </div>
        </div>

        <div className="modal-right">
          <img
            src="https://res.cloudinary.com/dktfsty7b/image/upload/v1748911635/icono1_cvcaa2.png"
            alt="Decoración"
          />
        </div>
      </div>
    </div>
  );
}
