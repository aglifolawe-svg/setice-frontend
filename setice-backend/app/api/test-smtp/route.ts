/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Création du transporter SMTP
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  secure: false, // true pour port 465
});

export async function GET() {
  console.log("📨 TEST MAILTRAP: /api/test-mail");

  try {
    console.log("🔧 Vérification du transporteur SMTP...");
    await transporter.verify();
    console.log("✅ Transporteur valide !");

    console.log("📤 Envoi de l’email de test…");

    const info = await transporter.sendMail({
      from: '"SETICE Test" <no-reply@setice.edu>',
      to: process.env.SMTP_TO, // ✅ ici, inbox Mailtrap
      subject: "Test Mailtrap depuis Render",
      text: "Si vous recevez ceci, Mailtrap fonctionne parfaitement !",
    });

    console.log("✅ Email envoyé:", info.messageId);

    return NextResponse.json({
      success: true,
      message: "Email de test envoyé avec succès !",
      messageId: info.messageId,
    });

  } catch (error: any) {
    console.error("❌ Erreur d’envoi Mailtrap:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
