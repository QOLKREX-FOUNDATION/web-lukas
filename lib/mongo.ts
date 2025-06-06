// ✅ lib/mongo.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
let client: MongoClient;

export async function connectToDatabase() {
  if (!client) client = new MongoClient(uri);
  await client.connect();
  const db = client.db("rifaLukas");
  return { db };
}
