import nodemailer from 'nodemailer'
import { emailTemplates } from './email-templates'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export interface EmailOptions {
  to: string
  name?: string
  subject: string
  templateType: 'verify' | 'resetPassword' | 'resetSuccess' | 'newsletter' | 'payment-pix' | 'payment-status'
  data?: Record<string, any>
}

export async function sendEmail(options: EmailOptions) {
  try {
    const { to, subject, templateType, data = {} } = options

    let html = ''
    
    switch (templateType) {
      case 'verify':
        html = emailTemplates.verifyEmail({
          name: data.name || 'Cliente',
          verificationLink: data.verificationLink || '',
        })
        break
      case 'resetPassword':
        html = emailTemplates.resetPassword({
          name: data.name || 'Cliente',
          resetLink: data.resetLink || '',
        })
        break
      case 'resetSuccess':
        html = emailTemplates.resetSuccess({
          name: data.name || 'Cliente',
        })
        break
      case 'newsletter':
        html = emailTemplates.newsletter({
          name: data.name || 'Cliente',
        })
        break
      case 'payment-pix':
        html = emailTemplates.paymentPix({
          orderNumber: data.orderNumber || '',
          amount: data.amount || '0',
          qrCode: data.qrCode || '',
          pixKey: data.pixKey || '',
          items: data.items || [],
        })
        break
      case 'payment-status':
        html = emailTemplates.paymentStatus({
          orderNumber: data.orderNumber || '',
          status: data.status || '',
          amount: data.amount || '0',
          items: data.items || [],
        })
        break
    }

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('[v0] Email enviado:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('[v0] Erro ao enviar email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erro ao enviar email' }
  }
}

export async function verifyTransporter() {
  try {
    await transporter.verify()
    console.log('[v0] SMTP conectado com sucesso')
    return true
  } catch (error) {
    console.error('[v0] Erro ao conectar SMTP:', error)
    return false
  }
}
