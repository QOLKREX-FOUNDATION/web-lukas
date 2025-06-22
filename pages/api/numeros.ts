// ✅ Crea este archivo
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db } = await connectToDatabase();

  const lastRifa = await db
    .collection("rifa")
    .find({})
    .sort({ date: -1 })
    .limit(1)
    .toArray();

  const id_rifa = lastRifa[0]?.id_rifa;

  if (!id_rifa) {
    return res.status(500).json({ error: "No hay rifas disponibles." });
  }

  const numeros = await db
    .collection("numeros")
    .find({ id_rifa })
    .project({ number: 1, status: 1, _id: 0 })
    .toArray();

  res.status(200).json(numeros);

  /* if (req.method === "GET") {
    const { db } = await connectToDatabase();
    const data = await db.collection("reservas").find({}).toArray();
    res.status(200).json(data);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }*/
}
