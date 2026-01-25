/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { transporter } from "@/src/lib/mail";

export async function GET() {
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📨 TEST MAILTRAP: /api/test-mail");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  try {
    console.log("🔧 Vérification du transporteur SMTP...");
    await transporter.verify();
    console.log("✅ Transporteur valide !");

    console.log("📤 Envoi de l’email de test…");

    const info = await transporter.sendMail({
      from: '"SETICE Test" <no-reply@setice.edu>',
      to: process.env.SMTP_USER, // Mailtrap: on envoie à soi-même
      subject: "Test Mailtrap depuis Render",
      text: "Si vous recevez ceci, Mailtrap fonctionne parfaitement !",
    });

    console.log("✅ Email envoyé:", info.messageId);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return NextResponse.json({
      success: true,
      message: "Email de test envoyé avec succès !",
      messageId: info.messageId,
    });

  } catch (error: any) {
    console.error("❌ Erreur d’envoi Mailtrap:", error);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
