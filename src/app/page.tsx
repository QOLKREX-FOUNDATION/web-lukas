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

      const map: Record<number, "available" | "pending" | "confirmed"> = {};
      data.forEach(
        (item: {
          number: number;
          status: "available" | "pending" | "confirmed";
        }) => {
          map[item.number] = item.status;
        }
      );
      setNumberStatuses(map);
    };
    fetchStatuses();
  }, []);

  const handleNumberClick = (number: number) => {
    const status = numberStatuses[number];
    if (status === "confirmed") {
      alert("Número vendido.");
      return;
    } else if (status === "pending") {
      alert("Este número está pendiente de evaluación de compra.");
      return;
    }
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
            <p className="mb-2">
              <strong>Lukas Rojas</strong> es un niño esgrimista peruano que ha
              destacado en la categoría Sub-9. Dos veces campeon nacional
              consecutivo 2024 y 2025 en las modalidades de FLorete y Sable, en
              el 2024 representó al Perú en el Campeonato Sudamericano Infantil
              de Esgrima realizado en Curitiba - Brasil, donde obtuvo la medalla
              de <strong>bronce</strong> en la modalidad de sable masculino.
            </p>
            <p className="mb-2">
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
            <p className="mb-2">
              Su desempeño ha sido reconocido por la Federación Peruana de
              Esgrima, que lo considera parte del futuro prometedor de este
              deporte en el país.
            </p>
            <p className="mb-2">
              Con su dedicación y talento, <strong>Lukas Rojas</strong>{" "}
              representa una nueva generación de esgrimistas peruanos que están
              dejando huella en el ámbito deportivo regional.
            </p>
            <p className="mb-2">
              <strong>
                Gracias al esfuerzo constante, Lukas ha sido nuevamente
                convocado para representar al Perú, esta vez en el Campeonato
                Sudamericano de Esgrima 2025 que se realizará en Quito, Ecuador.
              </strong>
            </p>
            <p className="mb-2">
              Este nuevo reto deportivo implica costos significativos en
              pasajes, alojamiento, inscripción y equipamiento, por lo que se ha
              organizado esta rifa solidaria como una forma de recaudar fondos y
              seguir impulsando su camino como atleta.
            </p>
            <p>
              <strong>
                Agradecemos profundamente tu apoyo y confianza en este sueño.
              </strong>
            </p>
            <p>
              Cada aporte cuenta y cada número que adquieres es una muestra de
              que el deporte en el Perú tiene futuro, gracias a personas como
              tú. ¡Vamos juntos a Quito! 🤺
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
            El sorteo será en vivo por una video llamada 09/08/2025
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

        <footer className="footer">
          <p className="text-center text-sm text-gray-500 mt-8">
            © {new Date().getFullYear()} Qolkrex Foundation. Todos los derechos
            reservados.
          </p>
        </footer>
      </div>
    </main>
  );
}
