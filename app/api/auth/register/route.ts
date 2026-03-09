import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"
import { sendEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)
    const verificationToken = crypto.randomBytes(32).toString("hex")

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || null,
        phone: phone || null,
        isAdmin: false,
        verificationToken,
        emailVerified: null,
      },
    })

    // Enviar email de confirmação
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/confirmar-email?token=${verificationToken}`
    await sendEmail({
      to: user.email,
      name: user.name || user.email,
      subject: "Confirme seu email - Ondina Closet",
      templateType: "verify",
      data: {
        name: user.name || "Cliente",
        verificationLink,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Verifique seu email para confirmar seu cadastro",
      redirectTo: "/login",
    })
  } catch (error) {
    console.error("[v0] Erro no registro:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
