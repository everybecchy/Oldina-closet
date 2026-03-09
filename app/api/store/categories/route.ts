import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Listar categorias para a loja
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { 
            products: {
              where: { active: true }
            } 
          },
        },
      },
      orderBy: { name: "asc" },
    })

    // Filtrar apenas categorias que têm pelo menos 1 produto ativo
    const activeCategories = categories.filter(c => c._count.products > 0)

    return NextResponse.json({
      success: true,
      categories: activeCategories.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        image: c.image,
        productCount: c._count.products,
      })),
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar categorias da loja:", error)
    return NextResponse.json(
      { error: "Erro ao buscar categorias" },
      { status: 500 }
    )
  }
}
