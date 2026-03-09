import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Listar vídeos ativos para a loja
export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    })

    return NextResponse.json(videos)
  } catch (error) {
    console.error("[v0] Erro ao buscar vídeos da loja:", error)
    return NextResponse.json(
      { error: "Erro ao buscar vídeos" },
      { status: 500 }
    )
  }
}
