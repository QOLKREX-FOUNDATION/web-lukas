// ✅ Crea este archivo
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db } = await connectToDatabase();
  const data = await db.collection("rifa").find({}).toArray();
  res.status(200).json(data);
}
