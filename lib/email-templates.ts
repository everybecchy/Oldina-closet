export const emailTemplates = {
  verifyEmail: (data: { name: string; verificationLink: string }) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: 'Cormorant Garamond', Georgia, serif; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f5f0; }
      .header { text-align: center; padding: 30px 0; border-bottom: 1px solid #e0d4c8; }
      .logo { height: 80px; margin-bottom: 20px; }
      .content { background-color: #ffffff; padding: 40px; margin: 20px 0; }
      .greeting { font-size: 24px; color: #8b7355; margin-bottom: 20px; font-weight: 300; }
      .message { font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 30px; }
      .button { display: inline-block; background-color: #9b8b6d; color: white; padding: 14px 30px; text-decoration: none; border-radius: 4px; font-size: 16px; }
      .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; border-top: 1px solid #e0d4c8; }
      .success-icon { color: #9b8b6d; font-size: 40px; margin-bottom: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Melhoria%20de%20logo%20joias%20Mar%209%202026-ha7CbnbZUj0zu4PFpWOJxAVosSqWnD.png" alt="Ondina Closet" class="logo">
        <h1 style="font-size: 32px; margin: 0; color: #8b7355; font-weight: 300;">Ondina Closet</h1>
      </div>

      <div class="content">
        <div style="text-align: center; margin-bottom: 30px;">
          <div class="success-icon">✓</div>
        </div>
        
        <div class="greeting">Olá ${data.name}!</div>
        
        <div class="message">
          <p>Obrigada por se cadastrar na Ondina Closet! Para ativar sua conta, clique no botão abaixo para confirmar seu email:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verificationLink}" class="button">Confirmar Email</a>
          </div>

          <p>Ou copie e cole este link no seu navegador:</p>
          <p style="word-break: break-all; background-color: #f9f5f0; padding: 10px; border-radius: 4px; font-size: 12px;">
            ${data.verificationLink}
          </p>

          <p style="margin-top: 30px; font-size: 14px; color: #999;">
            Este link expira em 24 horas.
          </p>
        </div>
      </div>

      <div class="footer">
        <p>© 2026 Ondina Closet. Todos os direitos reservados.</p>
        <p>Joias finas para momentos especiais</p>
      </div>
    </div>
  </body>
</html>
  `,

  resetPassword: (data: { name: string; resetLink: string }) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: 'Cormorant Garamond', Georgia, serif; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f5f0; }
      .header { text-align: center; padding: 30px 0; border-bottom: 1px solid #e0d4c8; }
      .logo { height: 80px; margin-bottom: 20px; }
      .content { background-color: #ffffff; padding: 40px; margin: 20px 0; }
      .greeting { font-size: 24px; color: #8b7355; margin-bottom: 20px; font-weight: 300; }
      .message { font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 30px; }
      .button { display: inline-block; background-color: #9b8b6d; color: white; padding: 14px 30px; text-decoration: none; border-radius: 4px; font-size: 16px; }
      .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; border-top: 1px solid #e0d4c8; }
      .warning { background-color: #fef3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Melhoria%20de%20logo%20joias%20Mar%209%202026-ha7CbnbZUj0zu4PFpWOJxAVosSqWnD.png" alt="Ondina Closet" class="logo">
        <h1 style="font-size: 32px; margin: 0; color: #8b7355; font-weight: 300;">Ondina Closet</h1>
      </div>

      <div class="content">
        <div class="greeting">Olá ${data.name}!</div>
        
        <div class="message">
          <p>Recebemos uma solicitação para resetar sua senha. Clique no botão abaixo para criar uma nova senha:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetLink}" class="button">Resetar Senha</a>
          </div>

          <p>Ou copie e cole este link no seu navegador:</p>
          <p style="word-break: break-all; background-color: #f9f5f0; padding: 10px; border-radius: 4px; font-size: 12px;">
            ${data.resetLink}
          </p>

          <div class="warning">
            <p style="margin: 0; font-weight: 500;">⚠️ Importante</p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">
              Este link expira em 1 hora. Se você não solicitou uma troca de senha, ignore este email.
            </p>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>© 2026 Ondina Closet. Todos os direitos reservados.</p>
        <p>Joias finas para momentos especiais</p>
      </div>
    </div>
  </body>
</html>
  `,

  resetSuccess: (data: { name: string }) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: 'Cormorant Garamond', Georgia, serif; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f5f0; }
      .header { text-align: center; padding: 30px 0; border-bottom: 1px solid #e0d4c8; }
      .logo { height: 80px; margin-bottom: 20px; }
      .content { background-color: #ffffff; padding: 40px; margin: 20px 0; }
      .greeting { font-size: 24px; color: #8b7355; margin-bottom: 20px; font-weight: 300; }
      .message { font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 30px; }
      .button { display: inline-block; background-color: #9b8b6d; color: white; padding: 14px 30px; text-decoration: none; border-radius: 4px; font-size: 16px; }
      .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; border-top: 1px solid #e0d4c8; }
      .success-icon { color: #28a745; font-size: 50px; text-align: center; margin: 20px 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Melhoria%20de%20logo%20joias%20Mar%209%202026-ha7CbnbZUj0zu4PFpWOJxAVosSqWnD.png" alt="Ondina Closet" class="logo">
        <h1 style="font-size: 32px; margin: 0; color: #8b7355; font-weight: 300;">Ondina Closet</h1>
      </div>

      <div class="content">
        <div class="success-icon">✓</div>
        
        <div class="greeting">Olá ${data.name}!</div>
        
        <div class="message">
          <p>Sua senha foi resetada com sucesso! Você pode fazer login com sua nova senha.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="button">Fazer Login</a>
          </div>

          <p style="margin-top: 30px; font-size: 14px; color: #999;">
            Se você não fez esta alteração, entre em contato conosco imediatamente.
          </p>
        </div>
      </div>

      <div class="footer">
        <p>© 2026 Ondina Closet. Todos os direitos reservados.</p>
        <p>Joias finas para momentos especiais</p>
      </div>
    </div>
  </body>
</html>
  `,

  newsletter: (data: { name: string }) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: 'Cormorant Garamond', Georgia, serif; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f5f0; }
      .header { text-align: center; padding: 30px 0; border-bottom: 1px solid #e0d4c8; }
      .logo { height: 80px; margin-bottom: 20px; }
      .content { background-color: #ffffff; padding: 40px; margin: 20px 0; }
      .greeting { font-size: 24px; color: #8b7355; margin-bottom: 20px; font-weight: 300; }
      .message { font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 30px; }
      .button { display: inline-block; background-color: #9b8b6d; color: white; padding: 14px 30px; text-decoration: none; border-radius: 4px; font-size: 16px; }
      .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; border-top: 1px solid #e0d4c8; }
      .success-icon { color: #9b8b6d; font-size: 40px; margin-bottom: 20px; text-align: center; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Melhoria%20de%20logo%20joias%20Mar%209%202026-ha7CbnbZUj0zu4PFpWOJxAVosSqWnD.png" alt="Ondina Closet" class="logo">
        <h1 style="font-size: 32px; margin: 0; color: #8b7355; font-weight: 300;">Ondina Closet</h1>
      </div>

      <div class="content">
        <div class="success-icon">✨</div>
        
        <div class="greeting">Bem-vindo(a) à nossa Newsletter!</div>
        
        <div class="message">
          <p>Obrigada por se inscrever na newsletter da Ondina Closet! ${data.name !== 'Cliente' ? `Bem-vinda, ${data.name}!` : ''}</p>
          
          <p>Você receberá:</p>
          <ul style="line-height: 1.8;">
            <li>✨ Novidades sobre nossas coleções exclusivas</li>
            <li>💎 Ofertas especiais e descontos</li>
            <li>📸 Fotos de joias premium</li>
            <li>🎁 Promoções por tempo limitado</li>
          </ul>

          <p style="margin-top: 30px;">Explore nossa loja e encontre as joias perfeitas para seus momentos especiais.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="button">Visitar Loja</a>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>© 2026 Ondina Closet. Todos os direitos reservados.</p>
        <p>Joias finas para momentos especiais</p>
        <p style="margin-top: 10px; font-size: 11px;">
          Você recebeu este email porque se inscreveu na nossa newsletter. Se deseja cancelar a inscrição, nos informe.
        </p>
      </div>
    </div>
  </body>
</html>
  `,
}
