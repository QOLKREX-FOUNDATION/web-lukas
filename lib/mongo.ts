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

// ✅ lib/email.ts
import nodemailer from "nodemailer";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Rifa Lukas" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
