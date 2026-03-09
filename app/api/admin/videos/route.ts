import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET - Listar todos os vídeos
export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(videos)
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error)
    return NextResponse.json({ error: 'Erro ao buscar vídeos' }, { status: 500 })
  }
}

// POST - Criar novo vídeo
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, url, thumbnail, active, order } = body

    if (!title || !url) {
      return NextResponse.json({ error: 'Título e URL são obrigatórios' }, { status: 400 })
    }

    const video = await prisma.video.create({
      data: {
        title,
        description: description || null,
        url,
        thumbnail: thumbnail || null,
        active: active ?? true,
        order: order ?? 0
      }
    })

    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar vídeo:', error)
    return NextResponse.json({ error: 'Erro ao criar vídeo' }, { status: 500 })
  }
}

// PUT - Atualizar vídeo
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, description, url, thumbnail, active, order } = body

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    const video = await prisma.video.update({
      where: { id },
      data: {
        title,
        description,
        url,
        thumbnail,
        active,
        order
      }
    })

    return NextResponse.json(video)
  } catch (error) {
    console.error('Erro ao atualizar vídeo:', error)
    return NextResponse.json({ error: 'Erro ao atualizar vídeo' }, { status: 500 })
  }
}

// DELETE - Remover vídeo
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    await prisma.video.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar vídeo:', error)
    return NextResponse.json({ error: 'Erro ao deletar vídeo' }, { status: 500 })
  }
}
