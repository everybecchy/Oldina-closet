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

  paymentPix: (data: { orderNumber: string; amount: string; qrCode: string; pixKey: string; items: Array<{name: string; quantity: number; price: string}> }) => `
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
      .section { margin-bottom: 30px; }
      .section-title { font-size: 18px; color: #8b7355; font-weight: 600; margin-bottom: 15px; }
      .pix-code { background-color: #f9f5f0; padding: 15px; border-radius: 4px; word-break: break-all; font-size: 12px; font-family: monospace; margin: 10px 0; }
      .qr-container { text-align: center; background-color: #f9f5f0; padding: 20px; border-radius: 4px; margin: 20px 0; }
      .qr-code { max-width: 300px; margin: 0 auto; }
      .item-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
      .total-row { display: flex; justify-content: space-between; padding: 15px 0; border-top: 2px solid #e0d4c8; font-weight: 600; color: #8b7355; }
      .warning { background-color: #fef3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; font-size: 14px; }
      .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; border-top: 1px solid #e0d4c8; }
      .button { display: inline-block; background-color: #9b8b6d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-size: 14px; margin-top: 15px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Melhoria%20de%20logo%20joias%20Mar%209%202026-ha7CbnbZUj0zu4PFpWOJxAVosSqWnD.png" alt="Ondina Closet" class="logo">
        <h1 style="font-size: 32px; margin: 0; color: #8b7355; font-weight: 300;">Ondina Closet</h1>
      </div>

      <div class="content">
        <div class="section">
          <h2 style="color: #8b7355; margin-top: 0;">Seu PIX está pronto!</h2>
          <p>Olá! O seu pedido <strong>#${data.orderNumber}</strong> está aguardando confirmação de pagamento via PIX.</p>
        </div>

        <div class="section">
          <div class="section-title">📦 Itens do Pedido</div>
          ${data.items.map(item => `
            <div class="item-row">
              <span>${item.name} x${item.quantity}</span>
              <span>R$ ${item.price}</span>
            </div>
          `).join('')}
          <div class="total-row">
            <span>Total:</span>
            <span>R$ ${data.amount}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">💳 Formas de Pagar com PIX</div>
          
          <div class="qr-container">
            <p style="margin: 0 0 15px 0; font-size: 14px;">Escaneie este QR Code com seu app bancário:</p>
            <div style="background-color: white; padding: 10px; border-radius: 4px; display: inline-block;">
              <img src="${data.qrCode}" alt="QR Code PIX" style="width: 250px; height: 250px;">
            </div>
          </div>

          <div style="background-color: #f9f5f0; padding: 15px; border-radius: 4px; margin: 15px 0;">
            <p style="margin: 0; font-size: 12px; color: #666;">Ou copie a chave PIX:</p>
            <div class="pix-code">${data.pixKey}</div>
          </div>
        </div>

        <div class="warning">
          <strong>⏱️ Importante:</strong> O código PIX expira em 30 minutos. Se não conseguir pagar, gere um novo código.
        </div>

        <div class="section">
          <p style="margin: 0; font-size: 14px; color: #666;">
            Assim que confirmarmos seu pagamento, você receberá um email com a confirmação de seu pedido.
          </p>
        </div>
      </div>

      <div class="footer">
        <p>© 2026 Ondina Closet. Todos os direitos reservados.</p>
        <p>Joias finas para momentos especiais</p>
        <p style="margin-top: 10px;">Dúvidas? Envie para: contato@ondinacloset.store</p>
      </div>
    </div>
  </body>
</html>
  `,

  paymentStatus: (data: { orderNumber: string; status: string; amount: string; items: Array<{name: string; quantity: number; price: string}> }) => `
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
      .status-badge { display: inline-block; padding: 10px 20px; border-radius: 20px; font-weight: 600; margin: 20px 0; }
      .status-approved { background-color: #d4edda; color: #155724; }
      .status-pending { background-color: #fff3cd; color: #856404; }
      .status-failed { background-color: #f8d7da; color: #721c24; }
      .section-title { font-size: 18px; color: #8b7355; font-weight: 600; margin-bottom: 15px; margin-top: 25px; }
      .item-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
      .total-row { display: flex; justify-content: space-between; padding: 15px 0; border-top: 2px solid #e0d4c8; font-weight: 600; color: #8b7355; }
      .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; border-top: 1px solid #e0d4c8; }
      .button { display: inline-block; background-color: #9b8b6d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-size: 14px; margin-top: 15px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Melhoria%20de%20logo%20joias%20Mar%209%202026-ha7CbnbZUj0zu4PFpWOJxAVosSqWnD.png" alt="Ondina Closet" class="logo">
        <h1 style="font-size: 32px; margin: 0; color: #8b7355; font-weight: 300;">Ondina Closet</h1>
      </div>

      <div class="content">
        <h2 style="text-align: center; color: #8b7355; margin-top: 0;">Atualização de Pagamento</h2>
        
        <div style="text-align: center;">
          <div class="status-badge ${data.status.includes('confirmado') || data.status.includes('Confirmado') ? 'status-approved' : data.status.includes('Pagamento') && data.status.includes('confirmado') ? 'status-approved' : 'status-pending'}">
            ${data.status}
          </div>
        </div>

        <p style="text-align: center; margin-bottom: 30px;">Pedido <strong>#${data.orderNumber}</strong></p>

        <div class="section-title">📦 Itens do Pedido</div>
        ${data.items.map(item => `
          <div class="item-row">
            <span>${item.name} x${item.quantity}</span>
            <span>R$ ${item.price}</span>
          </div>
        `).join('')}
        <div class="total-row">
          <span>Total:</span>
          <span>R$ ${data.amount}</span>
        </div>

        <div style="margin-top: 30px; padding: 15px; background-color: #f9f5f0; border-radius: 4px;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            Você pode acompanhar seu pedido a qualquer momento em sua conta na loja.
          </p>
        </div>
      </div>

      <div class="footer">
        <p>© 2026 Ondina Closet. Todos os direitos reservados.</p>
        <p>Joias finas para momentos especiais</p>
        <p style="margin-top: 10px;">Dúvidas? Envie para: contato@ondinacloset.store</p>
      </div>
    </div>
  </body>
</html>
  `,
}

