"use client"

import { useState } from 'react'
import { Search, Mail, Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const customers = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '(11) 99999-1234',
    orders: 5,
    totalSpent: 1549.50,
    lastOrder: '09/03/2026',
  },
  {
    id: '2',
    name: 'Ana Santos',
    email: 'ana.santos@email.com',
    phone: '(11) 99999-5678',
    orders: 3,
    totalSpent: 869.70,
    lastOrder: '09/03/2026',
  },
  {
    id: '3',
    name: 'Julia Costa',
    email: 'julia.costa@email.com',
    phone: '(11) 99999-9012',
    orders: 8,
    totalSpent: 2847.20,
    lastOrder: '08/03/2026',
  },
  {
    id: '4',
    name: 'Carla Oliveira',
    email: 'carla.oliveira@email.com',
    phone: '(11) 99999-3456',
    orders: 2,
    totalSpent: 439.80,
    lastOrder: '08/03/2026',
  },
  {
    id: '5',
    name: 'Beatriz Lima',
    email: 'beatriz.lima@email.com',
    phone: '(11) 99999-7890',
    orders: 12,
    totalSpent: 4789.80,
    lastOrder: '07/03/2026',
  },
  {
    id: '6',
    name: 'Fernanda Rocha',
    email: 'fernanda.rocha@email.com',
    phone: '(11) 99999-2345',
    orders: 1,
    totalSpent: 159.90,
    lastOrder: '07/03/2026',
  },
]

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-light text-foreground">
          Gerenciar <span className="font-medium italic">Clientes</span>
        </h2>
        <p className="text-muted-foreground mt-1">
          {customers.length} clientes cadastrados
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customers table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Cliente</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Contato</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Pedidos</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total Gasto</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Último Pedido</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-primary">
                            {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{customer.name}</p>
                          <p className="text-xs text-muted-foreground md:hidden">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground hidden sm:table-cell">
                      {customer.orders} pedidos
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-primary">
                      {formatPrice(customer.totalSpent)}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground hidden lg:table-cell">
                      {customer.lastOrder}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
