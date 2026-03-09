import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

// GET - Listar todos os banners
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(banners)
  } catch (error) {
    console.error('Erro ao buscar banners:', error)
    return NextResponse.json({ error: 'Erro ao buscar banners' }, { status: 500 })
  }
}

// POST - Criar novo banner
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser()
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { title, subtitle, image, link, active, order } = body

    if (!title || !image) {
      return NextResponse.json({ error: 'Título e imagem são obrigatórios' }, { status: 400 })
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle: subtitle || null,
        image,
        link: link || null,
        active: active ?? true,
        order: order ?? 0
      }
    })

    return NextResponse.json(banner, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar banner:', error)
    return NextResponse.json({ error: 'Erro ao criar banner' }, { status: 500 })
  }
}

// PUT - Atualizar banner
export async function PUT(request: NextRequest) {
  try {
    const session = await getSessionUser()
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, subtitle, image, link, active, order } = body

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        title,
        subtitle,
        image,
        link,
        active,
        order
      }
    })

    return NextResponse.json(banner)
  } catch (error) {
    console.error('Erro ao atualizar banner:', error)
    return NextResponse.json({ error: 'Erro ao atualizar banner' }, { status: 500 })
  }
}

// DELETE - Remover banner
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSessionUser()
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    await prisma.banner.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar banner:', error)
    return NextResponse.json({ error: 'Erro ao deletar banner' }, { status: 500 })
  }
}
