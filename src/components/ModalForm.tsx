"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import "@/styles/modal.css";

interface Props {
  number: number;
  onClose: (wasSubmitted: boolean) => void;
}

interface FormState {
  dni: string;
  name: string;
  lastname: string;
  secondLastname: string;
  address: string;
  phone: string;
  email: string;
  voucher: File | null;
}

interface AxiosErrorResponse {
  response: {
    data: {
      error: string;
    };
  };
}

export default function ModalForm({ number, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoComplete, setIsAutoComplete] = useState(false);
  const [form, setForm] = useState<FormState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("form-lukas");
      return saved
        ? JSON.parse(saved)
        : {
            dni: "",
            name: "",
            lastname: "",
            secondLastname: "",
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
      secondLastname: "",
      address: "",
      phone: "",
      email: "",
      voucher: null,
    };
  });

  useEffect(() => {
    localStorage.setItem("form-lukas", JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const [emailInterno, setEmailInterno] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      if (form.dni.length === 8) {
        try {
          const res = await fetch(`/api/usuarios?dni=${form.dni}`);
          const data = await res.json();
          if (data?.name && data?.lastname && data?.email) {
            setEmailInterno(data.email);
            setForm((prev) => ({
              ...prev,
              name: data.name,
              lastname: data.lastname,
              secondLastname: "Protected data",
              address: "Protected data",
              phone: "Protected data",
              email: "Protected data",
            }));
            // Si email existe, bloqueamos campos

            setIsAutoComplete(true);
          } else {
            setIsAutoComplete(false);
            setEmailInterno(""); // limpia el dato email por si acaso
          }
        } catch (err) {
          console.error("No se encontró el DNI:", err);
        }
      }
    };

    fetchUser();
  }, [form.dni]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    const fieldName = name as keyof FormState;

    if (name === "voucher") {
      setForm((prev) => ({ ...prev, voucher: files?.[0] || null }));
    } else {
      setForm((prev) => ({
        ...prev,
        [fieldName]: value.toUpperCase(),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (form.voucher && form.voucher.size > 2 * 1024 * 1024) {
      alert("El archivo excede los 2MB");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    // ✅ Si es auto-completado, enviar los datos como están aunque no estén visibles

    formData.append("number", number.toString());
    formData.append("dni", form.dni);

    if (isAutoComplete) {
      formData.append("name", form.name);
      formData.append("lastname", form.lastname);
      formData.append("secondLastname", form.secondLastname);
      formData.append("address", form.address);
      formData.append("phone", form.phone);
      formData.append("email", emailInterno); // 👈 se usa el email oculto
    } else {
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value as string | Blob);
        }
      });
    }

    if (form.voucher) {
      formData.append("voucher", form.voucher);
    }

    formData.append("number", number.toString());

    try {
      await axios.post("/api/reserva", formData);
      alert("¡Gracias por participar! En breve confirmaremos tu pago.");
      localStorage.removeItem("form-lukas");

      setForm({
        dni: "",
        name: "",
        lastname: "",
        secondLastname: "",
        address: "",
        phone: "",
        email: "",
        voucher: null,
      });

      onClose(true);
    } catch (err: unknown) {
      console.error("Error en front al llamar a la API:", err);
      let mensaje = "Error al enviar el formulario";

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as AxiosErrorResponse).response?.data?.error === "string"
      ) {
        const typedErr = err as AxiosErrorResponse;
        mensaje =
          "Error al enviar el formulario: " + typedErr.response.data.error;
      } else if (err instanceof Error) {
        mensaje += ": " + err.message;
      }

      alert(mensaje);
      onClose(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <div className="modal-vertical-text">
          <span className="black">TICKET</span>{" "}
          <span className="red">#{number}</span>
        </div>

        <div className="modal-left">
          <h2 className="modal-title">
            <span className="black">TICKET</span>{" "}
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

            {isAutoComplete && (
              <div style={{ color: "#2563eb", fontSize: "0.85rem" }}>
                Ya eres usuario de nuestras Rifas
              </div>
            )}

            <input
              name="name"
              placeholder="Nombres"
              required
              value={form.name}
              onChange={handleChange}
              disabled={isAutoComplete}
              pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
              inputMode="text"
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
                disabled={isAutoComplete}
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
                disabled={isAutoComplete}
              />
            </div>

            <input
              name="address"
              placeholder="Dirección"
              required
              value={form.address}
              onChange={handleChange}
              className="full-width"
              disabled={isAutoComplete}
            />

            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              required
              value={form.email}
              onChange={handleChange}
              className="full-width"
              disabled={isAutoComplete}
            />

            <input
              name="phone"
              placeholder="Teléfono"
              required
              value={form.phone}
              onChange={handleChange}
              inputMode="numeric"
              pattern="\d{9}"
              maxLength={9}
              className="medium-width"
              disabled={isAutoComplete}
            />
            {isAutoComplete && (
              <div style={{ color: "#2563eb", fontSize: "0.8rem" }}>
                Solo adjunte la imagen del depósito
              </div>
            )}
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
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar"}
            </button>
          </form>

          <div className="modal-close" onClick={() => onClose(false)}>
            Cerrar
          </div>
        </div>

        <div className="modal-right">
          <div className="modal-right-inner">
            <span>Sudamericano Infatil</span>
          </div>
          <div className="modal-quito">
            <span>de Esgrima - Quito 2025</span>
          </div>
          <Image
            src="https://res.cloudinary.com/dktfsty7b/image/upload/v1748911635/icono1_cvcaa2.png"
            alt="Decoración"
            width={160}
            height={160}
          />
        </div>
      </div>
    </div>
  );
}
