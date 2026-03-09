import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const {
      customerName,
      customerEmail,
      customerPhone,
      address,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipCode,
      items,
      subtotal,
      shipping,
      discount = 0,
      couponCode,
    } = body

    // Validações básicas
    if (!customerName || !customerEmail || !address || !city || !state || !zipCode) {
      return NextResponse.json(
        { error: "Dados de entrega incompletos" },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Carrinho vazio" },
        { status: 400 }
      )
    }

    // Verificar se usuário está logado (opcional)
    const user = await getSessionUser()

    // Gerar número do pedido
    const orderNumber = `OC${Date.now().toString().slice(-8)}`

    // Calcular total
    const total = subtotal + shipping - discount

    // Montar endereço completo
    const fullAddress = complement 
      ? `${address}, ${number} - ${complement}`
      : `${address}, ${number}`

    // Criar pedido no banco
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user?.id || null,
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        address: fullAddress,
        neighborhood: neighborhood || null,
        city,
        state,
        zipCode: zipCode.replace(/\D/g, ""),
        subtotal,
        shipping,
        discount,
        total,
        couponCode: couponCode || null,
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    // Atualizar contador do cupom se foi usado
    if (couponCode) {
      await prisma.coupon.updateMany({
        where: { code: couponCode },
        data: { usedCount: { increment: 1 } },
      })
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total.toString(),
      },
    })
  } catch (error) {
    console.error("[v0] Erro ao criar pedido:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
