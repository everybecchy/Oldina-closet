"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Header } from '@/components/store/header'
import { Footer } from '@/components/store/footer'
import { CartDrawer } from '@/components/store/cart-drawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Package,
  ArrowLeft,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  XCircle,
} from 'lucide-react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

// Fluxo de entrega em ordem
const deliveryFlow = [
  { key: 'CONFIRMED', label: 'Pedido Confirmado', icon: CheckCircle2 },
  { key: 'PROCESSING', label: 'Em Processamento', icon: Clock },
  { key: 'SHIPPED', label: 'Enviado', icon: Truck },
  { key: 'DELIVERED', label: 'Entregue', icon: PackageCheck },
]

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  PENDING: { label: 'Aguardando Pagamento', variant: 'secondary' },
  CONFIRMED: { label: 'Pedido Confirmado', variant: 'default' },
  PROCESSING: { label: 'Em Processamento', variant: 'default' },
  SHIPPED: { label: 'Enviado', variant: 'default' },
  DELIVERED: { label: 'Entregue', variant: 'default' },
  CANCELLED: { label: 'Cancelado', variant: 'destructive' },
}

function OrderTimeline({ status }: { status: string }) {
  if (status === 'CANCELLED' || status === 'PENDING') {
    return (
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
        {status === 'CANCELLED' ? (
          <>
            <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
            <span className="text-sm text-destructive">Pedido cancelado</span>
          </>
        ) : (
          <>
            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground">Aguardando confirmação do pagamento via PIX</span>
          </>
        )}
      </div>
    )
  }

  const currentIndex = deliveryFlow.findIndex(s => s.key === status)

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex items-center gap-0 overflow-x-auto">
        {deliveryFlow.map((step, index) => {
          const isDone = index <= currentIndex
          const isCurrent = index === currentIndex
          const Icon = step.icon

          return (
            <div key={step.key} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isDone
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                } ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`text-[10px] text-center max-w-[64px] leading-tight hidden sm:block ${
                  isDone ? 'text-foreground font-medium' : 'text-muted-foreground'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < deliveryFlow.length - 1 && (
                <div className={`h-0.5 w-8 sm:w-12 mx-1 flex-shrink-0 ${
                  index < currentIndex ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          )
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-3 sm:hidden">
        {deliveryFlow[currentIndex]?.label}
      </p>
    </div>
  )
}

interface OrderItem {
  id: string
  quantity: number
  price: number | string
  product: {
    name: string
    images: string[]
  } | null
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number | string
  shipping: number | string
  createdAt: string
  items: OrderItem[]
  payment: {
    status: string
  } | null
}

export default function MeusPedidosPage() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()
  const { data: orders, isLoading } = useSWR<Order[]>(
    isAuthenticated ? '/api/orders/my-orders' : null,
    fetcher,
    { refreshInterval: 30000 } // Atualiza a cada 30s
  )

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">

          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/minha-conta">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Meus Pedidos</h1>
              <p className="text-muted-foreground">Acompanhe o status de suas compras</p>
            </div>
          </div>

          {!orders || orders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nenhum pedido encontrado
                </h3>
                <p className="text-muted-foreground mb-6">
                  Você ainda não fez nenhuma compra
                </p>
                <Button asChild>
                  <Link href="/produtos">Explorar Produtos</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    {/* Cabeçalho do pedido */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            Pedido #{order.orderNumber}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={statusMap[order.status]?.variant ?? 'secondary'}
                          className="text-xs"
                        >
                          {statusMap[order.status]?.label ?? order.status}
                        </Badge>
                        <span className="font-semibold text-foreground">
                          R${' '}
                          {Number(order.total)
                            .toFixed(2)
                            .replace('.', ',')}
                        </span>
                      </div>
                    </div>

                    {/* Itens */}
                    {order.items?.length > 0 && (
                      <div className="mt-4 space-y-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {item.quantity}x {item.product?.name ?? 'Produto'}
                            </span>
                            <span className="text-foreground">
                              R${' '}
                              {(Number(item.price) * item.quantity)
                                .toFixed(2)
                                .replace('.', ',')}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Linha do tempo de entrega */}
                    <OrderTimeline status={order.status} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
