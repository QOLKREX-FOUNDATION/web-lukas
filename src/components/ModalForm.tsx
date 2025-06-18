// ✅ components/ModalForm.tsx
"use client";
import "@/styles/modal.css";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

interface Props {
  number: number;
  onClose: (wasSubmitted: boolean) => void;
}

type FormState = {
  dni: string;
  name: string;
  lastname: string;
  secondLastname: string;
  address: string;
  phone: string;
  email: string;
  voucher: File | null;
};

export default function ModalForm({ number, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("form-lukas");
      try {
        const parsed = saved ? JSON.parse(saved) : null;
        if (parsed) {
          return {
            ...parsed,
            voucher: null, // Nunca se guarda el File en localStorage
          };
        }
      } catch {
        // Si hay error al parsear, ignora y sigue
      }
    }
    return {
      dni: "",
      name: "",
      lastname: "",
      secondLastname: "",
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

    const fieldName = name as keyof typeof form;

    if (name === "voucher") {
      setForm((prev) => ({ ...prev, voucher: files?.[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [fieldName]: value }));
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
        <div className="modal-vertical-text">
          <span className="black">TICKET</span>
          {"   "}
          <span className="red">#{number}</span>
        </div>
        <div className="modal-left">
          <h2 className="modal-title">
            <span className="black">TICKET</span>
            {"   "}
            <span className="red">#{number}</span>
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              name="dni"
              placeholder="DNI"
              required
              value={form.dni}
              onChange={handleChange}
              inputMode="numeric"
              pattern="\d*"
              maxLength={8}
              className="medium-width"
            />

            <input
              name="name"
              placeholder="Nombres"
              required
              value={form.name}
              onChange={handleChange}
              pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
              inputMode="text"
              title="Solo letras y espacios"
              className="full-width"
            />
            <div className="lastname-row">
              <input
                name="lastname"
                placeholder="Primer Apellido"
                required
                value={form.lastname}
                onChange={handleChange}
                pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
                inputMode="text"
                className="half-width"
              />
              <input
                name="secondLastname"
                placeholder="Segundo Apellido"
                required
                value={form.secondLastname}
                onChange={handleChange}
                pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
                inputMode="text"
                className="half-width"
              />
            </div>
            <input
              name="address"
              placeholder="Dirección"
              required
              value={form.address}
              onChange={handleChange}
              className="full-width"
            />
            <input
              name="email"
              placeholder="Correo electrónico"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="full-width"
            />
            <input
              name="phone"
              placeholder="Teléfono"
              required
              value={form.phone}
              onChange={handleChange}
              inputMode="numeric"
              pattern="\d*"
              maxLength={9}
              className="medium-width"
            />
            <div className="yape-text">
              Yapear o Plinear al número: <strong>933294369</strong>
            </div>
            <input
              type="file"
              name="voucher"
              accept="image/*"
              required
              onChange={handleChange}
              className="file-input"
            />
            <button type="submit" className="submit-button">
              Enviar
            </button>
          </form>
          <div className="modal-close" onClick={() => onClose(false)}>
            Cerrar
          </div>
        </div>

        <div className="modal-right">
          <div className="modal-right-inner">
            <span>Sudamericano</span>
          </div>
          <img
            src="https://res.cloudinary.com/dktfsty7b/image/upload/v1748911635/icono1_cvcaa2.png"
            alt="Decoración"
          />
        </div>
      </div>
    </div>
  );
}
