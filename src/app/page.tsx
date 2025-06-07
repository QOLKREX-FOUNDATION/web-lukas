// ✅ app/page.tsx — Página principal (HOME)
"use client";

import { useState } from "react";
import ModalForm from "@/components/ModalForm";
//import Header from "@/components/Header";
import NumberGrid from "@/components/NumberGrid";

export default function HomePage() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [numberStatuses, setNumberStatuses] = useState<
    Record<number, "available" | "pending" | "confirmed">
  >({});

  const handleNumberClick = (number: number) => {
    setSelectedNumber(number);
  };

  const closeModal = (wasSubmitted: boolean) => {
    if (selectedNumber !== null && wasSubmitted) {
      setNumberStatuses((prev) => ({ ...prev, [selectedNumber]: "pending" }));
    }
    setSelectedNumber(null);
  };

  const numbers = Array.from({ length: 100 }, (_, i) => {
    const number = i + 1;
    return {
      number,
      status: numberStatuses[number] || "available",
    };
  });

  return (
    <main
      className="min-h-screen bg-center bg-no-repeat text-white py-25 bg-white"
      style={{
        backgroundImage:
          "url(https://res.cloudinary.com/dktfsty7b/image/upload/v1749165282/1_tujkvp.png)",
      }}
    >
      <div className="min-h-screen px-2 pt-1 bg-opacity-50">
        <section className="max-w-4xl mx-auto text-center mt-200">
          {/* Título superpuesto */}

          {/* Grilla de números */}
          <NumberGrid numbers={numbers} onSelect={handleNumberClick} />

          {/* Precios */}
          <div className="text-blue-400 font-bold text-lg mt-0">
            <p>1 número S/. 15.00</p>
            <p>3 números S/. 40.00</p>
          </div>

          {/* Sorteo info */}
          <p className="text-gray-500 mt-2 italic">
            El sorteo será en vivo por una video llamada 12/07/2025
          </p>

          {/* Enlace a premios */}
          <div className="mt-2">
            <a
              href="/premios"
              className="text-blue-400 font-extrabold text-2xl hover:underline cursor-pointer"
            >
              PREMIOS
            </a>
          </div>
        </section>

        {selectedNumber !== null && (
          <ModalForm
            number={selectedNumber}
            onClose={(wasSubmitted) => closeModal(wasSubmitted)}
          />
        )}
      </div>
    </main>
  );
}
