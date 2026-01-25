// lib/mail.ts
import sgMail from "@sendgrid/mail";

export async function sendActivationEmail(
  email: string,
  tempPassword: string,
  activationToken: string  // ← Le JWT
) {
  const frontendUrl = process.env.FRONTEND_URL || 'https://relaxed-selkie-3ef8a0.netlify.app'
  
  // ✅ IMPORTANT : Utiliser activationToken (JWT), pas tempPassword !
  const activationLink = `${frontendUrl}/activate?token=${activationToken}`

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: 'Activez votre compte',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Bienvenue !</h2>
        <p>Votre compte a été créé avec succès.</p>
        
        <p><strong>Votre mot de passe temporaire :</strong> ${tempPassword}</p>
        
        <p>Pour activer votre compte, cliquez sur le bouton ci-dessous :</p>
        
        <a href="${activationLink}" 
           style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; 
                  color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Activer mon compte
        </a>
        
        <p style="color: #666; font-size: 12px;">
          Ce lien est valable pendant 24 heures.
        </p>
        
        <p style="color: #666; font-size: 12px;">
          Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
          <a href="${activationLink}">${activationLink}</a>
        </p>
      </div>
    `,
  }

  await sgMail.send(msg)
  console.log('✅ [EMAIL] Email envoyé à', email)
}