import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Listar produtos ativos para a loja
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const slug = searchParams.get("slug")
    const limit = searchParams.get("limit")

    // Se buscar por slug específico (página de detalhes)
    if (slug) {
      const product = await prisma.product.findUnique({
        where: { slug, active: true },
        include: {
          category: true,
        },
      })

      if (!product) {
        return NextResponse.json(
          { error: "Produto não encontrado" },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: Number(product.price),
          comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
          images: product.images,
          image: product.images[0] || "",
          categoryId: product.categoryId,
          category: product.category.name,
          categorySlug: product.category.slug,
          stock: product.stock,
          featured: product.featured,
        },
      })
    }

    // Listar produtos
    const where: Record<string, unknown> = { active: true }

    if (category) {
      where.category = { slug: category }
    }

    if (featured === "true") {
      where.featured = true
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
      ...(limit ? { take: parseInt(limit, 10) } : {}),
    })

    return NextResponse.json({
      success: true,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
        images: p.images,
        image: p.images[0] || "",
        categoryId: p.categoryId,
        category: p.category.name,
        categorySlug: p.category.slug,
        stock: p.stock,
        featured: p.featured,
      })),
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar produtos da loja:", error)
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    )
  }
}
