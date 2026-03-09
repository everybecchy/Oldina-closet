import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth"

// GET - Listar todos os produtos
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
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
        stock: p.stock,
        featured: p.featured,
        active: p.active,
        createdAt: p.createdAt,
      })),
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar produtos:", error)
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    )
  }
}

// POST - Criar novo produto
export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Gerar slug a partir do nome
    const slug = data.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Verificar se slug já existe
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    })

    const finalSlug = existingProduct ? `${slug}-${Date.now()}` : slug

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: finalSlug,
        description: data.description || null,
        price: data.price,
        comparePrice: data.comparePrice || null,
        images: data.images || (data.image ? [data.image] : []),
        categoryId: data.categoryId,
        stock: data.stock || 0,
        featured: data.featured || false,
        active: data.active !== false,
      },
      include: {
        category: true,
      },
    })

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
        stock: product.stock,
        featured: product.featured,
        active: product.active,
      },
    })
  } catch (error) {
    console.error("[v0] Erro ao criar produto:", error)
    return NextResponse.json(
      { error: "Erro ao criar produto" },
      { status: 500 }
    )
  }
}

// PUT - Atualizar produto
export async function PUT(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const data = await request.json()

    if (!data.id) {
      return NextResponse.json(
        { error: "ID do produto é obrigatório" },
        { status: 400 }
      )
    }

    const product = await prisma.product.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description || null,
        price: data.price,
        comparePrice: data.comparePrice || null,
        images: data.images || (data.image ? [data.image] : []),
        categoryId: data.categoryId,
        stock: data.stock || 0,
        featured: data.featured || false,
        active: data.active !== false,
      },
      include: {
        category: true,
      },
    })

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
        stock: product.stock,
        featured: product.featured,
        active: product.active,
      },
    })
  } catch (error) {
    console.error("[v0] Erro ao atualizar produto:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar produto" },
      { status: 500 }
    )
  }
}

// DELETE - Excluir produto
export async function DELETE(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "ID do produto é obrigatório" },
        { status: 400 }
      )
    }

    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Produto excluído com sucesso",
    })
  } catch (error) {
    console.error("[v0] Erro ao excluir produto:", error)
    return NextResponse.json(
      { error: "Erro ao excluir produto" },
      { status: 500 }
    )
  }
}
