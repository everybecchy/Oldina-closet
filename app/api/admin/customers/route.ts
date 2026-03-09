import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Buscar clientes únicos dos pedidos (inclui convidados e usuários registrados)
    const orders = await prisma.order.findMany({
      select: {
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        total: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Agrupar pedidos por email do cliente
    const customerMap = new Map<string, {
      id: string
      name: string
      email: string
      phone: string | null
      orders: number
      totalSpent: number
      lastOrder: Date
    }>()

    orders.forEach(order => {
      const email = order.customerEmail.toLowerCase()
      const existing = customerMap.get(email)
      
      if (existing) {
        existing.orders += 1
        existing.totalSpent += Number(order.total)
        if (order.createdAt > existing.lastOrder) {
          existing.lastOrder = order.createdAt
        }
      } else {
        customerMap.set(email, {
          id: order.user?.id || email,
          name: order.user?.name || order.customerName,
          email: order.customerEmail,
          phone: order.user?.phone || order.customerPhone,
          orders: 1,
          totalSpent: Number(order.total),
          lastOrder: order.createdAt,
        })
      }
    })

    const customers = Array.from(customerMap.values()).sort((a, b) => 
      b.lastOrder.getTime() - a.lastOrder.getTime()
    )

    return NextResponse.json(customers)
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json(
      { error: "Erro ao buscar clientes" },
      { status: 500 }
    )
  }
}
