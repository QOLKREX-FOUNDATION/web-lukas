// lib/generateTicketImage.ts
import { createCanvas, loadImage } from "canvas";
import path from "path";
import fs from "fs";
import os from "os";

export async function generateTicketImage(
  number: number,
  name: string,
  lastname: string
): Promise<string> {
  const width = 650;
  const height = 400;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const background = await loadImage(
    path.join(process.cwd(), "public/img/ticket.png")
  );
  ctx.drawImage(background, 0, 0, width, height);

  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  // ======= TITULO: Ticket #123 =======
  const ticketText = "Ticket ";
  const numberText = `#${number}`;

  ctx.font = "bold 36px 'Times New Roman'";
  const ticketWidth = ctx.measureText(ticketText).width;
  const numberWidth = ctx.measureText(numberText).width;
  const totalWidth = ticketWidth + numberWidth;

  const startX = width / 2 - totalWidth / 2 + 20; // más a la derecha

  ctx.fillStyle = "#000";
  ctx.fillText(ticketText, startX, 60);

  ctx.fillStyle = "red";
  ctx.fillText(numberText, startX + ticketWidth - 5, 60); // menos espacio

  // ======= NOMBRE Y APELLIDO =======
  ctx.textAlign = "center";
  ctx.fillStyle = "#000";
  ctx.font = "28px 'Times New Roman'";
  ctx.fillText(`Nombre: ${name}`, width / 2, 130);
  ctx.fillText(`Apellido: ${lastname}`, width / 2, 180);

  // ======= MARCA DE AGUA =======
  ctx.font = "bold 16px 'Times New Roman'";
  ctx.globalAlpha = 0.1;
  ctx.fillText("Lukas Rojas - Espíritu de acero", width / 2, 260);
  ctx.globalAlpha = 1.0;

  // ======= EXPORTAR =======
  const buffer = canvas.toBuffer("image/png");
  const tempPath = path.join(os.tmpdir(), `ticket-${number}.png`);
  fs.writeFileSync(tempPath, buffer);

  return tempPath;
}
