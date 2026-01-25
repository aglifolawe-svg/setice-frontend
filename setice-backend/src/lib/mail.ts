/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/mail.ts
import sgMail from "@sendgrid/mail";

export async function sendActivationEmail(
  email: string, 
  matricule: string,      // ✅ Ajouté
  tempPassword: string, 
  token: string          // ✅ Retiré le "?" pour le rendre obligatoire
) {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY!;
  const SMTP_FROM = process.env.SMTP_FROM!;
  const FRONTEND_URL = process.env.FRONTEND_URL!;

  console.log('🔵 [EMAIL] Configuration:', {
    hasApiKey: !!SENDGRID_API_KEY,
    from: SMTP_FROM,
    to: email,
    frontendUrl: FRONTEND_URL
  })

  sgMail.setApiKey(SENDGRID_API_KEY);

  const activationLink = `${FRONTEND_URL}/activate?token=${token}`;

  const msg = {
    to: email,
    from: SMTP_FROM,
    subject: "Activation de votre compte SETICE",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">🎓 Bienvenue sur SETICE</h1>
        </div>
        
        <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
          <p>Bonjour,</p>
          <p>Votre compte étudiant a été créé avec succès !</p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4F46E5;">
            <p style="margin: 5px 0;"><strong>📧 Email :</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>🎓 Matricule :</strong> ${matricule}</p>
            <p style="margin: 5px 0;"><strong>🔑 Mot de passe temporaire :</strong> <code style="background: #f3f4f6; padding: 2px 8px; border-radius: 4px;">${tempPassword}</code></p>
          </div>
          
          <p><strong>⚠️ Important :</strong> Pour activer votre compte et choisir votre mot de passe définitif, cliquez sur le bouton ci-dessous :</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${activationLink}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Activer mon compte
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            Ce lien expire dans 24 heures.<br>
            Si vous n'avez pas demandé la création de ce compte, ignorez cet email.
          </p>
        </div>
      </div>
    `,
  };

  try {
    console.log('🔵 [EMAIL] Envoi de l\'email...')
    const response = await sgMail.send(msg);
    console.log(`✅ [EMAIL] Email envoyé à ${email} via SendGrid ! Status: ${response[0].statusCode}`);
    return { success: true, statusCode: response[0].statusCode }
  } catch (error: any) {
    console.error("❌ [EMAIL] Erreur SendGrid:", error.response?.body || error.message || error);
    throw new Error(error.response?.body?.errors?.[0]?.message || error.message || 'Erreur envoi email')
  }
}
