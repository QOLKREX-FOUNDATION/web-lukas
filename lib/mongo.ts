import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

// ✅ Extiende el tipo de globalThis para que TypeScript no marque error
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Solo una instancia del cliente en desarrollo
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db(); // usa el nombre de DB que venga en el URI
  return { client, db };
}
