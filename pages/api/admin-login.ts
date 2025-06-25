import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    // token básico
    return res.status(200).json({ token: "lukas-admin-token" });
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
