import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongo";
import { sendEmail } from "../../../lib/email";
import { generateTicketImage } from "../../../lib/generateTicketImage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Método no permitido" });

  const { number, dni, action } = req.body;

  if (!number || !dni || !["confirm", "reject"].includes(action)) {
    return res.status(400).json({ error: "Parámetros inválidos" });
  }

  const { db } = await connectToDatabase();

  try {
    const numero = await db.collection("numeros").findOne({ number, dni });

    if (!numero) return res.status(404).json({ error: "Número no encontrado" });

    const usuario = await db.collection("usuarios").findOne({ dni });

    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });

    if (action === "confirm") {
      await db
        .collection("numeros")
        .updateOne(
          { number, dni },
          { $set: { status: "confirmed", fec_confirm: new Date() } }
        );
      const imagePath = await generateTicketImage(
        number,
        usuario.name,
        usuario.lastname
      );
      // Aquí podrías generar la imagen del ticket si la tienes y enviar el correo
      await sendEmail({
        to: usuario.email,
        subject: "¡Compra confirmada!",
        html: `
    <p>Hola ${usuario.name} ${usuario.lastname},</p>
    <p>Tu número <strong>#${number}</strong> ha sido confirmado exitosamente.</p>
    <p>Gracias por apoyar a Lukas en su participación en el <strong>Sudamericano Infantil de Esgrima Quito - Ecuador</strong>.</p>
    <p>¡Mucha suerte!</p>
  `,
        attachments: [
          {
            filename: `ticket-${number}.png`,
            path: imagePath,
            contentType: "image/png",
          },
        ],
      });

      return res.status(200).json({ message: "Confirmado y correo enviado" });
    } else {
      await db.collection("numeros").deleteOne({ number, dni });

      await sendEmail({
        to: usuario.email,
        subject: "Voucher inválido",
        html: `
          <p>Hola ${usuario.name} ${usuario.lastname},</p>
          <p>Tu depósito para el número <strong>#${number}</strong> no fue válido y ha sido rechazado.</p>
          <p>Por favor vuelve a intentarlo si deseas participar.</p>
        `,
      });

      return res.status(200).json({ message: "Rechazado y eliminado" });
    }
  } catch (err) {
    console.error("❌ Error al validar ticket:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
