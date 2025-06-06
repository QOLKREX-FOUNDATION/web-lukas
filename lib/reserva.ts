// ✅ pages/api/reserva.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "./mongo";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { sendEmail } from "./email";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end("Método no permitido");

  const form = formidable({
    multiples: false,
    uploadDir: "./public/uploads",
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err)
      return res.status(500).json({ error: "Error al procesar el formulario" });

    const { name, lastname, dni, phone, email, address, number } = fields;
    const voucherFile = Array.isArray(files.voucher)
      ? files.voucher[0]
      : files.voucher;

    if (!voucherFile) {
      return res
        .status(400)
        .json({ error: "No se subió el archivo del voucher." });
    }

    const voucherPath = "/uploads/" + path.basename(voucherFile.filepath);

    const { db } = await connectToDatabase();
    await db.collection("reservas").updateOne(
      { dni },
      {
        $set: {
          name,
          lastname,
          dni,
          phone,
          email,
          address,
          number,
          voucher: voucherPath,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    const emailValue = Array.isArray(email) ? email[0] : email ?? "";

    if (!emailValue) {
      return res.status(400).json({ error: "Email inválido o ausente." });
    }

    await sendEmail({
      to: emailValue,
      subject: "Gracias por participar en la rifa de Lukas",
      html: `<p>Hola ${name} ${lastname},</p><p>Gracias por apoyar a Lukas en su carrera deportiva.</p><p>Reservaste el número <strong>#${number}</strong>.</p>`,
    });

    res.status(200).json({ ok: true });
  });
}
