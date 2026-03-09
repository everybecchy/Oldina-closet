"use client"

import { useState } from 'react'
import useSWR from 'swr'
import { Search, Eye, ChevronDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    name: string
    images: string[]
  }
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string | null
  address: string
  number: string | null
  complement: string | null
  neighborhood: string | null
  city: string
  state: string
  zipCode: string
  shippingMethod: string | null
  status: string
  subtotal: number
  shipping: number
  discount: number
  total: number
  items: OrderItem[]
  payment: {
    status: string
    transactionId: string | null
  } | null
  createdAt: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

const statusColors: Record<string, string> = {
  'PENDING': 'bg-yellow-100 text-yellow-800',
  'CONFIRMED': 'bg-blue-100 text-blue-800',
  'PROCESSING': 'bg-indigo-100 text-indigo-800',
  'SHIPPED': 'bg-purple-100 text-purple-800',
  'DELIVERED': 'bg-green-100 text-green-800',
  'CANCELLED': 'bg-red-100 text-red-800',
}

const statusLabels: Record<string, string> = {
  'PENDING': 'Pendente',
  'CONFIRMED': 'Confirmado',
  'PROCESSING': 'Processando',
  'SHIPPED': 'Enviado',
  'DELIVERED': 'Entregue',
  'CANCELLED': 'Cancelado',
}

const statusOptions = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function AdminOrdersPage() {
  const { data: orders, error, isLoading, mutate } = useSWR<Order[]>('/api/admin/orders', fetcher)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const filteredOrders = orders?.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !filterStatus || order.status === filterStatus
    return matchesSearch && matchesStatus
  }) || []

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId)
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      })
      
      if (response.ok) {
        mutate()
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    } finally {
      setUpdatingStatus(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Erro ao carregar pedidos</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-light text-foreground">
          Gerenciar <span className="font-medium italic">Pedidos</span>
        </h2>
        <p className="text-muted-foreground mt-1">
          {orders?.length || 0} pedidos no total
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número ou cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              {filterStatus ? statusLabels[filterStatus] : 'Todos os Status'}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterStatus(null)}>
              Todos os Status
            </DropdownMenuItem>
            {statusOptions.map((status) => (
              <DropdownMenuItem key={status} onClick={() => setFilterStatus(status)}>
                {statusLabels[status]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Orders table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Lista de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum pedido encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Pedido</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Cliente</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Data</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <span className="font-medium text-foreground text-sm">{order.orderNumber}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground hidden sm:table-cell">{order.customerName}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">{formatDate(order.createdAt)}</td>
                      <td className="py-3 px-4 text-sm font-medium text-foreground">{formatPrice(Number(order.total))}</td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild disabled={updatingStatus === order.id}>
                            <button className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                              {updatingStatus === order.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                statusLabels[order.status]
                              )}
                              <ChevronDown className="h-3 w-3" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {statusOptions.map((status) => (
                              <DropdownMenuItem 
                                key={status} 
                                onClick={() => updateOrderStatus(order.id, status)}
                              >
                                {statusLabels[status]}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order details dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Pedido {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 py-4">
              {/* Customer info */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Informações do Cliente</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><span className="font-medium text-foreground">Nome:</span> {selectedOrder.customerName}</p>
                  <p><span className="font-medium text-foreground">E-mail:</span> {selectedOrder.customerEmail}</p>
                  {selectedOrder.customerPhone && (
                    <p><span className="font-medium text-foreground">Telefone:</span> {selectedOrder.customerPhone}</p>
                  )}
                </div>
              </div>

              {/* Shipping info */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Informações de Entrega</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <span className="font-medium text-foreground">Endereço:</span>{' '}
                    {selectedOrder.address}
                    {selectedOrder.number && `, ${selectedOrder.number}`}
                    {selectedOrder.complement && ` - ${selectedOrder.complement}`}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Bairro:</span>{' '}
                    {selectedOrder.neighborhood || '-'}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Cidade:</span>{' '}
                    {selectedOrder.city} - {selectedOrder.state}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">CEP:</span>{' '}
                    {selectedOrder.zipCode}
                  </p>
                  {selectedOrder.shippingMethod && (
                    <p>
                      <span className="font-medium text-foreground">Método de Envio:</span>{' '}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {selectedOrder.shippingMethod}
                      </span>
                    </p>
                  )}
                  <p>
                    <span className="font-medium text-foreground">Valor do Frete:</span>{' '}
                    <span className={Number(selectedOrder.shipping) === 0 ? 'text-green-600' : ''}>
                      {Number(selectedOrder.shipping) === 0 ? 'Grátis' : formatPrice(Number(selectedOrder.shipping))}
                    </span>
                  </p>
                </div>
              </div>

              {/* Order items */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Itens do Pedido</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
                      <span className="text-muted-foreground">
                        {item.quantity}x {item.product.name}
                      </span>
                      <span className="font-medium text-foreground">{formatPrice(Number(item.price) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(Number(selectedOrder.subtotal))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-foreground">{formatPrice(Number(selectedOrder.shipping))}</span>
                </div>
                {Number(selectedOrder.discount) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Desconto</span>
                    <span className="text-green-600">-{formatPrice(Number(selectedOrder.discount))}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="text-xl font-semibold text-primary">{formatPrice(Number(selectedOrder.total))}</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedOrder.status]}`}>
                  {statusLabels[selectedOrder.status]}
                </span>
              </div>

              {/* Payment */}
              {selectedOrder.payment && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Pagamento</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedOrder.payment.status === 'PAID' ? 'bg-green-100 text-green-800' :
                    selectedOrder.payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedOrder.payment.status === 'PAID' ? 'Pago' :
                     selectedOrder.payment.status === 'PENDING' ? 'Aguardando' : 'Falhou'}
                  </span>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
