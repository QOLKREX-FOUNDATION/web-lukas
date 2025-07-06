// ✅ lib/email.ts
import nodemailer from "nodemailer";

export async function sendEmail({
  to,
  subject,
  html,
  attachments = [],
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: any[];
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
    attachments,
  });
}
