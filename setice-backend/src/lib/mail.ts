// lib/mail.ts
import sgMail from "@sendgrid/mail";

export async function sendActivationEmail(email: string, tempPassword: string,  token?: string) {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY!;
  const SMTP_FROM = process.env.SMTP_FROM!;
  const FRONTEND_URL = process.env.FRONTEND_URL!;

  sgMail.setApiKey(SENDGRID_API_KEY);

  const activationLink = `${FRONTEND_URL}/activate?token=${token}`;

  const msg = {
    to: email,
    from: SMTP_FROM,
    subject: "Activation de votre compte SETICE",
    html: `
      <p>Bonjour,</p>
      <p>Votre compte a été créé avec succès.</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mot de passe temporaire:</strong> ${tempPassword}</p>
      <p>Cliquez sur le lien pour activer votre compte et choisir votre mot de passe :</p>
      <a href="${activationLink}">Activer mon compte</a>
    `,
  };

  try {
    const response = await sgMail.send(msg);
    console.log(`✅ Email envoyé à ${email} via SendGrid ! Status: ${response[0].statusCode}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Erreur SendGrid:", error.message || error);
    throw error;
  }
}
