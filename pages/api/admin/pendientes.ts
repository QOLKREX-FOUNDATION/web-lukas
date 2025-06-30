import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Método no permitido" });

  const { db } = await connectToDatabase();

  try {
    const pendientes = await db
      .collection("numeros")
      .find({ status: "pending" })
      .sort({ fec_buy: -1 })
      .toArray();

    res.status(200).json({ pendientes });
  } catch (err) {
    console.error("❌ Error al obtener pendientes:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
