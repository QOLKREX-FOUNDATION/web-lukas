// ✅ pages/api/usuarios.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { dni } = req.query;

  if (!dni || typeof dni !== "string") {
    return res.status(400).json({ error: "DNI no válido" });
  }

  const { db } = await connectToDatabase();
  const user = await db.collection("usuarios").findOne({ dni });

  if (!user) {
    return res.status(404).json({ error: "No encontrado" });
  }

  // Solo devolvemos nombre y apellido
  res.status(200).json({
    name: user.name,
    lastname: user.lastname,
    secondLastname: user.secondLastname ?? "",
    address: user.address ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
  });
}
