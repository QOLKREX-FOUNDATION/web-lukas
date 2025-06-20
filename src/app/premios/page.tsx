// ✅ app/premios/page.tsx — Página de Premios

import Image from "next/image";

export default function PremiosPage() {
  return (
    <main className="min-h-screen bg-[#fefaf5] px-4 py-6 text-center">
      <section className="max-w-3xl mx-auto">
        {/* Imagen completa de los premios */}
        <Image
          src="https://res.cloudinary.com/dktfsty7b/image/upload/v1750386420/2-1_hw83xl.png"
          alt="Premios"
          width={1200}
          height={700}
          className="rounded-lg w-full shadow-md mb-6"
        />

        {/* Lista textual (editable desde backend en futuro) */}
        {/* <h2 className="text-3xl font-bold text-[#77cce6] mb-4">PREMIOS</h2>
        <ul className="text-lg font-medium text-gray-800 mb-10 space-y-2 text-left">
          <li>🏨 1 noche de hospedaje en Lunahuaná para 4 personas</li>
          <li>🍷 1 botella de vino + canasta de snacks</li>
          <li>💆‍♀️ Masaje descontracturante + aceites naturales</li>
          <li>🏋️‍♂️ Kit deportivo: tomatodo + toalla + bandas</li>
          <li>🍽️ Cena para dos personas en restaurante criollo</li>
          <li>🍫 Pack dulce: bombones + galletas artesanales</li>
        </ul>

        <p className="text-xl text-[#a56d26] font-bold">
          ¡Gracias por tu colaboración!
        </p> */}
      </section>
    </main>
  );
}
