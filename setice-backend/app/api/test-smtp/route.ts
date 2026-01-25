/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

// Récupération des variables d'environnement
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SMTP_FROM = process.env.SMTP_FROM;
const FRONTEND_URL = process.env.FRONTEND_URL;

// Vérification
if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY manquant !");
if (!SMTP_FROM) throw new Error("SMTP_FROM manquant !");
if (!FRONTEND_URL) throw new Error("FRONTEND_URL manquant !");

// Initialisation SendGrid
sgMail.setApiKey(SENDGRID_API_KEY);

export async function GET() {
  console.log("📨 TEST SENDGRID: /api/test-mail");

  try {
    // Email de test : remplace par l'email réel de l'étudiant
    const recipientEmail = "etudiant@gmail.com";

    const msg = {
      to: recipientEmail,
      from: SMTP_FROM!, // l'adresse vérifiée dans SendGrid
      subject: "Test Email SETICE via SendGrid",
      text: "Si vous recevez ceci, l’envoi SendGrid fonctionne parfaitement !",
      html: `
        <p>Bonjour,</p>
        <p>Si vous recevez cet email, SendGrid fonctionne correctement depuis Render !</p>
      `,
    };

    const response = await sgMail.send(msg);

    console.log("✅ Email envoyé via SendGrid ! Status:", response[0].statusCode);

    return NextResponse.json({
      success: true,
      message: `Email de test envoyé à ${recipientEmail} via SendGrid !`,
      status: response[0].statusCode,
    });

  } catch (error: any) {
    console.error("❌ Erreur d’envoi SendGrid:", error.message || error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
