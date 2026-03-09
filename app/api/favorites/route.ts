import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth"

// GET - Listar favoritos do usuário
export async function GET() {
  try {
    const session = await getSessionUser()
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
    })

    // Buscar os produtos relacionados
    const productIds = favorites.map((f) => f.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { category: true },
    })

    // Combinar favoritos com dados do produto
    const favoritesWithProducts = favorites.map((favorite) => ({
      ...favorite,
      product: products.find((p) => p.id === favorite.productId),
    }))

    return NextResponse.json({ favorites: favoritesWithProducts })
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error)
    return NextResponse.json({ error: "Erro ao buscar favoritos" }, { status: 500 })
  }
}

// POST - Adicionar ou remover favorito (toggle)
export async function POST(request: Request) {
  try {
    const session = await getSessionUser()
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "ID do produto é obrigatório" }, { status: 400 })
    }

    // Verificar se já existe
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: session.id,
          productId,
        },
      },
    })

    if (existing) {
      // Remover favorito
      await prisma.favorite.delete({
        where: { id: existing.id },
      })
      return NextResponse.json({ favorited: false, message: "Removido dos favoritos" })
    } else {
      // Adicionar favorito
      await prisma.favorite.create({
        data: {
          userId: session.id,
          productId,
        },
      })
      return NextResponse.json({ favorited: true, message: "Adicionado aos favoritos" })
    }
  } catch (error) {
    console.error("Erro ao atualizar favorito:", error)
    return NextResponse.json({ error: "Erro ao atualizar favorito" }, { status: 500 })
  }
}

// DELETE - Remover favorito específico
export async function DELETE(request: Request) {
  try {
    const session = await getSessionUser()
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ error: "ID do produto é obrigatório" }, { status: 400 })
    }

    await prisma.favorite.deleteMany({
      where: {
        userId: session.id,
        productId,
      },
    })

    return NextResponse.json({ message: "Favorito removido" })
  } catch (error) {
    console.error("Erro ao remover favorito:", error)
    return NextResponse.json({ error: "Erro ao remover favorito" }, { status: 500 })
  }
}
