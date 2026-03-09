import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      )
    }

    // Verificar se já existe
    const existing = await prisma.newsletter.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Este email já está inscrito na newsletter",
      })
    }

    // Criar inscrição
    await prisma.newsletter.create({
      data: {
        email: email.toLowerCase(),
        name: name || null,
      },
    })

    // Enviar email de boas-vindas
    await sendEmail({
      to: email,
      name: name || "Cliente",
      subject: "Bem-vindo à Newsletter - Ondina Closet",
      templateType: "newsletter",
      data: {
        name: name || "Cliente",
      },
    })

    return NextResponse.json({
      success: true,
      message: "Você foi inscrito na newsletter com sucesso!",
    })
  } catch (error) {
    console.error("[v0] Erro ao inscrever na newsletter:", error)
    return NextResponse.json(
      { error: "Erro ao inscrever na newsletter" },
      { status: 500 }
    )
  }
}
