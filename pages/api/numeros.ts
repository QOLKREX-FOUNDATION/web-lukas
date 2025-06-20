// ✅ Crea este archivo
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { db } = await connectToDatabase();
    const data = await db.collection("reservas").find({}).toArray();
    res.status(200).json(data);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
