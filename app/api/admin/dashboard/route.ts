import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSessionUser()
    
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
    }

    // Buscar estatísticas
    const [ordersCount, productsCount, customersCount, orders] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count({ where: { isAdmin: false } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          total: true,
          status: true,
          createdAt: true,
        }
      })
    ])

    // Calcular receita total (pedidos entregues ou confirmados)
    const revenueResult = await prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: {
          in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"]
        }
      }
    })

    const revenue = revenueResult._sum.total ? Number(revenueResult._sum.total) : 0

    return NextResponse.json({
      stats: {
        revenue,
        orders: ordersCount,
        products: productsCount,
        customers: customersCount
      },
      recentOrders: orders.map(order => ({
        ...order,
        total: Number(order.total)
      }))
    })
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error)
    return NextResponse.json({ 
      stats: { revenue: 0, orders: 0, products: 0, customers: 0 },
      recentOrders: []
    })
  }
}
