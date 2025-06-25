import { connectToDatabase } from "../../lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { titulo } = req.body;
  const { db } = await connectToDatabase();

  const nuevaRifa = {
    id_rifa: Date.now(), // número único
    titulo,
    date: new Date(),
  };

  await db.collection("rifa").insertOne(nuevaRifa);
  res.status(200).json({ success: true });
}
