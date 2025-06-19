// ✅ pages/api/reserva.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongo";
import { sendEmail } from "@/lib/email";
import formidable, { File } from "formidable";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

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

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error al parsear el formulario:", err);
      return res.status(500).json({ message: "Error en el servidor" });
    }

    try {
      const {
        dni,
        name,
        lastname,
        secondLastname,
        address,
        phone,
        email,
        number,
      } = fields;

      const voucherFile = files.voucher as File;

      const cloudinaryResponse = await cloudinary.uploader.upload(
        voucherFile.filepath,
        { folder: "lukas-rifa" }
      );

      const { db } = await connectToDatabase();
      const reserva = {
        dni,
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
        to: email as string,
        subject: "Gracias por participar en la rifa de Lukas",
        html: `<p>Hola ${name} ${lastname},</p><p>Gracias por apoyar a Lukas en su carrera deportiva.</p><p>Reservaste el número <strong>#${number}</strong>.</p>`,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error general:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  const existing = await db.collection("rifa").findOne({ number });

  if (existing?.status === "confirmed") {
    return res
      .status(400)
      .json({
        message: "Este número ya está confirmado y no puede reservarse.",
      });
  }
}
