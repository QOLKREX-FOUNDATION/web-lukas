// ✅ app/page.tsx — Página principal (HOME)
"use client";
import "@/styles/home.css";
import { useState, useEffect } from "react";
import ModalForm from "@/components/ModalForm";
import NumberGrid from "@/components/NumberGrid";

export default function HomePage() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [numberStatuses, setNumberStatuses] = useState<
    Record<number, "available" | "pending" | "confirmed">
  >({});

  useEffect(() => {
    const fetchStatuses = async () => {
      const res = await fetch("/api/numeros");
      const data = await res.json();

      type NumberItem = {
        number: number;
        status: "available" | "pending" | "confirmed";
      };

      const map: Record<number, "available" | "pending" | "confirmed"> = {};
      (data as NumberItem[]).forEach((item) => {
        map[item.number] = item.status;
      });

      setNumberStatuses(map);
    };

    fetchStatuses();
  }, []);

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
    <main className="home-wrapper">
      <div className="home-content">
        <section className="home-section">
          {/* Descripción de Lukas */}
          <div className="lukas-bio">
            <p className="mb-1">
              <strong>Lukas Rojas</strong> es un niño esgrimista peruano que ha
              destacado en la categoría Sub-9. En 2024, representó al Perú en el
              Campeonato Sudamericano Infantil de Esgrima realizado en Curitiba
              - Brasil, donde obtuvo la medalla de <strong>bronce</strong> en la
              modalidad de sable masculino.
            </p>
            <p className="mb-1">
              Además de su participación en competencias internacionales, Lukas
              comparte su pasión por la esgrima a través de su cuenta de
              <a
                href="https://www.tiktok.com/@lukasrojas.leiva"
                target="_blank"
                rel="noopener noreferrer"
                className="tiktok-link"
              >
                TikTok
              </a>
              , donde publica videos de sus entrenamientos y competencias.
            </p>
            <p className="mb-1">
              Su desempeño ha sido reconocido por la Federación Peruana de
              Esgrima, que lo considera parte del futuro prometedor de este
              deporte en el país.
            </p>
            <p>
              Con su dedicación y talento, <strong>Lukas Rojas</strong>{" "}
              representa una nueva generación de esgrimistas peruanos que están
              dejando huella en el ámbito deportivo regional.
            </p>
          </div>

          {/* Grilla de números */}
          <div className="rifa-grid">
            <NumberGrid numbers={numbers} onSelect={handleNumberClick} />
          </div>

          {/* Precios */}
          <div className="rifa-precios">
            <p>1 número S/. 15.00</p>
            <p>3 números S/. 40.00</p>
          </div>

          {/* Sorteo info */}
          <p className="rifa-info">
            El sorteo será en vivo por una video llamada 12/07/2025
          </p>

          {/* Enlace a premios */}
          <div className="rifa-link-container">
            <a href="/premios" className="rifa-link">
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
