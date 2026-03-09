"use client"

import { useState } from 'react'
import { Search, Eye, ChevronDown } from 'lucide-react'
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

const initialOrders = [
  {
    id: 'OC001234',
    customer: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '(11) 99999-1234',
    date: '09/03/2026',
    total: 349.90,
    status: 'Enviado',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    items: [
      { name: 'Anel Serena Dourado', quantity: 1, price: 189.90 },
      { name: 'Brinco Gota Cristal', quantity: 1, price: 159.90 },
    ]
  },
  {
    id: 'OC001233',
    customer: 'Ana Santos',
    email: 'ana.santos@email.com',
    phone: '(11) 99999-5678',
    date: '09/03/2026',
    total: 189.90,
    status: 'Processando',
    address: 'Av. Brasil, 456 - Rio de Janeiro, RJ',
    items: [
      { name: 'Anel Serena Dourado', quantity: 1, price: 189.90 },
    ]
  },
  {
    id: 'OC001232',
    customer: 'Julia Costa',
    email: 'julia.costa@email.com',
    phone: '(11) 99999-9012',
    date: '08/03/2026',
    total: 529.80,
    status: 'Entregue',
    address: 'Rua Augusta, 789 - São Paulo, SP',
    items: [
      { name: 'Colar Pérolas Delicadas', quantity: 1, price: 299.90 },
      { name: 'Pulseira Elos Finos', quantity: 1, price: 219.90 },
    ]
  },
  {
    id: 'OC001231',
    customer: 'Carla Oliveira',
    email: 'carla.oliveira@email.com',
    phone: '(11) 99999-3456',
    date: '08/03/2026',
    total: 219.90,
    status: 'Pendente',
    address: 'Rua das Palmeiras, 321 - Belo Horizonte, MG',
    items: [
      { name: 'Pulseira Elos Finos', quantity: 1, price: 219.90 },
    ]
  },
  {
    id: 'OC001230',
    customer: 'Beatriz Lima',
    email: 'beatriz.lima@email.com',
    phone: '(11) 99999-7890',
    date: '07/03/2026',
    total: 659.70,
    status: 'Entregue',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    items: [
      { name: 'Anel Solitário Elegance', quantity: 1, price: 349.90 },
      { name: 'Colar Pérolas Delicadas', quantity: 1, price: 299.90 },
    ]
  },
  {
    id: 'OC001229',
    customer: 'Fernanda Rocha',
    email: 'fernanda.rocha@email.com',
    phone: '(11) 99999-2345',
    date: '07/03/2026',
    total: 159.90,
    status: 'Cancelado',
    address: 'Rua do Sol, 567 - Salvador, BA',
    items: [
      { name: 'Brinco Gota Cristal', quantity: 1, price: 159.90 },
    ]
  },
]

const statusColors: Record<string, string> = {
  'Pendente': 'bg-yellow-100 text-yellow-800',
  'Processando': 'bg-blue-100 text-blue-800',
  'Enviado': 'bg-purple-100 text-purple-800',
  'Entregue': 'bg-green-100 text-green-800',
  'Cancelado': 'bg-red-100 text-red-800',
}

const statusOptions = ['Pendente', 'Processando', 'Enviado', 'Entregue', 'Cancelado']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<typeof initialOrders[0] | null>(null)

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !filterStatus || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-light text-foreground">
          Gerenciar <span className="font-medium italic">Pedidos</span>
        </h2>
        <p className="text-muted-foreground mt-1">
          {orders.length} pedidos no total
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
              {filterStatus || 'Todos os Status'}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterStatus(null)}>
              Todos os Status
            </DropdownMenuItem>
            {statusOptions.map((status) => (
              <DropdownMenuItem key={status} onClick={() => setFilterStatus(status)}>
                {status}
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
                      <span className="font-medium text-foreground text-sm">{order.id}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground hidden sm:table-cell">{order.customer}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">{order.date}</td>
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{formatPrice(order.total)}</td>
                    <td className="py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                            {order.status}
                            <ChevronDown className="h-3 w-3" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {statusOptions.map((status) => (
                            <DropdownMenuItem 
                              key={status} 
                              onClick={() => updateOrderStatus(order.id, status)}
                            >
                              {status}
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
        </CardContent>
      </Card>

      {/* Order details dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Pedido {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 py-4">
              {/* Customer info */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Informações do Cliente</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><span className="font-medium text-foreground">Nome:</span> {selectedOrder.customer}</p>
                  <p><span className="font-medium text-foreground">E-mail:</span> {selectedOrder.email}</p>
                  <p><span className="font-medium text-foreground">Telefone:</span> {selectedOrder.phone}</p>
                  <p><span className="font-medium text-foreground">Endereço:</span> {selectedOrder.address}</p>
                </div>
              </div>

              {/* Order items */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Itens do Pedido</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
                      <span className="text-muted-foreground">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium text-foreground">{formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="font-medium text-foreground">Total</span>
                <span className="text-xl font-semibold text-primary">{formatPrice(selectedOrder.total)}</span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
