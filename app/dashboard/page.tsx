"use client"

import { useState, useEffect } from "react"
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users,
  ArrowRight,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DashboardStats {
  revenue: number
  orders: number
  products: number
  customers: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  customerName: string
  total: number
  status: string
  createdAt: string
}

const statusColors: Record<string, string> = {
  "PENDING": "bg-yellow-100 text-yellow-800",
  "CONFIRMED": "bg-blue-100 text-blue-800",
  "PROCESSING": "bg-blue-100 text-blue-800",
  "SHIPPED": "bg-purple-100 text-purple-800",
  "DELIVERED": "bg-green-100 text-green-800",
  "CANCELLED": "bg-red-100 text-red-800",
}

const statusLabels: Record<string, string> = {
  "PENDING": "Pendente",
  "CONFIRMED": "Confirmado",
  "PROCESSING": "Processando",
  "SHIPPED": "Enviado",
  "DELIVERED": "Entregue",
  "CANCELLED": "Cancelado",
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/dashboard")
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setRecentOrders(data.recentOrders || [])
      }
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR")
  }

  const statCards = [
    {
      title: "Receita Total",
      value: formatPrice(stats.revenue),
      icon: DollarSign,
    },
    {
      title: "Pedidos",
      value: stats.orders.toString(),
      icon: ShoppingCart,
    },
    {
      title: "Produtos",
      value: stats.products.toString(),
      icon: Package,
    },
    {
      title: "Clientes",
      value: stats.customers.toString(),
      icon: Users,
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-light text-foreground">
          Bem-vinda ao <span className="font-medium italic">Dashboard</span>
        </h2>
        <p className="text-muted-foreground mt-1">
          Visao geral do desempenho da sua loja
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-medium">Pedidos Recentes</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/pedidos" className="text-primary">
              Ver todos
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum pedido ainda</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{order.orderNumber} - {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium text-foreground">{formatPrice(order.total)}</p>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
