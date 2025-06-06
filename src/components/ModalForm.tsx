// ✅ components/ModalForm.tsx
"use client";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md relative">
        <h2 className="text-2xl font-bold mb-4 text-[#a56d26]">
          Reservar número #{number}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            name="dni"
            placeholder="DNI"
            required
            className="w-full border px-3 py-2 rounded"
            onChange={handleChange}
          />
          <input
            name="name"
            placeholder="Nombres"
            required
            className="w-full border px-3 py-2 rounded"
            onChange={handleChange}
          />
          <input
            name="lastname"
            placeholder="Apellidos"
            required
            className="w-full border px-3 py-2 rounded"
            onChange={handleChange}
          />
          <input
            name="address"
            placeholder="Dirección"
            required
            className="w-full border px-3 py-2 rounded"
            onChange={handleChange}
          />
          <input
            name="phone"
            placeholder="Teléfono"
            required
            className="w-full border px-3 py-2 rounded"
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            required
            className="w-full border px-3 py-2 rounded"
            onChange={handleChange}
          />
          <div className="text-sm text-gray-700">
            Yapear o Plinear al número:{" "}
            <span className="font-bold">933294369</span>
          </div>
          <input
            type="file"
            name="voucher"
            accept="image/*"
            required
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700"
          >
            Enviar
          </button>
        </form>
        <button
          onClick={() => onClose(false)}
          className="mt-4 text-sm text-gray-500 underline block text-center w-full"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
