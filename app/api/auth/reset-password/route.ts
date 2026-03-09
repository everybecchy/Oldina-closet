import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"
import { sendEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token e nova senha são obrigatórios" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { passwordResetToken: token },
    })

    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      return NextResponse.json(
        { error: "Link expirado ou inválido" },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    })

    // Enviar email de confirmação
    await sendEmail({
      to: user.email,
      name: user.name || user.email,
      subject: "Senha resetada com sucesso - Ondina Closet",
      templateType: "resetSuccess",
      data: {
        name: user.name || "Cliente",
      },
    })

    return NextResponse.json({
      success: true,
      message: "Senha alterada com sucesso",
      redirectTo: "/login",
    })
  } catch (error) {
    console.error("[v0] Erro ao resetar senha:", error)
    return NextResponse.json(
      { error: "Erro ao resetar senha" },
      { status: 500 }
    )
  }
}
