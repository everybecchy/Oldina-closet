import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      // Não revelar se o email existe ou não por segurança
      return NextResponse.json({
        success: true,
        message: "Se o email existir, você receberá um link para recuperar sua senha",
      })
    }

    // Gerar token de reset com expiração de 1 hora
    const resetToken = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: expiresAt,
      },
    })

    // Enviar email com link de reset
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/recuperar-senha?token=${resetToken}`
    await sendEmail({
      to: user.email,
      name: user.name || user.email,
      subject: "Recuperar senha - Ondina Closet",
      templateType: "resetPassword",
      data: {
        name: user.name || "Cliente",
        resetLink,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Se o email existir, você receberá um link para recuperar sua senha",
    })
  } catch (error) {
    console.error("[v0] Erro ao solicitar recuperação de senha:", error)
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    )
  }
}
