import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET - Listar todos os cupons
export async function GET() {
  try {
    const cupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(cupons)
  } catch (error) {
    console.error('Erro ao buscar cupons:', error)
    return NextResponse.json({ error: 'Erro ao buscar cupons' }, { status: 500 })
  }
}

// POST - Criar novo cupom
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { code, description, discountType, discountValue, minPurchase, maxUses, active, expiresAt } = body

    if (!code || discountValue === undefined) {
      return NextResponse.json({ error: 'Código e valor do desconto são obrigatórios' }, { status: 400 })
    }

    // Verificar se o código já existe
    const existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } })
    if (existing) {
      return NextResponse.json({ error: 'Já existe um cupom com este código' }, { status: 400 })
    }

    const cupom = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        description: description || null,
        discountType: discountType || 'percentage',
        discountValue,
        minPurchase: minPurchase || null,
        maxUses: maxUses || null,
        active: active ?? true,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    })

    return NextResponse.json(cupom, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar cupom:', error)
    return NextResponse.json({ error: 'Erro ao criar cupom' }, { status: 500 })
  }
}

// PUT - Atualizar cupom
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { id, code, description, discountType, discountValue, minPurchase, maxUses, active, expiresAt } = body

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    const cupom = await prisma.coupon.update({
      where: { id },
      data: {
        code: code?.toUpperCase(),
        description,
        discountType,
        discountValue,
        minPurchase,
        maxUses,
        active,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    })

    return NextResponse.json(cupom)
  } catch (error) {
    console.error('Erro ao atualizar cupom:', error)
    return NextResponse.json({ error: 'Erro ao atualizar cupom' }, { status: 500 })
  }
}

// DELETE - Remover cupom
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

    await prisma.coupon.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar cupom:', error)
    return NextResponse.json({ error: 'Erro ao deletar cupom' }, { status: 500 })
  }
}
