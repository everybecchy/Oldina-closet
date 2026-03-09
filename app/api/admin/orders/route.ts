import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              }
            }
          }
        },
        payment: {
          select: {
            id: true,
            status: true,
            transactionId: true,
            amount: true,
            paidAt: true,
          }
        },
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Erro ao buscar pedidos" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { orderId, status } = body

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "orderId e status são obrigatórios" },
        { status: 400 }
      )
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              }
            }
          }
        },
        payment: {
          select: {
            id: true,
            status: true,
            transactionId: true,
            amount: true,
            paidAt: true,
          }
        },
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar pedido" },
      { status: 500 }
    )
  }
}
