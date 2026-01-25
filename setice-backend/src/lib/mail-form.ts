import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SMTP_FROM = process.env.SMTP_FROM;
const FRONTEND_URL = process.env.FRONTEND_URL;

// Vérification des variables d'environnement
if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY manquant !");
if (!SMTP_FROM) throw new Error("SMTP_FROM manquant !");
if (!FRONTEND_URL) throw new Error("FRONTEND_URL manquant !");

sgMail.setApiKey(SENDGRID_API_KEY);

export async function sendActivationEmail(email: string, tempPassword: string, token: string) {
  const activationLink = `${FRONTEND_URL}/activate?token=${token}`;

  const msg = {
    to: email,
    from: SMTP_FROM!, // <-- le "!" règle le problème TypeScript
    subject: "Activation de votre compte formateur",
    html: `
      <p>Bonjour,</p>
      <p>Votre compte formateur a été créé avec succès.</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mot de passe temporaire:</strong> ${tempPassword}</p>
      <p>Pour activer votre compte, cliquez sur ce lien:</p>
      <a href="${activationLink}">Activer mon compte</a>
      <p>Merci !</p>
    `,
  };

  try {
    const response = await sgMail.send(msg);
    console.log(`✅ Email envoyé à ${email} via SendGrid ! Status: ${response[0].statusCode}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Erreur d’envoi SendGrid:", error.message || error);
    throw error;
  }
}
