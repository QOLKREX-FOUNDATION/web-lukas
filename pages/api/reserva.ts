// ✅ pages/api/reserva.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongo";
import { sendEmail } from "../../lib/email";
import { IncomingForm } from "formidable";
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

  const form = new IncomingForm({ multiples: false });

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

      // ✅ 1. Subir a Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(
        voucherFile.filepath,
        { folder: "lukas-rifa" }
      );

      // ✅ 2. Conectarse a DB
      const { db } = await connectToDatabase();

      // ✅ 3. Buscar la rifa más reciente
      const lastRifa = await db
        .collection("rifa")
        .find({})
        .sort({ date: -1 })
        .limit(1)
        .toArray();

      if (!lastRifa[0]) {
        return res.status(500).json({ error: "No hay una rifa activa." });
      }
      const id_rifa = lastRifa[0].id_rifa;

      // ✅ 4. Verificar si el número ya fue reservado
      const existing = await db
        .collection("numeros")
        .findOne({ number, id_rifa });
      if (
        existing?.status &&
        ["confirmed", "pending"].includes(existing.status)
      ) {
        return res
          .status(400)
          .json({ message: "Este número ya está reservado o confirmado." });
      }

      // ✅ 5. Guardar usuario solo si no existe
      const userExists = await db.collection("usuarios").findOne({ dni });

      if (!userExists) {
        await db.collection("usuarios").insertOne({
          dni,
          name,
          lastname,
          secondLastname,
          address,
          phone,
          email,
          voucherUrl: cloudinaryResponse.secure_url,
          createdAt: new Date(),
        });
      }

      // ✅ 6. Guardar el número comprado
      await db.collection("numeros").insertOne({
        dni,
        number,
        id_rifa,
        status: "pending",
        fec_buy: new Date(),
      });

      if (!email) {
        return res
          .status(400)
          .json({
            message: "Falta el correo electrónico para enviar confirmación.",
          });
      }
      // ✅ 7. Enviar correo
      await sendEmail({
        to: email,
        subject: "Gracias por participar en la rifa de Lukas",
        html: `<p>Hola ${name} ${lastname},</p><p>Gracias por apoyar a Lukas en su carrera deportiva.</p><p>Reservaste el número <strong>#${number}</strong>.</p>`,
      });

      res.status(200).json({ success: true });
    } catch (err) {
      console.error("❌ Error general:", err);
      if (err instanceof Error) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(500).json({ error: "Error interno desconocido" });
      }
    }
  });
}
