import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Listar banners ativos para a loja
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    })

    return NextResponse.json(banners)
  } catch (error) {
    console.error("[v0] Erro ao buscar banners da loja:", error)
    return NextResponse.json(
      { error: "Erro ao buscar banners" },
      { status: 500 }
    )
  }
}
