// ✅ pages/api/reserva.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongo";
import { sendEmail } from "../../lib/email";

import formidable from "formidable";
import type { Files, Fields } from "formidable";

import { v2 as cloudinary } from "cloudinary";

// Deshabilita el body parser interno de Next.js para manejar multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const form = new formidable.IncomingForm({ multiples: false });

  form.parse(req, async (err, fields: Fields, files: Files) => {
    if (err) {
      console.error("Error al parsear el formulario:", err);
      return res.status(500).json({ message: "Error en el servidor" });
    }

    try {
      const getSafeString = (field: unknown): string => {
        if (Array.isArray(field)) return field[0];
        if (typeof field === "string") return field;
        return "";
      };
      const dni = getSafeString(fields.dni);
      const name = getSafeString(fields.name);
      const lastname = getSafeString(fields.lastname);
      const secondLastname = getSafeString(fields.secondLastname);
      const address = getSafeString(fields.address);
      const phone = getSafeString(fields.phone);
      const email = getSafeString(fields.email);
      const number = Number(getSafeString(fields.number));
      const voucherFile = Array.isArray(files.voucher)
        ? files.voucher[0]
        : files.voucher;

      if (!voucherFile || !voucherFile.filepath) {
        return res
          .status(400)
          .json({ message: "No se subió el archivo del voucher." });
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(
        voucherFile.filepath,
        { folder: "lukas-rifa" }
      );

      const { db } = await connectToDatabase();

      const existing = await db.collection("rifa").findOne({ number });

      if (existing?.status === "confirmed") {
        return res.status(400).json({
          message: "Este número ya está confirmado y no puede reservarse.",
        });
      }

      const reserva = {
        dni: Number(number),
        name,
        lastname,
        secondLastname,
        address,
        phone,
        email,
        number: Number(number),
        voucherUrl: cloudinaryResponse.secure_url,
        status: "pendiente",
        createdAt: new Date(),
      };

      await db.collection("reservas").insertOne(reserva);

      await sendEmail({
        to: email,
        subject: "Gracias por participar en la rifa de Lukas",
        html: `<p>Hola ${name} ${lastname},</p><p>Gracias por apoyar a Lukas en su carrera deportiva.</p><p>Reservaste el número <strong>#${number}</strong>.</p>`,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("❌ Error general:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
}
