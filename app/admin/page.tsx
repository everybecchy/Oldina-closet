import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users,
  TrendingUp,
  TrendingDown,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const stats = [
  {
    title: 'Receita Total',
    value: 'R$ 12.450,00',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    title: 'Pedidos',
    value: '156',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingCart,
  },
  {
    title: 'Produtos',
    value: '48',
    change: '+3',
    trend: 'up',
    icon: Package,
  },
  {
    title: 'Clientes',
    value: '892',
    change: '+24',
    trend: 'up',
    icon: Users,
  },
]

const recentOrders = [
  { id: 'OC001234', customer: 'Maria Silva', date: '09/03/2026', total: 'R$ 349,90', status: 'Enviado' },
  { id: 'OC001233', customer: 'Ana Santos', date: '09/03/2026', total: 'R$ 189,90', status: 'Processando' },
  { id: 'OC001232', customer: 'Julia Costa', date: '08/03/2026', total: 'R$ 529,80', status: 'Entregue' },
  { id: 'OC001231', customer: 'Carla Oliveira', date: '08/03/2026', total: 'R$ 219,90', status: 'Pendente' },
  { id: 'OC001230', customer: 'Beatriz Lima', date: '07/03/2026', total: 'R$ 659,70', status: 'Entregue' },
]

const topProducts = [
  { name: 'Anel Serena Dourado', sales: 45, revenue: 'R$ 8.545,50' },
  { name: 'Colar Pérolas Delicadas', sales: 32, revenue: 'R$ 9.596,80' },
  { name: 'Brinco Gota Cristal', sales: 28, revenue: 'R$ 4.477,20' },
  { name: 'Pulseira Elos Finos', sales: 24, revenue: 'R$ 5.277,60' },
]

const statusColors: Record<string, string> = {
  'Pendente': 'bg-yellow-100 text-yellow-800',
  'Processando': 'bg-blue-100 text-blue-800',
  'Enviado': 'bg-purple-100 text-purple-800',
  'Entregue': 'bg-green-100 text-green-800',
  'Cancelado': 'bg-red-100 text-red-800',
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-light text-foreground">
          Bem-vinda ao <span className="font-medium italic">Dashboard</span>
        </h2>
        <p className="text-muted-foreground mt-1">
          Visão geral do desempenho da sua loja
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <span className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-medium">Pedidos Recentes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/pedidos" className="text-primary">
                Ver todos
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.id} • {order.date}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium text-foreground">{order.total}</p>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-medium">Produtos Mais Vendidos</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/produtos" className="text-primary">
                Ver todos
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, idx) => (
                <div key={product.name} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium text-muted-foreground">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sales} vendas</p>
                  </div>
                  <p className="text-sm font-medium text-primary">{product.revenue}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
