import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth"

// GET - Listar todas as categorias
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json({
      success: true,
      categories: categories.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        image: c.image,
        productCount: c._count.products,
        createdAt: c.createdAt,
      })),
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar categorias:", error)
    return NextResponse.json(
      { error: "Erro ao buscar categorias" },
      { status: 500 }
    )
  }
}

// POST - Criar nova categoria
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
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: "Já existe uma categoria com este nome" },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        image: data.image || null,
      },
    })

    return NextResponse.json({
      success: true,
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        productCount: 0,
      },
    })
  } catch (error) {
    console.error("[v0] Erro ao criar categoria:", error)
    return NextResponse.json(
      { error: "Erro ao criar categoria" },
      { status: 500 }
    )
  }
}

// PUT - Atualizar categoria
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
        { error: "ID da categoria é obrigatório" },
        { status: 400 }
      )
    }

    const category = await prisma.category.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description || null,
        image: data.image || null,
      },
    })

    return NextResponse.json({
      success: true,
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
      },
    })
  } catch (error) {
    console.error("[v0] Erro ao atualizar categoria:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar categoria" },
      { status: 500 }
    )
  }
}

// DELETE - Excluir categoria
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
        { error: "ID da categoria é obrigatório" },
        { status: 400 }
      )
    }

    // Verificar se há produtos nesta categoria
    const productsCount = await prisma.product.count({
      where: { categoryId: id },
    })

    if (productsCount > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir categoria com produtos vinculados" },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Categoria excluída com sucesso",
    })
  } catch (error) {
    console.error("[v0] Erro ao excluir categoria:", error)
    return NextResponse.json(
      { error: "Erro ao excluir categoria" },
      { status: 500 }
    )
  }
}
