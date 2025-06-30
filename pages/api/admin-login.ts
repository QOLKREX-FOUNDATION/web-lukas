// src/pages/api/admin-login.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongo";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, password } = req.body;

  if (req.method !== "POST") return res.status(405).end();

  const { db } = await connectToDatabase();
  const user = await db.collection("admins").findOne({ username });

  if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Contraseña incorrecta" });

  const token = jwt.sign({ username }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  res.setHeader(
    "Set-Cookie",
    serialize("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 900, // 15 minutos
      path: "/",
      sameSite: "lax",
    })
  );
  return res.status(200).json({ token });
  //return res.status(200).json({ message: "Login exitoso" });
}
