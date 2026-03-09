import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Token expirado ou inválido. Solicite um novo cadastro." },
        { status: 400 }
      )
    }

    // Atualizar usuário para verificado
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Email confirmado com sucesso!",
    })
  } catch (error) {
    console.error("[v0] Erro ao verificar email:", error)
    return NextResponse.json(
      { error: "Erro ao verificar email" },
      { status: 500 }
    )
  }
}

// Manter GET para links diretos do email
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/confirmar-email?error=invalid`
      )
    }

    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    })

    if (!user) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/confirmar-email?error=expired`
      )
    }

    // Atualizar usuário para verificado
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
      },
    })

    // Redirecionar para login com mensagem de sucesso
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?verified=true`
    )
  } catch (error) {
    console.error("[v0] Erro ao verificar email (GET):", error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/confirmar-email?error=server`
    )
  }
}
